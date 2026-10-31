// Header component with active profile, stars, parent report, audio settings
import { storage } from '../storage.js';
import { sfx } from '../audio/sfx.js';
import { gradeOfProfile, gradeLabel } from '../data/grades.js';
import { characterSvg } from '../engine/character.js';

export function renderHeader(container, onOpenProfileModal, onOpenParentModal, onOpenShop) {
  const profile = storage.getActiveProfile();
  const settings = storage.getSettings();
  const character = storage.getCharacter(profile);

  const grade = gradeOfProfile(profile);
  const ageLabel = grade ? gradeLabel(grade) : 'יש לבחור כיתה';

  container.innerHTML = `
    <header class="w-full bg-white/95 backdrop-blur-md border-b-4 border-indigo-100 shadow-sm sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        
        <!-- Kid Profile Button -->
        <button id="btn-profile-badge" class="flex items-center gap-1.5 sm:gap-2.5 min-w-0 bg-indigo-50 hover:bg-indigo-100 active:scale-95 transition-all p-1.5 px-2 sm:px-3 rounded-2xl border-2 border-indigo-200 shadow-sm cursor-pointer">
          <span class="text-3xl filter drop-shadow">${profile.avatar}</span>
          <div class="text-right min-w-0">
            <div class="font-extrabold text-indigo-950 text-base leading-tight truncate">${profile.name}</div>
            <div class="text-xs font-semibold text-indigo-600 truncate">${ageLabel}</div>
          </div>
          <span class="hidden sm:inline text-xs bg-indigo-200 text-indigo-800 rounded-full px-1.5 py-0.5 mr-1 font-bold">החלף</span>
        </button>

        <!-- Logo / App Title -->
        <div class="hidden sm:flex items-center gap-1.5 font-black text-xl text-slate-800">
          <span class="text-2xl animate-bounce-gentle">🌟</span>
          <span>לומדים בכיף</span>
        </div>

        <!-- Controls: Parent Report, Stars & Audio -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          <!-- Parent Report Button -->
          <button id="btn-parent-report" class="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all px-2.5 py-1.5 rounded-2xl border-2 border-slate-300 shadow-sm text-slate-700 font-bold text-xs cursor-pointer" title="דוח מעקב להורים">
            <span class="text-base">📊</span>
            <span class="hidden xs:inline">להורים</span>
          </button>

          <!-- Stars to spend: opens the shop -->
          <button id="btn-open-shop" class="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 active:scale-95 transition-all border-2 border-amber-300 px-2 py-1 rounded-2xl shadow-sm text-amber-900 font-black cursor-pointer" title="החנות">
            ${profile.gender ? characterSvg({ gender: profile.gender, ...character }, { className: 'w-7 h-7', headOnly: true }) : '<span class="text-xl">🛍️</span>'}
            <span class="text-lg">⭐</span>
            <span id="header-stars-count" class="text-lg">${storage.getStarBalance(profile)}</span>
          </button>

          <!-- Sound FX Toggle -->
          <button id="btn-toggle-sound" class="p-2 rounded-2xl border-2 transition-all cursor-pointer ${settings.sound ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-100 border-slate-300 text-slate-400'}" title="צלילים">
            <span class="text-lg">${settings.sound ? '🔊' : '🔇'}</span>
          </button>
        </div>

      </div>
    </header>
  `;

  // Attach event listeners
  const profileBtn = container.querySelector('#btn-profile-badge');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      sfx.playClick();
      if (onOpenProfileModal) onOpenProfileModal();
    });
  }

  const parentBtn = container.querySelector('#btn-parent-report');
  if (parentBtn) {
    parentBtn.addEventListener('click', () => {
      sfx.playClick();
      if (onOpenParentModal) onOpenParentModal();
    });
  }

  const shopBtn = container.querySelector('#btn-open-shop');
  if (shopBtn) {
    shopBtn.addEventListener('click', () => {
      sfx.playClick();
      if (onOpenShop) onOpenShop();
    });
  }

  const soundBtn = container.querySelector('#btn-toggle-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const current = storage.getSettings().sound;
      const next = !current;
      storage.updateSettings({ sound: next });
      sfx.toggleSound(next);
      if (next) sfx.playSuccess();
      renderHeader(container, onOpenProfileModal, onOpenParentModal, onOpenShop);
    });
  }
}

export function updateHeaderStars(count) {
  const elem = document.getElementById('header-stars-count');
  if (elem) {
    elem.textContent = count;
    elem.parentElement.classList.add('animate-pop');
    setTimeout(() => elem.parentElement.classList.remove('animate-pop'), 400);
  }
}
