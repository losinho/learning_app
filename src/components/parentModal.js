// Parent Analytics & Learning Difficulty Report Modal
import { storage } from '../storage.js';
import { sfx } from '../audio/sfx.js';
import { speech } from '../audio/speech.js';
import { gradeOfProfile, gradeLabel, nextGrade } from '../data/grades.js';
import { challengeSubjectsFor } from '../data/index.js';

let isParentGateUnlocked = false;

export function renderParentModal(modalContainer, onClose) {
  const profile = storage.getActiveProfile();
  const analytics = storage.getProfileAnalytics();

  if (!isParentGateUnlocked) {
    renderParentGate(modalContainer, () => {
      isParentGateUnlocked = true;
      renderDashboard(modalContainer, profile, analytics, onClose);
    }, onClose);
  } else {
    renderDashboard(modalContainer, profile, analytics, onClose);
  }
}

function renderParentGate(container, onUnlock, onClose) {
  const numA = Math.floor(Math.random() * 8) + 4;
  const numB = Math.floor(Math.random() * 8) + 3;
  const expectedSum = numA + numB;

  container.innerHTML = `
    <div id="parent-gate-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-4 border-slate-200 animate-pop">
        <div class="text-4xl mb-2">🔒</div>
        <h3 class="text-xl font-black text-slate-800 mb-1">שער להורים בלבד</h3>
        <p class="text-xs font-semibold text-slate-500 mb-4">כדי להיכנס לדוח ההתקדמות, נא לפתור את התרגיל:</p>

        <div class="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 mb-4 text-2xl font-black text-indigo-950">
          ${numA} + ${numB} = ?
        </div>

        <input type="number" id="gate-answer" placeholder="התשובה..." class="w-full text-center text-2xl font-black py-2.5 px-3 rounded-xl border-2 border-slate-300 focus:outline-none focus:border-indigo-500 mb-4" />

        <div class="flex gap-2">
          <button id="btn-cancel-gate" class="flex-1 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
            ביטול
          </button>
          <button id="btn-submit-gate" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer">
            אישור
          </button>
        </div>
      </div>
    </div>
  `;

  const input = container.querySelector('#gate-answer');
  input.focus();

  const verify = () => {
    const val = Number(input.value);
    if (val === expectedSum) {
      sfx.playSuccess();
      onUnlock();
    } else {
      sfx.playError();
      input.classList.add('border-rose-500', 'animate-shake');
      setTimeout(() => input.classList.remove('border-rose-500', 'animate-shake'), 500);
      input.value = '';
    }
  };

  container.querySelector('#btn-submit-gate').addEventListener('click', verify);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verify();
  });
  container.querySelector('#btn-cancel-gate').addEventListener('click', () => {
    container.innerHTML = '';
    if (onClose) onClose();
  });
}

