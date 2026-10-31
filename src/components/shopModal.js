// Star shop: spend stars on clothes and accessories for the child's drawn boy/girl character.
// Tapping an item tries it on; an item not yet bought is only kept once it is paid for.
import { storage } from '../storage.js';
import { sfx } from '../audio/sfx.js';
import { SHOP_SLOTS, SETS_TAB, SKIN_TONES, HAIR_COLORS, characterSvg, itemThumbSvg, itemsForSlot, setsFor, shopItem } from '../engine/character.js';

const LOOK_TAB = 'look';
// Slots a child may leave empty
const OPTIONAL_SLOTS = ['hat', 'glasses', 'pet'];

export function renderShopModal(modalContainer, onClosed) {
  const profile = storage.getActiveProfile();

  const closeModal = () => {
    modalContainer.innerHTML = '';
    if (onClosed) onClosed();
  };

  const attachClose = () => {
    modalContainer.querySelector('#btn-close-shop').addEventListener('click', closeModal);
    modalContainer.querySelector('#shop-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'shop-backdrop') closeModal();
    });
  };

  if (profile.gender !== 'boy' && profile.gender !== 'girl') {
    renderGenderChoice(modalContainer, profile, attachClose, () => renderShopModal(modalContainer, onClosed));
    return;
  }

  let activeTab = SETS_TAB.key;
  let tryOn = null; // { name, ids } of an item or outfit shown on the character but not fully bought

  const look = () => {
    const character = storage.getCharacter(profile);
    const equipped = { ...character.equipped };
    if (tryOn) tryOn.ids.forEach(id => { equipped[shopItem(id).slot] = id; });
    return { gender: profile.gender, skin: character.skin, hair: character.hair, equipped };
  };

  const isOwned = (item) => item.cost === 0 || storage.getCharacter(profile).owned.includes(item.id);
  // Pieces already owned cost nothing
  const priceOf = (items) => items.filter(item => !isOwned(item)).reduce((sum, item) => sum + item.cost, 0);

  const equipItems = (items) => {
    const equipped = { ...storage.getCharacter(profile).equipped };
    items.forEach(item => { equipped[item.slot] = item.id; });
    storage.updateCharacter({ equipped });
  };

  modalContainer.innerHTML = `
    <div id="shop-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-amber-300 animate-pop max-h-[94vh] overflow-y-auto">
        <div class="sticky top-0 z-10 bg-white px-4 pt-3 pb-2 border-b-2 border-amber-100">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-lg font-black text-slate-800">🛍️ החנות של ${profile.name}</h2>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1 bg-amber-50 border-2 border-amber-300 px-2.5 py-0.5 rounded-2xl text-amber-900 font-black">
                <span>⭐</span><span id="shop-balance"></span>
              </div>
              <button id="btn-close-shop" class="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 leading-none cursor-pointer">&times;</button>
            </div>
          </div>
          <div id="shop-preview" class="flex justify-center"></div>
          <div id="shop-action" class="mt-2"></div>
        </div>
        <div class="p-3">
          <div id="shop-tabs" class="flex flex-wrap justify-center gap-1.5 mb-3"></div>
          <div id="shop-items" class="grid grid-cols-3 sm:grid-cols-4 gap-2"></div>
        </div>
      </div>
    </div>
  `;
  attachClose();

  const refresh = () => {
    modalContainer.querySelector('#shop-balance').textContent = storage.getStarBalance(profile);
    modalContainer.querySelector('#shop-preview').innerHTML = characterSvg(look(), {
      className: 'rounded-2xl border-2 border-slate-200',
      style: 'height:min(30vh,200px)'
    });
    renderAction();
    renderTabs();
    if (activeTab === LOOK_TAB) renderLookTab();
    else if (activeTab === SETS_TAB.key) renderSets();
    else renderItems();
  };

  // Under the character: what the tried-on item or outfit costs, or how many stars are still missing
  const renderAction = () => {
    const mount = modalContainer.querySelector('#shop-action');
    if (!tryOn) {
      mount.innerHTML = '<p class="text-center text-xs font-bold text-slate-500 py-2">לחצו על פריט כדי למדוד אותו 👇</p>';
      return;
    }
    const items = tryOn.ids.map(shopItem);
    const cost = priceOf(items);
    const missing = cost - storage.getStarBalance(profile);
    if (missing > 0) {
      mount.innerHTML = `<div class="text-center font-extrabold text-amber-800 bg-amber-50 border-2 border-amber-200 rounded-xl py-2 text-sm">${tryOn.name} – חסרים עוד ${missing} ⭐</div>`;
      return;
    }
    mount.innerHTML = `<button id="btn-buy-item" class="w-full btn-tactile bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-2 rounded-xl border-b-4 border-emerald-700 cursor-pointer">קונים ${tryOn.name} ב-${cost} ⭐</button>`;
    mount.querySelector('#btn-buy-item').addEventListener('click', () => {
      if (!storage.buyItems(items)) return;
      equipItems(items);
      tryOn = null;
      sfx.playVictory();
      refresh();
    });
  };

  const renderTabs = () => {
    const tabs = [SETS_TAB, ...SHOP_SLOTS, { key: LOOK_TAB, label: 'המראה שלי', emoji: '🎨' }];
    const mount = modalContainer.querySelector('#shop-tabs');
    mount.innerHTML = tabs.map(tab => `
      <button data-tab="${tab.key}" class="shop-tab px-2 py-1 rounded-xl border-2 font-bold text-xs cursor-pointer ${tab.key === activeTab ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}">
        ${tab.emoji} ${tab.label}
      </button>
    `).join('');
    mount.querySelectorAll('.shop-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        tryOn = null;
        sfx.playClick();
        refresh();
      });
    });
  };

  const renderItems = () => {
    const { equipped } = storage.getCharacter(profile);
    const items = itemsForSlot(activeTab, profile.gender);
    const shown = tryOn ? tryOn.ids[0] : equipped[activeTab];
    // A slot that has a free default wears it until something else is chosen
    const selectedId = shown || items.find(item => item.cost === 0)?.id || null;

    const noneTile = OPTIONAL_SLOTS.includes(activeTab) ? `
      <button data-item="" class="shop-item rounded-2xl border-2 p-1.5 flex flex-col items-center cursor-pointer ${!selectedId ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}">
        <span class="w-full aspect-square flex items-center justify-center text-3xl text-slate-300">✖</span>
        <span class="text-[11px] font-bold text-slate-700 leading-tight">בלי</span>
      </button>
    ` : '';

    const mount = modalContainer.querySelector('#shop-items');
    mount.innerHTML = noneTile + items.map(item => `
      <button data-item="${item.id}" class="shop-item rounded-2xl border-2 p-1.5 flex flex-col items-center cursor-pointer ${item.id === selectedId ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50'}">
        <span class="w-full aspect-square block rounded-xl overflow-hidden bg-slate-50">${itemThumbSvg(item)}</span>
        <span class="text-[11px] font-bold text-slate-700 leading-tight mt-1 text-center">${item.name}</span>
        <span class="text-xs font-black ${isOwned(item) ? 'text-emerald-600' : 'text-amber-700'}">${isOwned(item) ? '✓ שלי' : `${item.cost} ⭐`}</span>
      </button>
    `).join('');

    mount.querySelectorAll('.shop-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = shopItem(btn.dataset.item);
        sfx.playClick();
        if (item && !isOwned(item)) {
          tryOn = { name: item.name, ids: [item.id] };
        } else {
          tryOn = null;
          const next = { ...storage.getCharacter(profile).equipped };
          if (item) next[activeTab] = item.id;
          else delete next[activeTab];
          storage.updateCharacter({ equipped: next });
        }
        refresh();
      });
    });
  };

  // Whole outfits: tapping tries on all the pieces; the price counts only the pieces still missing
  const renderSets = () => {
    const character = storage.getCharacter(profile);
    const current = look().equipped;
    const sets = setsFor(profile.gender);

    const mount = modalContainer.querySelector('#shop-items');
    mount.innerHTML = sets.map(set => {
      const items = set.pieces.map(shopItem);
      const price = priceOf(items);
      const worn = items.every(item => current[item.slot] === item.id);
      const equipped = Object.fromEntries(items.map(item => [item.slot, item.id]));
      return `
        <button data-set="${set.id}" class="shop-set rounded-2xl border-2 p-1.5 flex flex-col items-center cursor-pointer ${worn ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50'}">
          <span class="w-full block rounded-xl overflow-hidden">${characterSvg({ gender: profile.gender, skin: character.skin, hair: character.hair, equipped }, { className: 'w-full block' })}</span>
          <span class="text-[11px] font-bold text-slate-700 leading-tight mt-1 text-center">${set.name}</span>
          <span class="text-xs font-black ${price === 0 ? 'text-emerald-600' : 'text-amber-700'}">${price === 0 ? '✓ שלי' : `${price} ⭐`}</span>
        </button>
      `;
    }).join('');

    mount.querySelectorAll('.shop-set').forEach(btn => {
      btn.addEventListener('click', () => {
        const set = sets.find(s => s.id === btn.dataset.set);
        const items = set.pieces.map(shopItem);
        sfx.playClick();
        if (priceOf(items) === 0) {
          tryOn = null;
          equipItems(items);
        } else {
          tryOn = { name: `תלבושת ${set.name}`, ids: set.pieces };
        }
        refresh();
      });
    });
  };

  // Skin and hair are free: every child can look like themselves from the start
  const renderLookTab = () => {
    const character = storage.getCharacter(profile);
    const swatches = (colors, field) => colors.map((color, i) => `
      <button data-field="${field}" data-index="${i}" class="look-swatch w-11 h-11 rounded-full border-4 cursor-pointer ${character[field] === i ? 'border-indigo-500' : 'border-slate-200'}" style="background:${color}" aria-label="${i + 1}"></button>
    `).join('');

    const mount = modalContainer.querySelector('#shop-items');
    mount.innerHTML = `
      <div class="col-span-3 sm:col-span-4 space-y-3">
        <div>
          <div class="text-xs font-bold text-slate-600 mb-1.5 text-center">צבע עור</div>
          <div class="flex justify-center gap-2">${swatches(SKIN_TONES, 'skin')}</div>
        </div>
        <div>
          <div class="text-xs font-bold text-slate-600 mb-1.5 text-center">צבע שיער</div>
          <div class="flex justify-center gap-2">${swatches(HAIR_COLORS, 'hair')}</div>
        </div>
      </div>
    `;
    mount.querySelectorAll('.look-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        storage.updateCharacter({ [btn.dataset.field]: Number(btn.dataset.index) });
        sfx.playClick();
        refresh();
      });
    });
  };

  refresh();
}

