// Subject navigation tabs (Hebrew, Math, English)
import { sfx } from '../audio/sfx.js';

export function renderSubjectNav(container, activeSubject, onSubjectChange) {
  const subjects = [
    {
      id: 'hebrew',
      label: 'עברית',
      sublabel: 'שפה וקריאה',
      emoji: '📖',
      activeColor: 'bg-orange-500 text-white border-orange-600 shadow-orange-200',
      idleColor: 'bg-white text-orange-950 border-orange-200 hover:bg-orange-50'
    },
    {
      id: 'math',
      label: 'חשבון',
      sublabel: 'מספרים וצורות',
      emoji: '🔢',
      activeColor: 'bg-blue-600 text-white border-blue-700 shadow-blue-200',
      idleColor: 'bg-white text-blue-950 border-blue-200 hover:bg-blue-50'
    },
    {
      id: 'english',
      label: 'English',
      sublabel: 'אנגלית',
      emoji: '🔤',
      activeColor: 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-200',
      idleColor: 'bg-white text-emerald-950 border-emerald-200 hover:bg-emerald-50'
    }
  ];

  container.innerHTML = `
    <nav class="max-w-4xl mx-auto px-4 pt-4 pb-2">
      <div class="grid grid-cols-3 gap-2.5 sm:gap-4">
        ${subjects.map(sub => {
          const isActive = sub.id === activeSubject;
          const colorClass = isActive ? sub.activeColor : sub.idleColor;
          return `
            <button 
              data-subject="${sub.id}"
              class="subject-tab btn-tactile flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 py-2.5 sm:py-3.5 px-2 rounded-2xl border-b-4 font-bold transition-all cursor-pointer ${colorClass} ${isActive ? 'scale-[1.02]' : 'opacity-90'}">
              <span class="text-2xl sm:text-3xl filter drop-shadow">${sub.emoji}</span>
              <div class="text-center sm:text-right">
                <div class="text-base sm:text-lg font-black leading-tight">${sub.label}</div>
                <div class="text-[11px] sm:text-xs opacity-80 font-medium hidden xs:block">${sub.sublabel}</div>
              </div>
            </button>
          `;
        }).join('')}
      </div>
    </nav>
  `;

  // Attach tab events
  container.querySelectorAll('.subject-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.subject;
      if (selected !== activeSubject) {
        sfx.playClick();
        onSubjectChange(selected);
      }
    });
  });
}