function renderDashboard(container, profile, analytics, onClose) {
  const { 
    overallTotal, 
    overallCorrect, 
    overallAccuracy, 
    problemAreas, 
    subjectStats, 
    recentSessions 
  } = analytics;

  container.innerHTML = `
    <div id="parent-modal-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border-4 border-slate-200 animate-pop max-h-[92vh] flex flex-col">
        
        <!-- Modal Top Header -->
        <div class="flex items-center justify-between border-b pb-3 mb-4">
          <div class="flex items-center gap-2.5">
            <span class="text-3xl">📊</span>
            <div>
              <h2 class="text-xl font-black text-slate-800 leading-tight">דוח מעקב והתקדמות להורים</h2>
              <p class="text-xs text-slate-500 font-semibold">דוח מפורט עבור: <span class="text-indigo-600 font-bold">${profile.name} ${profile.avatar}</span></p>
            </div>
          </div>
          <button id="btn-close-parent-modal" class="text-slate-400 hover:text-slate-700 text-3xl font-bold leading-none cursor-pointer p-1">&times;</button>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto flex-1 pr-1 space-y-5">
          
          <!-- Key Metrics Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div class="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-3 text-center">
              <div class="text-xs font-bold text-indigo-700">דיוק כללי</div>
              <div class="text-2xl sm:text-3xl font-black text-indigo-950 mt-0.5">${overallAccuracy}%</div>
              <div class="text-[11px] text-slate-500 font-medium">${overallCorrect} מתוך ${overallTotal}</div>
            </div>

            <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center">
              <div class="text-xs font-bold text-amber-700">כוכבים שנצברו</div>
              <div class="text-2xl sm:text-3xl font-black text-amber-950 mt-0.5">⭐ ${profile.stars || 0}</div>
              <div class="text-[11px] text-slate-500 font-medium">הישגים</div>
            </div>

            <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 text-center">
              <div class="text-xs font-bold text-emerald-700">אימונים שהושלמו</div>
              <div class="text-2xl sm:text-3xl font-black text-emerald-950 mt-0.5">${recentSessions.length}</div>
              <div class="text-[11px] text-slate-500 font-medium">סבבי למידה</div>
            </div>

            <div class="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3 text-center">
              <div class="text-xs font-bold text-purple-700">תחומים לחיזוק</div>
              <div class="text-2xl sm:text-3xl font-black ${problemAreas.length > 0 ? 'text-rose-600' : 'text-emerald-600'} mt-0.5">
                ${problemAreas.length}
              </div>
              <div class="text-[11px] text-slate-500 font-medium">${problemAreas.length > 0 ? 'דורש תרגול' : 'שליטה מצוינת'}</div>
            </div>
          </div>

          ${renderChallengeSection(profile, analytics.challengeStats)}

          ${renderVoiceSection()}

          <!-- PROBLEM AREAS & CHALLENGES (The exact focus requested by parent) -->
          <div class="bg-rose-50/70 border-2 border-rose-200 rounded-2xl p-4">
            <h3 class="text-base font-black text-rose-950 flex items-center gap-2 mb-2">
              <span>⚠️</span> תחומים הדורשים חיזוק ותרגול (אבחון קשיים)
            </h3>

            ${problemAreas.length === 0 ? `
              <div class="bg-white p-3.5 rounded-xl border border-rose-100 flex items-center gap-3 text-emerald-700 font-bold text-sm">
                <span class="text-2xl">🎉</span>
                <span>מצוין! לא זוהו קשיים מיוחדים. הילד/ה מפגין שליטה טובה (מעל 75% הצלחה) בכל התחומים שנבדקו.</span>
              </div>
            ` : `
              <div class="space-y-2.5">
                ${problemAreas.map(item => `
                  <div class="bg-white p-3 rounded-xl border border-rose-200 shadow-sm">
                    <div class="flex items-center justify-between mb-1">
                      <div class="font-black text-slate-900 text-sm flex items-center gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                        <span>${item.topic}</span>
                      </div>
                      <span class="text-xs font-black px-2 py-0.5 rounded-lg ${item.accuracy < 50 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}">
                        ${item.accuracy}% הצלחה (${item.incorrect} טעויות)
                      </span>
                    </div>

                    <!-- Mistakes details snippet -->
                    ${item.mistakes && item.mistakes.length > 0 ? `
                      <div class="mt-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-700 space-y-1">
                        <div class="font-bold text-slate-500">דוגמאות לשאלות שבהן הילד/ה שגה:</div>
                        ${item.mistakes.slice(0, 2).map(m => `
                          <div class="flex items-start gap-1">
                            <span class="text-rose-500">❌</span>
                            <span>${m.prompt || m.title}: בחר/ה "${m.userAnswer}", התשובה הנכונה: "${m.correctAnswer}"</span>
                          </div>
                        `).join('')}
                      </div>
                    ` : ''}

                    <!-- Pedagogical recommendation -->
                    <div class="mt-2 text-xs text-indigo-900 font-semibold flex items-center gap-1">
                      <span>💡 טיפ להורה:</span>
                      <span>${getPedagogicalTip(item.topic)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Subject Mastery Breakdown -->
          <div class="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
            <h3 class="text-base font-black text-slate-900 mb-3 flex items-center gap-1.5">
              <span>📈</span> התפלגות לפי מקצוע
            </h3>
            <div class="space-y-3">
              ${[
                { id: 'hebrew', label: 'עברית (שפה ואוריינות)', stats: subjectStats.hebrew, color: 'bg-orange-500' },
                { id: 'math', label: 'חשבון (מתמטיקה)', stats: subjectStats.math, color: 'bg-blue-600' },
                { id: 'english', label: 'English (אנגלית)', stats: subjectStats.english, color: 'bg-emerald-500' },
                { id: 'russian', label: 'Русский (רוסית)', stats: subjectStats.russian, color: 'bg-rose-500' }
              ].map(sub => {
                const acc = sub.stats.total > 0 ? Math.round((sub.stats.correct / sub.stats.total) * 100) : 0;
                return `
                  <div>
                    <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>${sub.label}</span>
                      <span>${sub.stats.total > 0 ? `${acc}% (${sub.stats.correct}/${sub.stats.total})` : 'טרם תורגל'}</span>
                    </div>
                    <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div class="${sub.color} h-full rounded-full transition-all" style="width: ${acc}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Recent Sessions Activity Log -->
          <div class="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-base font-black text-slate-900 flex items-center gap-1.5">
                <span>📜</span> יומן סשנים אחרונים
              </h3>
              ${recentSessions.length > 0 ? `
                <button id="btn-clear-history" class="text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer">
                  מחיקת היסטוריה
                </button>
              ` : ''}
            </div>

            ${recentSessions.length === 0 ? `
              <p class="text-xs text-slate-500 font-medium text-center py-4">טרם נרשמו סשנים. התחילו לתרגל כדי לצבור נתונים!</p>
            ` : `
              <div class="space-y-2">
                ${recentSessions.slice(0, 10).map((sess, idx) => {
                  const dateStr = new Date(sess.timestamp).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
                  const subLabel = { hebrew: 'עברית 📖', math: 'חשבון 🔢', english: 'אנגלית 🔤', russian: 'רוסית Аб' }[sess.subject] || sess.subject;
                  const acc = sess.totalQuestions > 0 ? Math.round((sess.correctCount / sess.totalQuestions) * 100) : 0;
                  return `
                    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                      <div class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 session-header" data-idx="${idx}">
                        <div class="text-right">
                          <div class="font-black text-xs text-slate-800">${subLabel} • ${dateStr}</div>
                          <div class="text-[11px] text-slate-500 font-semibold">${sess.correctCount} נכון מתוך ${sess.totalQuestions} שאלות</div>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-black px-2 py-0.5 rounded-lg ${acc >= 80 ? 'bg-emerald-100 text-emerald-800' : (acc >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800')}">
                            ${acc}%
                          </span>
                          <span class="text-slate-400 text-xs toggle-icon">▼</span>
                        </div>
                      </div>

                      <!-- Expandable Breakdown -->
                      <div class="session-breakdown hidden bg-slate-50 border-t border-slate-100 p-2.5 text-xs space-y-1.5" id="breakdown-${idx}">
                        ${(sess.questions || []).map((q, qIdx) => `
                          <div class="flex items-start justify-between py-1 border-b border-slate-200/50 last:border-0">
                            <div class="flex items-start gap-1.5 flex-1 text-right">
                              <span>${q.isCorrect ? '✅' : '❌'}</span>
                              <div>
                                <span class="font-bold text-slate-800">${q.title || 'שאלה'}:</span>
                                <span class="text-slate-600">${q.prompt || ''}</span>
                                ${!q.isCorrect ? `<div class="text-[11px] text-rose-600 font-bold">הילד בחר: ${q.userAnswer} | הנכון: ${q.correctAnswer}</div>` : ''}
                              </div>
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

        </div>

        <!-- Footer -->
        <div class="pt-3 border-t mt-3 flex justify-end">
          <button id="btn-close-parent-modal-bottom" class="btn-tactile px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm cursor-pointer">
            סגור
          </button>
        </div>

      </div>
    </div>
  `;

  // Attach handlers
  const closeModal = () => {
    container.innerHTML = '';
    if (onClose) onClose();
  };

  // Challenge level setting (saved on the child's profile); re-render the dashboard to show the change
  container.querySelectorAll('.challenge-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      storage.updateProfile(profile.id, { challengeMode: btn.dataset.mode });
      sfx.playClick();
      renderParentModal(container, onClose);
    });
  });

  container.querySelector('#btn-close-parent-modal').addEventListener('click', closeModal);
  container.querySelector('#btn-close-parent-modal-bottom').addEventListener('click', closeModal);
  container.querySelector('#parent-modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'parent-modal-backdrop') closeModal();
  });

  setupVoiceSection(container);

  // Toggle session breakdowns
  container.querySelectorAll('.session-header').forEach(header => {
    header.addEventListener('click', () => {
      const idx = header.dataset.idx;
      const breakdown = container.querySelector(`#breakdown-${idx}`);
      const icon = header.querySelector('.toggle-icon');
      if (breakdown) {
        const isHidden = breakdown.classList.contains('hidden');
        breakdown.classList.toggle('hidden');
        if (icon) icon.textContent = isHidden ? '▲' : '▼';
      }
    });
  });

  // Clear history
  const clearBtn = container.querySelector('#btn-clear-history');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('האם למחוק את כל היסטוריית הסשנים והיומנים של הילד?')) {
        storage.clearSessionLogs();
        sfx.playClick();
        renderDashboard(container, profile, storage.getProfileAnalytics(), onClose);
      }
    });
  }
}