// Profiles without a gender choose once here; it's saved on the profile and can be changed in the profile list
function renderGenderChoice(modalContainer, profile, attachClose, onChosen) {
  const options = [
    { key: 'boy', label: 'בן' },
    { key: 'girl', label: 'בת' }
  ];
  modalContainer.innerHTML = `
    <div id="shop-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-sm w-full p-5 text-center shadow-2xl border-4 border-amber-300 animate-pop">
        <div class="flex justify-end -mt-2 -mb-2">
          <button id="btn-close-shop" class="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 leading-none cursor-pointer">&times;</button>
        </div>
        <h2 class="text-xl font-black text-slate-800 mb-3">🛍️ הדמות של ${profile.name}: בן או בת?</h2>
        <div class="grid grid-cols-2 gap-3">
          ${options.map(option => `
            <button data-gender="${option.key}" class="shop-gender-btn btn-tactile rounded-2xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 p-2 font-black text-lg text-indigo-950 cursor-pointer">
              ${characterSvg({ gender: option.key }, { className: 'w-full rounded-xl mb-1' })}
              ${option.label}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  attachClose();
  modalContainer.querySelectorAll('.shop-gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      storage.updateProfile(profile.id, { gender: btn.dataset.gender });
      sfx.playSuccess();
      onChosen();
    });
  });
}
