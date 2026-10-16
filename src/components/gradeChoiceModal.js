// One-time question for profiles created before grades existed (ageGroup '8-9'): grade 3 or grade 4?
// The answer is saved on the profile; progress, stars and history are kept.
import { storage } from '../storage.js';
import { sfx } from '../audio/sfx.js';
import { SELECTABLE_GRADES } from '../data/grades.js';

export function renderGradeChoiceModal(modalContainer, profile, onChosen) {
  // Old '8-9' profiles are grade 3 or grade 4
  const choices = SELECTABLE_GRADES.filter(g => g.key === '3' || g.key === '4');

  modalContainer.innerHTML = `
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-4 border-indigo-200 animate-pop">
        <div class="text-4xl mb-2">${profile.avatar || '🎓'}</div>
        <h3 class="text-xl font-black text-slate-800 mb-1">באיזו כיתה ${profile.name}?</h3>
        <p class="text-xs font-semibold text-slate-500 mb-4">
          עכשיו יש תרגילים נפרדים לכיתה ג' ולכיתה ד'. הכוכבים וההתקדמות נשמרים.
        </p>
        <div class="grid grid-cols-2 gap-3">
          ${choices.map(g => `
            <button data-grade="${g.key}" class="grade-choice-btn btn-tactile py-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 font-black text-lg text-indigo-950 cursor-pointer">
              ${g.emoji}<br>${g.label}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  modalContainer.querySelectorAll('.grade-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const grade = btn.dataset.grade;
      storage.updateProfile(profile.id, { grade, ageGroup: grade });
      sfx.playSuccess();
      modalContainer.innerHTML = '';
      if (onChosen) onChosen();
    });
  });
}