// "🔊 Voices": whether the device has its own voice per language. Without one, speech.js falls back to
// Google's online voice, so reading aloud needs internet for that language.
const VOICE_LANGS = [
  { lang: 'he-IL', label: 'עברית', sample: 'שלום! בואו נלמד יחד.' },
  { lang: 'en-US', label: 'אנגלית', sample: 'Hello! Let us learn together.' },
  { lang: 'ru-RU', label: 'רוסית', sample: 'Привет! Давай учиться вместе.' }
];

function renderVoiceSection() {
  return `
    <div class="bg-sky-50/70 border-2 border-sky-200 rounded-2xl p-4">
      <h3 class="text-base font-black text-sky-950 flex items-center gap-2 mb-1">
        <span>🔊</span> קולות הקראה במכשיר
      </h3>
      <p class="text-xs text-slate-600 font-semibold mb-2">כשיש במכשיר קול לשפה, ההקראה עובדת גם בלי אינטרנט. בלי קול מותקן משתמשים בקול של Google, שעובד רק עם אינטרנט.</p>
      <div class="space-y-1.5">
        ${VOICE_LANGS.map(v => `
          <div class="bg-white rounded-xl border border-sky-100 p-2.5 flex items-center justify-between gap-2">
            <div class="text-right">
              <div class="font-black text-sm text-slate-800">${v.label}</div>
              <div class="voice-status text-[11px] font-bold text-slate-500" data-lang="${v.lang}">בודק...</div>
            </div>
            <button class="voice-test-btn px-3 py-1.5 rounded-xl border-2 border-sky-200 bg-white hover:bg-sky-50 text-xs font-bold text-sky-900 cursor-pointer" data-lang="${v.lang}">🔊 בדיקה</button>
          </div>
        `).join('')}
      </div>
      <p class="voice-install-hint hidden text-[11px] text-slate-500 font-semibold mt-2">להתקנת קול חסר באנדרואיד: הגדרות ← מערכת ← שפות ← פלט של המרת טקסט לדיבור ← מנוע Google ← התקנת נתוני קול.</p>
    </div>
  `;
}

