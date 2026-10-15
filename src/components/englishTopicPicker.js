// English topic picker (age 5): choose one topic or mix, letters only, and a "listen only" toggle.
// The choice is saved per child profile (englishTopic, englishListenOnly).
import { getEnglishTopicChips } from '../data/age5/english.js';
import { sfx } from '../audio/sfx.js';

export function renderEnglishTopicPicker(container, profile, onChange) {
  const current = profile?.englishTopic || null;
  const listenOnly = Boolean(profile?.englishListenOnly);

  const chips = [
    { key: null, label: 'הכל', emoji: '🌈' },
    { key: 'letters', label: 'אותיות', emoji: '🔤' },
    ...getEnglishTopicChips()
  ];

  const chipClass = (active) => active
    ? 'bg-emerald-600 text-white border-emerald-700'
    : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50';

  container.innerHTML = `
    <div class="max-w-2xl mx-auto mb-3">
      <div class="flex gap-2 overflow-x-auto pb-2 px-1" style="scrollbar-width:thin">
        ${chips.map(chip => `
          <button data-topic="${chip.key ?? ''}"
            class="topic-chip shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 text-sm font-bold whitespace-nowrap cursor-pointer transition-all ${chipClass(chip.key === current)}">
            <span class="text-lg">${chip.emoji}</span><span>${chip.label}</span>
          </button>
        `).join('')}
      </div>
      <button id="listen-only-toggle"
        class="mt-1 flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 text-sm font-bold cursor-pointer transition-all ${chipClass(listenOnly)}"
        aria-pressed="${listenOnly}">
        <span class="text-lg">👂</span><span>רק להקשיב (בלי לראות את המילה)</span>
      </button>
    </div>
  `;

  container.querySelectorAll('.topic-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      onChange({ englishTopic: btn.dataset.topic || null, englishListenOnly: listenOnly });
    });
  });

  container.querySelector('#listen-only-toggle').addEventListener('click', () => {
    sfx.playClick();
    onChange({ englishTopic: current, englishListenOnly: !listenOnly });
  });

  // Keep the selected topic visible when the row scrolls
  container.querySelector('.topic-chip.bg-emerald-600')?.scrollIntoView({ block: 'nearest', inline: 'center' });
}
