// Profile Manager Modal: create and switch kid profiles
import { storage } from '../storage.js';
import { sfx } from '../audio/sfx.js';
import { SELECTABLE_GRADES, gradeOfProfile, gradeLabel } from '../data/grades.js';

export function renderProfileModal(modalContainer, onProfileChanged) {
  const profiles = storage.getProfiles();
  const activeProfile = storage.getActiveProfile();
  const avatars = storage.getAvatars();

  let selectedAvatar = '🦁';
  let selectedGrade = 'gan';

  modalContainer.innerHTML = `
    <div id="modal-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-indigo-200 animate-pop max-h-[90vh] overflow-y-auto">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b pb-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="text-3xl">👨‍👩‍👧‍👦</span>
            <h2 class="text-xl font-black text-slate-800">פרופילי למידה</h2>
          </div>
          <button id="btn-close-modal" class="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 leading-none cursor-pointer">&times;</button>
        </div>

        <!-- Existing Profiles List -->
        <div class="mb-6">
          <h3 class="text-sm font-bold text-slate-500 mb-2">בחרו פרופיל פעיל:</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${profiles.map(p => {
              const isActive = p.id === activeProfile.id;
              const grade = gradeOfProfile(p);
              return `
                <div class="flex items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer ${isActive ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}">
                  <div class="flex items-center gap-2.5 select-profile-item flex-1" data-id="${p.id}">
                    <span class="text-3xl">${p.avatar}</span>
                    <div class="text-right">
                      <div class="font-bold text-slate-900">${p.name}</div>
                      <div class="text-xs text-indigo-600 font-semibold">${grade ? gradeLabel(grade) : 'יש לבחור כיתה'} • ⭐ ${p.stars || 0}</div>
                    </div>
                  </div>
                  <select class="grade-change-select text-xs font-bold rounded-lg border border-slate-300 bg-white px-1 py-1 ml-1" data-id="${p.id}" title="שינוי כיתה">
                    ${!grade ? '<option value="" selected>כיתה?</option>' : ''}
                    ${SELECTABLE_GRADES.map(g => `<option value="${g.key}" ${g.key === grade ? 'selected' : ''}>${g.label}</option>`).join('')}
                  </select>
                  ${profiles.length > 1 ? `
                    <button class="delete-profile-btn text-rose-400 hover:text-rose-600 p-1.5 text-sm" data-id="${p.id}" title="מחק פרופיל">🗑️</button>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Add New Profile Form -->
        <div class="bg-indigo-50/70 p-4 rounded-2xl border-2 border-indigo-100">
          <h3 class="text-base font-black text-indigo-950 mb-3 flex items-center gap-1.5">
            <span>➕</span> הוספת ילד/ה חדש/ה
          </h3>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">שם הילד/ה:</label>
              <input type="text" id="new-kid-name" placeholder="למשל: יונתן / מאיה" class="w-full px-3 py-2 text-base rounded-xl border-2 border-indigo-200 focus:outline-none focus:border-indigo-500 bg-white" />
            </div>

            <!-- Grade selection -->
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">כיתה / שלב לימוד:</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                ${SELECTABLE_GRADES.map((g, i) => `
                  <button type="button" class="age-select-btn p-2 rounded-xl border-2 font-bold text-xs sm:text-sm text-center transition-all ${i === 0 ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}" data-grade="${g.key}">
                    ${g.emoji} ${g.label}<br><span class="text-[11px] font-semibold opacity-80">${g.hint}</span>
                  </button>
                `).join('')}
              </div>
            </div>
            <!-- Avatar selection -->
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">בחרו סמל / דמות:</label>
              <div class="flex flex-wrap gap-2 justify-center">
                ${avatars.map((av, i) => `
                  <button type="button" class="avatar-select-btn text-2xl p-1.5 rounded-xl border-2 transition-transform hover:scale-110 ${i === 0 ? 'border-indigo-500 bg-white shadow-sm' : 'border-transparent bg-slate-100/60'}" data-avatar="${av}">
                    ${av}
                  </button>
                `).join('')}
              </div>
            </div>

            <button type="button" id="btn-save-new-profile" class="w-full btn-tactile bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-2.5 rounded-xl border-b-4 border-emerald-700 mt-2 text-base shadow-emerald-200 cursor-pointer">
              שמור והתחל ללמוד! 🎉
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  // Close modal
  const closeModal = () => {
    modalContainer.innerHTML = '';
  };

  modalContainer.querySelector('#btn-close-modal').addEventListener('click', closeModal);
  modalContainer.querySelector('#modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') closeModal();
  });

  // Switch profile
  modalContainer.querySelectorAll('.select-profile-item').forEach(item => {
    item.addEventListener('click', () => {
      const pid = item.dataset.id;
      storage.setActiveProfile(pid);
      sfx.playSuccess();
      closeModal();
      if (onProfileChanged) onProfileChanged();
    });
  });

  // Delete profile
  modalContainer.querySelectorAll('.delete-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = btn.dataset.id;
      if (confirm('האם למחוק את הפרופיל?')) {
        storage.deleteProfile(pid);
        sfx.playClick();
        renderProfileModal(modalContainer, onProfileChanged);
        if (onProfileChanged) onProfileChanged();
      }
    });
  });

  // Change an existing child's grade (e.g. moving up a year)
  modalContainer.querySelectorAll('.grade-change-select').forEach(select => {
    select.addEventListener('click', (e) => e.stopPropagation());
    select.addEventListener('change', () => {
      const grade = select.value;
      if (!grade) return;
      storage.updateProfile(select.dataset.id, { grade, ageGroup: grade === 'gan' ? '5' : grade });
      sfx.playClick();
      renderProfileModal(modalContainer, onProfileChanged);
      if (onProfileChanged) onProfileChanged();
    });
  });

  // Grade select buttons (new profile)
  modalContainer.querySelectorAll('.age-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalContainer.querySelectorAll('.age-select-btn').forEach(b => {
        b.className = 'age-select-btn p-2 rounded-xl border-2 font-bold text-xs sm:text-sm text-center transition-all bg-white text-slate-700 border-slate-300 hover:bg-slate-50';
      });
      btn.className = 'age-select-btn p-2 rounded-xl border-2 font-bold text-xs sm:text-sm text-center transition-all bg-indigo-600 text-white border-indigo-700';
      selectedGrade = btn.dataset.grade;
      sfx.playClick();
    });
  });

  // Avatar select buttons
  modalContainer.querySelectorAll('.avatar-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalContainer.querySelectorAll('.avatar-select-btn').forEach(b => {
        b.className = 'avatar-select-btn text-2xl p-1.5 rounded-xl border-2 transition-transform hover:scale-110 border-transparent bg-slate-100/60';
      });
      btn.className = 'avatar-select-btn text-2xl p-1.5 rounded-xl border-2 transition-transform hover:scale-110 border-indigo-500 bg-white shadow-sm';
      selectedAvatar = btn.dataset.avatar;
      sfx.playClick();
    });
  });

  // Save new profile
  modalContainer.querySelector('#btn-save-new-profile').addEventListener('click', () => {
    const nameInput = modalContainer.querySelector('#new-kid-name');
    const name = nameInput.value.trim();
    if (!name) {
      alert('נא להזין שם לילד/ה');
      nameInput.focus();
      return;
    }

    storage.createProfile(name, selectedGrade, selectedAvatar);
    sfx.playVictory();
    closeModal();
    if (onProfileChanged) onProfileChanged();
  });
}