function setupVoiceSection(container) {
  const update = () => {
    const statuses = container.querySelectorAll('.voice-status');
    if (!statuses.length) return;
    let missing = false;
    statuses.forEach(el => {
      const has = speech.hasVoiceFor(el.dataset.lang);
      if (!has) missing = true;
      el.textContent = has ? '✅ קול מותקן במכשיר (עובד גם בלי אינטרנט)' : '🌐 אין קול במכשיר – קול של Google (צריך אינטרנט)';
      el.className = `voice-status text-[11px] font-bold ${has ? 'text-emerald-700' : 'text-amber-700'}`;
    });
    container.querySelector('.voice-install-hint')?.classList.toggle('hidden', !missing);
  };
  update();
  // Some browsers (Chrome on Android) load the voice list a moment after the page opens
  if (speech.synth?.addEventListener) speech.synth.addEventListener('voiceschanged', update);

  container.querySelectorAll('.voice-test-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = VOICE_LANGS.find(x => x.lang === btn.dataset.lang);
      speech.speak(v.sample, v.lang, 0.9);
    });
  });
}

const CHALLENGE_MODES = [
  { mode: 'auto', label: 'אוטומטי', hint: 'מתחיל ב-20% ועולה עד 40% כשהילד/ה מצליח/ה, או יורד ל-10% כשקשה' },
  { mode: 'off', label: 'כבוי', hint: 'רק שאלות מהכיתה של הילד/ה' },
  { mode: 'some', label: 'מעט', hint: 'כ-20% מהשאלות בכל סבב' },
  { mode: 'many', label: 'הרבה', hint: 'כ-40% מהשאלות בכל סבב' }
];

// "⭐ Challenge questions": next-grade results (not counted as weaknesses) and the challenge level setting
function renderChallengeSection(profile, challengeStats = { total: 0, correct: 0 }) {
  const grade = gradeOfProfile(profile);
  const subjects = grade ? challengeSubjectsFor(grade) : [];
  const mode = profile.challengeMode || 'auto';
  const current = CHALLENGE_MODES.find(m => m.mode === mode) || CHALLENGE_MODES[0];
  const subjectNames = { hebrew: 'עברית', math: 'חשבון', english: 'אנגלית', russian: 'רוסית' };
  const nextLabel = gradeLabel(nextGrade(grade));

  const availability = subjects.length
    ? `שאלות מ${nextLabel} משולבות ב: ${subjects.map(s => subjectNames[s]).join(', ')}.`
    : `עדיין אין תוכן ל${nextLabel || 'כיתה הבאה'}, ולכן אין כרגע שאלות אתגר. ההגדרה תופעל כשיתווסף תוכן.`;

  return `
    <div class="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4">
      <h3 class="text-base font-black text-amber-950 flex items-center gap-2 mb-1">
        <span>⭐</span> שאלות אתגר מהכיתה הבאה
      </h3>
      <p class="text-xs text-slate-600 font-semibold mb-2">${availability} טעות בשאלת אתגר אינה נחשבת "תחום לחיזוק".</p>
      ${challengeStats.total > 0 ? `
        <div class="text-sm font-black text-amber-900 mb-2">נפתרו ${challengeStats.correct} מתוך ${challengeStats.total} שאלות אתגר (${Math.round((challengeStats.correct / challengeStats.total) * 100)}%)</div>
      ` : ''}
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-xs font-bold text-slate-600">רמת אתגר:</span>
        ${CHALLENGE_MODES.map(m => `
          <button class="challenge-mode-btn px-3 py-1.5 rounded-xl border-2 text-xs font-bold cursor-pointer ${m.mode === mode ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'}" data-mode="${m.mode}">
            ${m.label}
          </button>
        `).join('')}
      </div>
      <p class="text-[11px] text-slate-500 font-semibold mt-1.5">${current.hint}</p>
    </div>
  `;
}

function getPedagogicalTip(topic) {
  if (topic.includes('מה לא שייך')) {
    return 'מומלץ למיין יחד חפצים בבית לקבוצות (פירות, בגדים, צעצועים) ולשאול "מה לא שייך כאן, ולמה?".';
  }
  if (topic === 'ספירה במבט') {
    return 'מומלץ לשחק בקוביות ובקלפי נקודות: להציץ שנייה ולהגיד כמה, בלי לספור אחת-אחת (למשל "5 ועוד 2 זה 7").';
  }
  if (topic === 'האות החסרה') {
    return 'מומלץ להגיד מילה לאט ולשאול "באיזו אות היא מתחילה?", ואז לכתוב אותה יחד ולמצוא את האות.';
  }
  if (topic.includes('בונים מילה')) {
    return 'מומלץ להגיד מילה לאט, למחוא כפיים לכל חלק, ולבנות אותה יחד מכרטיסי הברות או אותיות.';
  }
  if (topic === 'חוקיות') {
    return 'מומלץ לבנות יחד סדרות מחרוזים, קוביות או מדבקות (אדום-כחול-אדום-כחול) ולבקש מהילד להמשיך, ואז להמציא סדרה בעצמו.';
  }
  if (topic.includes('השוואת כמויות')) {
    return 'מומלץ לתרגל השוואת כמויות עם חפצים מוחשיים בבית (למשל: איפה יש יותר תפוחים? היכן יש פחות?).';
  }
  if (topic.includes('ערך המקום')) {
    return 'מומלץ לכתוב יחד מספרים גדולים בטבלת מקום (אלפים | מאות | עשרות | אחדות) ולשאול "כמה מאות יש כאן?".';
  }
  if (topic.includes('סדר פעולות')) {
    return 'מומלץ לחזור על הכלל "כפל וחילוק לפני חיבור וחיסור" ולסמן בעיגול את הכפל לפני שמחשבים.';
  }
  if (topic.includes('סימני התחלקות')) {
    return 'מומלץ לתרגל את הכלל: מספר מתחלק ב-3 (או ב-9) אם סכום הספרות שלו מתחלק ב-3 (או ב-9).';
  }
  if (topic.includes('מלבן')) {
    return 'מומלץ למדוד יחד שולחן או ספר: היקף = מסביב (מחברים את כל הצלעות), שטח = כמה ריבועים מכסים (אורך × רוחב).';
  }
  if (topic.includes('שבר מכמות')) {
    return 'מומלץ לחלק ממתקים לקבוצות שוות: "רבע מ-12" = מחלקים ל-4 קבוצות ולוקחים קבוצה אחת.';
  }
  // Russian topics have a Cyrillic name in their title, e.g. 'פירות (Фрукты)'
  if (/[\u0400-\u04FF]/.test(topic)) {
    return 'מומלץ לדבר רוסית בבית בהזדמנויות יומיומיות (צבעים, אוכל, חיות) ולקרוא יחד ספרי תמונות ברוסית.';
  }
  if (/Reading|Letter Sounds|Missing Letter/.test(topic)) {
    return 'מומלץ לקרוא יחד ספרוני תמונות קצרים באנגלית ולהצביע על כל מילה תוך כדי קריאה.';
  }
  if (topic.includes('הברות')) {
    return 'מומלץ למחוא כפיים יחד לכל הברה בשמות של בני המשפחה, חפצים ומאכלים (בַּ–לּוֹן = 2 מחיאות).';
  }
  if (topic.includes('חרוזים')) {
    return 'מומלץ לקרוא יחד שירים וספרים מחורזים ולעצור לפני המילה המתחרזת כדי שהילד ישלים אותה.';
  }
  if (topic.includes('שמות האותיות')) {
    return 'מומלץ להצביע על אותיות בשלטים ובספרים ולשאול "איך קוראים לאות הזאת?", החל מהאותיות שבשם של הילד.';
  }
  if (topic.includes('יחיד ורבים')) {
    return 'מומלץ לשאול בטבעיות "יש פה כלב אחד או הרבה כלבים?" ולשים לב יחד לצורות מיוחדות כמו בית–בתים.';
  }
  if (topic.includes('צליל סוגר')) {
    return 'מומלץ לשחק "במה נגמרת המילה?" — להגיד מילה לאט ולהדגיש את הצליל האחרון (חתוּל — ל).';
  }
  if (topic.includes('כמה נשארו')) {
    return 'מומלץ להמחיש חיסור עם חפצים אמיתיים: "היו 5 תפוחים, אכלנו 2 — כמה נשארו?"';
  }
  if (topic.includes('מספרים סודרים')) {
    return 'מומלץ לעמוד בתור במשחק ולשאול "מי ראשון? מי שלישי?", וגם לסדר צעצועים בשורה.';
  }
  if (topic.includes('מיקום במרחב')) {
    return 'מומלץ לשחק "שים את הדובי מעל / מתחת / ליד / בתוך הקופסה" ולתאר יחד איפה דברים נמצאים.';
  }
  if (topic === 'מטבעות' || topic === 'קונים בחנות') {
    return 'מומלץ לתת לילד לשחק בחנות עם מטבעות אמיתיים ולשלם בעצמו בקנייה קטנה; לשים לב במיוחד ל-10 אגורות מול 10 שקלים.';
  }
  if (topic === 'צורות' || topic === 'גופים') {
    return 'מומלץ לחפש צורות וגופים בבית ובטיול (חלון = מלבן, פחית = גליל), גם כשהם מסובבים או בצבעים שונים.';
  }
  if (topic.includes('צליל פותח') || topic.includes('אותיות')) {
    return 'מומלץ לשחק משחקי מילים: "איזו מילה מתחילה בצליל...?" בעת קריאת ספרים יחד.';
  }
  if (topic.includes('לוח הכפל') || topic.includes('כפל')) {
    return 'מומלץ לתרגל קבוצות כפל קבועות (למשל כפולות של 2, 5 ו-10 תחילה) בעזרת שירים ומשחקי קלפים.';
  }
  if (topic.includes('חילוק')) {
    return 'מומלץ להדגים חילוק כחלוקה שווה של ממתקים או קלפים בין חברים.';
  }
  if (topic.includes('שברים')) {
    return 'מומלץ לחלק פיצה או עוגה לחלקים שווים כדי להמחיש את מושג השבר (חצי, רבע).';
  }
  if (/Colors|Fruits|Vegetables|Animals|Food|Body|Clothes|Toys|Transport|Nature|Shapes|Numbers|Actions|Feelings|Greetings|Bugs|Sea Animals|Family/.test(topic)) {
    return 'מומלץ לשחק "איך אומרים באנגלית?" עם חפצים בבית, במטבח ובטיול, ולשיר שירי ילדים באנגלית על צבעים, חיות ופירות.';
  }
  if (topic.includes('הבנת הנקרא')) {
    return 'מומלץ לשאול את הילד שאלות מנחות ("מי עשה מה?", "למה זה קרה?") לאחר קריאת סיפור.';
  }
  return 'מומלץ לחזור על הנושא בתרגול רגוע עם דוגמאות יומיומיות.';
}
