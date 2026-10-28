// Core Exercise Renderer & Interactive Engine (Self-contained, deterministic validation)
import { validateAnswer } from '../engine/validator.js';
import { sfx } from '../audio/sfx.js';
import { speech } from '../audio/speech.js';
import { gradeLabel } from '../data/grades.js';

// Text size for large reading answers: syllables very large, long words smaller so they fit the button
function bigLabelClass(label) {
  const letters = String(label).replace(/[֑-ׇ\s]/g, '').length;
  if (letters <= 3) return 'text-5xl sm:text-6xl py-2 leading-relaxed';
  if (letters <= 5) return 'text-4xl sm:text-5xl py-2 leading-relaxed';
  if (letters <= 7) return 'text-3xl sm:text-4xl py-3 leading-relaxed';
  return 'text-2xl sm:text-3xl py-3 leading-relaxed';
}

export function renderExerciseCard(container, exercise, onComplete) {
  let hasAnswered = false;
  let enteredNumber = '';

  // Foreign-language cards (English, Russian) are left-to-right and speak their own language
  const isRTL = !['english', 'russian'].includes(exercise.category);
  const langDir = isRTL ? 'rtl' : 'ltr';

  // Build specific exercise body HTML
  let exerciseBodyHtml = '';

  switch (exercise.type) {
    case 'image_word_match':
      exerciseBodyHtml = `
        <div class="flex flex-col items-center gap-6 my-4">
          <!-- Big Target Word Banner with Audio button -->
          <div class="flex items-center gap-4 bg-amber-50 border-4 border-amber-300 px-8 py-4 rounded-3xl shadow-sm">
            <span class="vocalized-text text-amber-950 font-black tracking-wide">${exercise.targetWordVocalized || ''}</span>
            ${exercise.hideWordAudio ? '' /* reading questions: hearing the word would give the answer away */ : `
            <button id="btn-speak-word" class="p-3 bg-white hover:bg-amber-100 active:scale-95 border-2 border-amber-200 rounded-2xl shadow-sm text-2xl transition-all cursor-pointer" title="האזנה">
              🔊
            </button>`}
          </div>

          <!-- Options Grid (4 options, e.g. odd one out: 2×2 on phones, one row on wider screens) -->
          <div class="grid ${exercise.options.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'} gap-4 w-full mt-2">
            ${exercise.options.map(opt => `
              <button
                data-id="${opt.id}"
                class="option-card choice-pill btn-tactile ${opt.emoji ? (exercise.options.length === 4 ? 'p-4 sm:p-5' : 'p-6 sm:p-8') : 'px-2 py-4 sm:px-3'} flex flex-col items-center justify-center gap-2 text-center border-3 cursor-pointer">
                ${opt.emoji ? `<span class="${exercise.options.length === 4 ? 'text-6xl sm:text-7xl' : 'text-7xl sm:text-8xl'} filter drop-shadow-md transition-transform hover:scale-110">${opt.emoji}</span>` : ''}
                ${(exercise.showOptionLabels && opt.label)
                  // Text-only answers (no picture) are shown large, so reading the word is the task
                  // bigLabels: early-reading questions (niqqud) need large text — as large as the word's length allows;
                  // single Hebrew words never wrap (a broken word would be a different spelling)
                  ? `<span class="${opt.emoji ? 'text-xl mt-1' : (exercise.bigLabels ? bigLabelClass(opt.label) + ' whitespace-nowrap' : 'text-2xl sm:text-3xl py-4')} font-black text-slate-800">${opt.label}</span>`
                  : ''}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      break;

    case 'visual_counting':
    case 'visual_subtraction': {
      // Items are laid out in rows of 5 so larger amounts (up to 20) stay countable.
      // For subtraction, the last `takeAway` items are crossed out ("they went away").
      const total = exercise.type === 'visual_counting' ? exercise.count : exercise.total;
      const crossedFrom = exercise.type === 'visual_subtraction' ? total - exercise.takeAway : total;
      const sizeClass = total > 10 ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl';
      const item = (i) => i < crossedFrom
        ? `<span class="${sizeClass} filter drop-shadow">${exercise.emoji}</span>`
        : `<span class="${sizeClass} relative inline-block"><span class="opacity-35">${exercise.emoji}</span><span class="absolute inset-0 flex items-center justify-center text-red-600 font-black" style="font-size:1.1em">✕</span></span>`;
      const rows = [];
      for (let start = 0; start < total; start += 5) {
        const row = [];
        for (let i = start; i < Math.min(start + 5, total); i++) row.push(item(i));
        rows.push(`<div class="flex justify-center gap-2">${row.join('')}</div>`);
      }
      exerciseBodyHtml = `
        <div class="flex flex-col items-center gap-6 my-4">
          <!-- Visual items counting box -->
          <div class="bg-amber-50 border-4 border-amber-200 p-5 sm:p-7 rounded-3xl flex flex-col items-center gap-2 max-w-md shadow-sm">
            ${rows.join('')}
          </div>

          <!-- Numbers Options Grid -->
          <div class="grid grid-cols-3 gap-4 w-full max-w-sm mt-2">
            ${exercise.options.map(opt => `
              <button 
                data-id="${opt.id}" 
                class="option-card choice-pill btn-tactile py-5 px-4 text-center border-3 font-black text-4xl sm:text-5xl text-slate-800 cursor-pointer">
                ${opt.label}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      break;
    }

    case 'ordinal_line':
      // A queue: the 🏁 marks the front of the line. The card is RTL, so the flag is on the right and
      // the first animal stands next to it, matching how Hebrew readers expect "first" to be placed.
      exerciseBodyHtml = `
        <div class="flex flex-col items-center gap-6 my-4">
          <div class="flex items-center gap-4 bg-amber-50 border-4 border-amber-300 px-8 py-4 rounded-3xl shadow-sm">
            <span class="vocalized-text text-amber-950 font-black tracking-wide">${exercise.targetWordVocalized}</span>
            <button id="btn-speak-word" class="p-3 bg-white hover:bg-amber-100 active:scale-95 border-2 border-amber-200 rounded-2xl shadow-sm text-2xl transition-all cursor-pointer" title="האזנה">
              🔊
            </button>
          </div>
          <div class="flex items-end justify-center gap-1 sm:gap-2 w-full">
            <span class="shrink-0 text-3xl sm:text-4xl pb-2" aria-hidden="true">🏁</span>
            ${exercise.options.map(opt => `
              <button
                data-id="${opt.id}"
                class="option-card choice-pill btn-tactile flex-1 min-w-0 py-3 sm:py-4 flex items-center justify-center border-3 cursor-pointer">
                <span class="text-3xl sm:text-5xl">${opt.emoji}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      break;

    case 'visual_addition':
      exerciseBodyHtml = `
        <div class="flex flex-col items-center gap-6 my-4">
          <!-- Two groups with plus sign in between -->
          <div class="flex items-center justify-center gap-3 sm:gap-5 flex-wrap bg-amber-50 border-4 border-amber-200 p-5 sm:p-6 rounded-3xl shadow-sm">
            <!-- First Group -->
            <div class="bg-white border-2 border-amber-200 p-3 sm:p-4 rounded-2xl flex flex-wrap justify-center gap-1 max-w-[150px] shadow-sm">
              ${Array(exercise.numA).fill(`<span class="text-4xl sm:text-5xl">${exercise.emoji}</span>`).join('')}
            </div>

            <!-- Plus Sign -->
            <span class="text-4xl sm:text-5xl font-black text-amber-900">+</span>

            <!-- Second Group -->
            <div class="bg-white border-2 border-amber-200 p-3 sm:p-4 rounded-2xl flex flex-wrap justify-center gap-1 max-w-[150px] shadow-sm">
              ${Array(exercise.numB).fill(`<span class="text-4xl sm:text-5xl">${exercise.emoji}</span>`).join('')}
            </div>
          </div>

          <!-- Numbers Options Grid -->
          <div class="grid grid-cols-3 gap-4 w-full max-w-sm mt-2">
            ${exercise.options.map(opt => `
              <button 
                data-id="${opt.id}" 
                class="option-card choice-pill btn-tactile py-5 px-4 text-center border-3 font-black text-4xl sm:text-5xl text-slate-800 cursor-pointer">
                ${opt.label}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      break;

    case 'arithmetic_choice':
      exerciseBodyHtml = `
        <div class="flex flex-col items-center gap-6 my-4">
          <!-- Big Formula Display Banner -->
          <div class="flex items-center gap-4 bg-indigo-50 border-4 border-indigo-200 px-8 py-5 rounded-3xl shadow-sm">
            <!-- Math is written left-to-right in Israeli textbooks, also inside a Hebrew (RTL) page -->
            <span dir="ltr" class="text-4xl sm:text-5xl font-black text-indigo-950 tracking-wide">${exercise.formula}</span>
            <button id="btn-speak-word" class="p-3 bg-white hover:bg-indigo-100 active:scale-95 border-2 border-indigo-200 rounded-2xl shadow-sm text-2xl transition-all cursor-pointer" title="האזנה">
              🔊
            </button>
          </div>

          <!-- Options Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md mt-2">
            ${exercise.options.map(opt => `
              <button 
                data-id="${opt.id}" 
                class="option-card choice-pill btn-tactile py-4 px-3 text-center border-3 font-black text-3xl sm:text-4xl text-slate-800 cursor-pointer">
                ${opt.label}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      break;

    case 'comparison_drill':
      exerciseBodyHtml = `
        <div class="flex flex-col items-center gap-6 my-4">
          <!-- Visual items comparison row -->
          <div class="flex items-center justify-center gap-3 sm:gap-6 w-full flex-wrap">
            
            <!-- Left Group -->
            <div class="bg-blue-50 border-4 border-blue-200 p-4 sm:p-6 rounded-3xl min-w-[120px] sm:min-w-[150px] flex flex-col items-center">
              <div class="flex flex-wrap justify-center gap-1 max-w-[140px] text-3xl sm:text-4xl">
                ${Array(exercise.leftVal).fill(exercise.emoji).join(' ')}
              </div>
            </div>

            <!-- Target Symbol Slot -->
            <div id="symbol-slot" class="w-16 h-16 sm:w-20 sm:h-20 bg-white border-4 border-dashed border-slate-300 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-black text-slate-700 shadow-inner">
              ?
            </div>

            <!-- Right Group -->
            <div class="bg-blue-50 border-4 border-blue-200 p-4 sm:p-6 rounded-3xl min-w-[120px] sm:min-w-[150px] flex flex-col items-center">
              <div class="flex flex-wrap justify-center gap-1 max-w-[140px] text-3xl sm:text-4xl">
                ${Array(exercise.rightVal).fill(exercise.emoji).join(' ')}
              </div>
            </div>

          </div>

          <!-- Symbol Choices Buttons -->
          <div class="flex items-center gap-4 sm:gap-6 mt-4">
            <button data-symbol=">" class="symbol-btn btn-tactile w-18 h-18 sm:w-22 sm:h-22 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl text-4xl sm:text-5xl font-black border-b-6 border-indigo-900 cursor-pointer">
              &gt;
            </button>
            <button data-symbol="=" class="symbol-btn btn-tactile w-18 h-18 sm:w-22 sm:h-22 bg-amber-500 hover:bg-amber-600 text-white rounded-3xl text-4xl sm:text-5xl font-black border-b-6 border-amber-800 cursor-pointer">
              =
            </button>
            <button data-symbol="<" class="symbol-btn btn-tactile w-18 h-18 sm:w-22 sm:h-22 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl text-4xl sm:text-5xl font-black border-b-6 border-indigo-900 cursor-pointer">
              &lt;
            </button>
          </div>
        </div>
      `;
      break;

    case 'operator_choice':
      exerciseBodyHtml = `
        <div class="flex flex-col items-center gap-6 my-4">
          <!-- Equation Display -->
          <div class="flex items-center justify-center gap-3 sm:gap-4 flex-wrap bg-slate-50 border-3 border-slate-200 p-5 rounded-3xl text-3xl sm:text-4xl font-black text-slate-800">
            <div class="flex items-center gap-1 bg-white px-3 py-1.5 rounded-2xl border-2 border-slate-200">
              <span>${Array(exercise.numA).fill(exercise.emoji).join('')}</span>
            </div>
            
            <span id="operator-slot" class="w-12 h-12 bg-amber-100 border-2 border-dashed border-amber-400 rounded-xl flex items-center justify-center text-3xl text-amber-900 font-black">
              ?
            </span>

            <div class="flex items-center gap-1 bg-white px-3 py-1.5 rounded-2xl border-2 border-slate-200">
              <span>${Array(exercise.numB).fill(exercise.emoji).join('')}</span>
            </div>

            <span>=</span>

            <div class="flex items-center gap-1 bg-white px-3 py-1.5 rounded-2xl border-2 border-slate-200">
              <span>${Array(exercise.result).fill(exercise.emoji).join('')}</span>
            </div>
          </div>

          <!-- Operator Choices Buttons -->
          <div class="flex items-center gap-6 mt-2">
            <button data-op="+" class="op-btn btn-tactile px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl text-4xl font-black border-b-6 border-emerald-800 flex items-center gap-2 cursor-pointer">
              <span>+</span>
              <span class="text-lg font-bold">(ועוד)</span>
            </button>
            <button data-op="-" class="op-btn btn-tactile px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-3xl text-4xl font-black border-b-6 border-rose-800 flex items-center gap-2 cursor-pointer">
              <span>-</span>
              <span class="text-lg font-bold">(פחות)</span>
            </button>
          </div>
        </div>
      `;
      break;

    case 'reading_comprehension_question':
      exerciseBodyHtml = `
        <div class="flex flex-col gap-5 my-2">
          <!-- Passage Scrollable Box -->
          <div class="passage-box p-5 max-h-56 overflow-y-auto shadow-inner text-right relative">
            <div class="flex items-center justify-between mb-2 border-b border-amber-200 pb-2">
              <h4 class="font-extrabold text-amber-900 text-lg flex items-center gap-2">
                <span>📜</span> ${exercise.passageTitle}
              </h4>
              <button id="btn-speak-passage" class="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 cursor-pointer">
                <span>🔊</span> הקרא קטע
              </button>
            </div>
            <p class="whitespace-pre-line text-slate-800 leading-relaxed font-medium">${exercise.passageText}</p>
          </div>

          <!-- Question Prompt -->
          <div class="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-2xl">
            <div class="text-xs font-bold text-indigo-700 mb-1">שאלה:</div>
            <div class="text-lg sm:text-xl font-extrabold text-indigo-950">${exercise.prompt}</div>
          </div>

          <!-- Options List -->
          <div class="grid grid-cols-1 gap-2.5 w-full">
            ${exercise.options.map(opt => `
              <button 
                data-id="${opt.id}" 
                class="reading-opt-btn btn-tactile p-3.5 sm:p-4 text-right rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 font-bold text-base sm:text-lg text-slate-800 flex items-center justify-between cursor-pointer">
                <span>${opt.label}</span>
                <span class="opt-indicator text-lg opacity-40">⚪</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      break;

    case 'fill_in_blank':
      exerciseBodyHtml = `
        <div class="flex flex-col items-center gap-6 my-4" dir="ltr">
          <!-- Sentence with blank box -->
          <div class="bg-emerald-50 border-3 border-emerald-200 p-6 rounded-3xl text-xl sm:text-2xl font-bold text-slate-800 flex items-center flex-wrap gap-2 justify-center shadow-sm">
            <span>${exercise.sentenceBefore}</span>
            <span id="blank-slot" class="min-w-[100px] text-center border-b-4 border-dashed border-emerald-600 text-emerald-700 font-extrabold px-3 py-1 bg-white rounded-xl">
              [ ? ]
            </span>
            <span>${exercise.sentenceAfter}</span>
            <button id="btn-speak-sentence" class="ml-2 p-2 bg-white hover:bg-emerald-100 rounded-xl border border-emerald-300 text-lg cursor-pointer" title="Listen">
              🔊
            </button>
          </div>

          <!-- Word Choices -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            ${exercise.options.map(opt => `
              <button 
                data-id="${opt.id}" 
                class="fill-opt-btn btn-tactile p-4 rounded-2xl border-3 border-slate-200 bg-white hover:bg-slate-50 font-black text-xl text-slate-800 text-center cursor-pointer">
                ${opt.label}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      break;

    case 'numeric_input':
      exerciseBodyHtml = `
        <div class="flex flex-col items-center gap-5 my-2">
          <!-- Story Problem Text -->
          <div class="bg-amber-50 border-3 border-amber-200 p-5 rounded-3xl w-full text-right shadow-sm">
            <p class="whitespace-pre-line text-lg sm:text-xl font-bold text-amber-950 leading-relaxed">${exercise.storyText}</p>
          </div>

          <!-- Input Display -->
          <div class="flex items-center gap-3">
            <div class="text-base font-bold text-slate-600">התשובה שלכם:</div>
            <div id="keypad-display" class="w-32 h-14 bg-white border-4 border-indigo-400 rounded-2xl flex items-center justify-center text-3xl font-black text-indigo-950 shadow-inner">
              -
            </div>
          </div>

          <!-- Kid-Friendly On-screen Keypad -->
          <div class="grid grid-cols-3 gap-2 w-full max-w-[280px]">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
              <button data-key="${num}" class="keypad-key keypad-btn py-2.5 bg-slate-100 hover:bg-white text-slate-800 cursor-pointer">
                ${num}
              </button>
            `).join('')}
            <button data-key="clear" class="keypad-key keypad-btn py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-base cursor-pointer">
              מחק ⌫
            </button>
            <button data-key="0" class="keypad-key keypad-btn py-2.5 bg-slate-100 hover:bg-white text-slate-800 cursor-pointer">
              0
            </button>
            <button data-key="submit" class="keypad-key keypad-btn py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-600 text-base cursor-pointer">
              בדוק ✔️
            </button>
          </div>
        </div>
      `;
      break;

    default:
      exerciseBodyHtml = `<div class="p-4 text-center">תרגיל</div>`;
  }

  // Render Full Card Structure
  container.innerHTML = `
    <div class="card-tactile bg-white border-4 border-indigo-100 p-4 sm:p-6 max-w-2xl mx-auto animate-pop" dir="${langDir}">
      
      <!-- Top Card Header -->
      <div class="flex items-center justify-between border-b pb-3 mb-3">
        <div class="flex items-center gap-2">
          <span class="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-xl font-black">${exercise.title}</span>
          ${exercise.isChallenge ? `<span class="text-xs bg-amber-400 text-amber-950 px-2.5 py-1 rounded-xl font-black shadow-sm" dir="rtl" title="שאלה מהכיתה הבאה — בונוס כוכב!">⭐ אתגר</span>` : ''}
        </div>
        <div class="text-xs font-bold text-slate-400" dir="rtl">
          ${gradeLabel(exercise.grade || (exercise.ageGroup === '5' ? 'gan' : '4'))}
        </div>
      </div>

      <!-- Instruction Banner with Audio Button -->
      <div class="flex items-center justify-between mb-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
        <div class="${isRTL ? 'text-right' : 'text-left'} flex-1">
          <h3 dir="auto" class="text-base sm:text-lg font-black text-slate-800">${exercise.instructionHebrew}</h3>
          ${exercise.instructionEnglish ? `<p class="text-xs font-semibold text-slate-500 mt-0.5">${exercise.instructionEnglish}</p>` : ''}
        </div>
        <button id="btn-speak-instruction" class="p-2 sm:p-2.5 bg-white hover:bg-indigo-50 border-2 border-indigo-200 rounded-xl text-xl text-indigo-600 transition-all active:scale-95 cursor-pointer shadow-sm ml-2 mr-2" title="הקרא הוראה">
          🔈
        </button>
      </div>

      <!-- Exercise Body -->
      <div id="exercise-interactive-area">
        ${exerciseBodyHtml}
      </div>

      <!-- Feedback Area -->
      <div id="feedback-banner" class="hidden mt-4 p-3.5 rounded-2xl border-2 text-center font-extrabold text-base animate-pop"></div>

      <!-- Next Button (revealed on success) -->
      <div id="next-btn-container" class="hidden mt-4 text-center">
        <button id="btn-next-exercise" class="btn-tactile w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl rounded-2xl border-b-6 border-emerald-800 shadow-emerald-200 cursor-pointer">
          התרגיל הבא! 🌟
        </button>
      </div>

    </div>
  `;

  // --- ATTACH EVENT HANDLERS --- //

  // Audio Pronunciation Buttons
  const wordSpeakBtn = container.querySelector('#btn-speak-word');
  if (wordSpeakBtn) {
    wordSpeakBtn.addEventListener('click', () => {
      sfx.playClick();
      wordSpeakBtn.classList.add('animate-pulse', 'ring-4', 'ring-amber-300', 'bg-amber-100');
      const onEnd = () => {
        wordSpeakBtn.classList.remove('animate-pulse', 'ring-4', 'ring-amber-300', 'bg-amber-100');
      };
      const textToSpeak = exercise.soundCue || exercise.targetWordVocalized;
      if (exercise.category === 'english') {
        speech.speakEnglish(textToSpeak, onEnd);
      } else if (exercise.category === 'russian') {
        speech.speakRussian(textToSpeak, onEnd);
      } else {
        speech.speakHebrew(textToSpeak, onEnd);
      }
    });
  }

  // Listen-only questions hide the word, so it is spoken as soon as the card appears
  if (exercise.autoSpeak && wordSpeakBtn) {
    setTimeout(() => {
      if (!container.isConnected || hasAnswered) return;
      wordSpeakBtn.classList.add('animate-pulse', 'ring-4', 'ring-amber-300', 'bg-amber-100');
      const onEnd = () => wordSpeakBtn.classList.remove('animate-pulse', 'ring-4', 'ring-amber-300', 'bg-amber-100');
      speech.speakEnglish(exercise.soundCue, onEnd);
    }, 400);
  }

  const instructionSpeakBtn = container.querySelector('#btn-speak-instruction');
  if (instructionSpeakBtn) {
    instructionSpeakBtn.addEventListener('click', () => {
      sfx.playClick();
      instructionSpeakBtn.classList.add('animate-pulse', 'bg-indigo-100', 'text-indigo-700', 'ring-2', 'ring-indigo-300');
      const onEnd = () => {
        instructionSpeakBtn.classList.remove('animate-pulse', 'bg-indigo-100', 'text-indigo-700', 'ring-2', 'ring-indigo-300');
      };
      speech.speakHebrew(exercise.instructionHebrew, onEnd);
    });
  }

  const passageSpeakBtn = container.querySelector('#btn-speak-passage');
  if (passageSpeakBtn) {
    passageSpeakBtn.addEventListener('click', () => {
      sfx.playClick();
      passageSpeakBtn.classList.add('animate-pulse', 'bg-amber-300');
      speech.speakHebrew(exercise.passageText, () => {
        passageSpeakBtn.classList.remove('animate-pulse', 'bg-amber-300');
      });
    });
  }

  const sentenceSpeakBtn = container.querySelector('#btn-speak-sentence');
  if (sentenceSpeakBtn) {
    sentenceSpeakBtn.addEventListener('click', () => {
      sfx.playClick();
      sentenceSpeakBtn.classList.add('animate-pulse', 'bg-emerald-200');
      const textToSpeak = exercise.soundCue || (exercise.sentenceBefore + exercise.expectedAnswer + exercise.sentenceAfter);
      speech.speakEnglish(textToSpeak, () => {
        sentenceSpeakBtn.classList.remove('animate-pulse', 'bg-emerald-200');
      });
    });
  }

  const feedbackBanner = container.querySelector('#feedback-banner');
  const nextBtnContainer = container.querySelector('#next-btn-container');
  const nextBtn = container.querySelector('#btn-next-exercise');

  let autoAdvanceTimer = null;
  let lastAttemptResult = null;

  function triggerNext() {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
    if (onComplete) {
      onComplete(exercise, lastAttemptResult || { isCorrect: false });
    }
  }

  function handleResult(validationResult, targetElement, submissionValue) {
    if (hasAnswered) return;
    hasAnswered = true;

    feedbackBanner.classList.remove('hidden', 'bg-emerald-50', 'border-emerald-300', 'text-emerald-800', 'bg-rose-50', 'border-rose-300', 'text-rose-800');

    lastAttemptResult = {
      isCorrect: validationResult.isCorrect,
      userAnswer: submissionValue,
      correctAnswer: validationResult.correctValue,
      exerciseTitle: exercise.title,
      exerciseTopic: exercise.title,
      prompt: exercise.instructionHebrew || exercise.prompt || ''
    };

    // Vocabulary items carry their Hebrew meaning, e.g. "BANANA = בננה";
    // other items may carry a short explanation, e.g. the syllable split "בַּ – לּוֹן"
    let translationHtml = '';
    if (exercise.correctAnswerHebrew) {
      translationHtml = `<div class="mt-1 text-lg font-black" dir="ltr">${exercise.revealWord || exercise.targetWordVocalized} = <span dir="rtl">${exercise.correctAnswerHebrew}</span></div>`;
    } else if (exercise.feedbackNote) {
      translationHtml = `<div class="mt-1 text-xl font-black" dir="auto">${exercise.feedbackNote}</div>`;
    }

    if (validationResult.isCorrect) {
      sfx.playSuccess();
      feedbackBanner.classList.add('bg-emerald-50', 'border-emerald-300', 'text-emerald-800');
      const challengeNote = exercise.isChallenge ? `<div class="mt-1">⭐ פתרת שאלת אתגר — קיבלת כוכב בונוס!</div>` : '';
      feedbackBanner.innerHTML = `🎉 ${validationResult.feedback}${challengeNote}${translationHtml}`;
      nextBtnContainer.classList.remove('hidden');
      nextBtn.innerHTML = `התרגיל הבא! 🌟`;

      if (targetElement) {
        targetElement.classList.add('selected-correct');
        const indicator = targetElement.querySelector('.opt-indicator');
        if (indicator) {
          indicator.textContent = '✅';
          indicator.classList.remove('opacity-40');
        }
      }

      // If comparison slot or operator slot exists, style it as success
      const symSlot = container.querySelector('#symbol-slot');
      if (symSlot) {
        symSlot.className = 'w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 border-4 border-emerald-500 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-black text-emerald-800 shadow-inner animate-pop';
      }
      const opSlot = container.querySelector('#operator-slot');
      if (opSlot) {
        opSlot.className = 'w-12 h-12 bg-emerald-100 border-2 border-emerald-500 rounded-xl flex items-center justify-center text-3xl text-emerald-800 font-black animate-pop';
      }
      const blankSlot = container.querySelector('#blank-slot');
      if (blankSlot) {
        blankSlot.className = 'min-w-[100px] text-center border-b-4 border-emerald-500 text-emerald-800 font-extrabold px-3 py-1 bg-emerald-100 rounded-xl animate-pop';
      }

      nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      // ON ERROR: Play error sound, highlight wrong answer in red, show correct answer in green, and move to next question!
      sfx.playError();
      feedbackBanner.classList.add('bg-rose-50', 'border-rose-300', 'text-rose-800');
      feedbackBanner.innerHTML = `❌ לא מדויק. התשובה הנכונה סומנה בירוק. ממשיכים הלאה! 💪${exercise.isChallenge ? `<div class="mt-1">⭐ זו הייתה שאלת אתגר מהכיתה הבאה — כל הכבוד על הניסיון!</div>` : ''}${translationHtml}`;
      nextBtnContainer.classList.remove('hidden');
      nextBtn.innerHTML = `התרגיל הבא! ➡️`;

      if (targetElement) {
        targetElement.classList.add('selected-wrong');
        const indicator = targetElement.querySelector('.opt-indicator');
        if (indicator) {
          indicator.textContent = '❌';
          indicator.classList.remove('opacity-40');
        }
      }

      // Highlight the correct answer element in green
      const correctValStr = String(validationResult.correctValue);
      container.querySelectorAll('.option-card').forEach(btn => {
        if (String(btn.dataset.id) === correctValStr) {
          btn.classList.add('ring-4', 'ring-emerald-400', 'border-emerald-500', 'bg-emerald-50', 'animate-pop');
        }
      });
      container.querySelectorAll('.symbol-btn').forEach(btn => {
        if (btn.dataset.symbol === correctValStr) {
          btn.classList.add('ring-4', 'ring-emerald-400', 'border-emerald-500', 'bg-emerald-50', 'animate-pop');
        }
      });
      container.querySelectorAll('.op-btn').forEach(btn => {
        if (btn.dataset.op === correctValStr) {
          btn.classList.add('ring-4', 'ring-emerald-400', 'border-emerald-500', 'bg-emerald-50', 'animate-pop');
        }
      });
      container.querySelectorAll('.reading-opt-btn').forEach(btn => {
        if (String(btn.dataset.id) === correctValStr) {
          btn.classList.add('ring-4', 'ring-emerald-400', 'border-emerald-500', 'bg-emerald-50');
          const ind = btn.querySelector('.opt-indicator');
          if (ind) { ind.textContent = '✅'; ind.classList.remove('opacity-40'); }
        }
      });
      container.querySelectorAll('.fill-opt-btn').forEach(btn => {
        if (String(btn.dataset.id) === correctValStr) {
          btn.classList.add('ring-4', 'ring-emerald-400', 'border-emerald-500', 'bg-emerald-50');
        }
      });

      nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Automatically advance to the next question after 2 seconds
      autoAdvanceTimer = setTimeout(() => {
        triggerNext();
      }, 2000);
    }
  }

  // Type: image_word_match, visual_counting, visual_addition, arithmetic_choice
  container.querySelectorAll('.option-card').forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasAnswered) return;
      sfx.playClick();
      const selectedId = btn.dataset.id;
      const result = validateAnswer(exercise, selectedId);
      handleResult(result, btn, selectedId);
    });
  });

  // Type: comparison_drill
  container.querySelectorAll('.symbol-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasAnswered) return;
      sfx.playClick();
      const symbol = btn.dataset.symbol;
      const slot = container.querySelector('#symbol-slot');
      if (slot) slot.textContent = symbol;
      const result = validateAnswer(exercise, symbol);
      handleResult(result, btn, symbol);
    });
  });

  // Type: operator_choice
  container.querySelectorAll('.op-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasAnswered) return;
      sfx.playClick();
      const op = btn.dataset.op;
      const slot = container.querySelector('#operator-slot');
      if (slot) slot.textContent = op;
      const result = validateAnswer(exercise, op);
      handleResult(result, btn, op);
    });
  });

  // Type: reading_comprehension_question
  container.querySelectorAll('.reading-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasAnswered) return;
      sfx.playClick();
      const selectedId = btn.dataset.id;
      const result = validateAnswer(exercise, selectedId);
      handleResult(result, btn, selectedId);
    });
  });

  // Type: fill_in_blank
  container.querySelectorAll('.fill-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasAnswered) return;
      sfx.playClick();
      const selectedId = btn.dataset.id;
      const slot = container.querySelector('#blank-slot');
      if (slot) slot.textContent = selectedId;
      const result = validateAnswer(exercise, selectedId);
      handleResult(result, btn, selectedId);
    });
  });

  // Type: numeric_input (keypad)
  const keypadDisplay = container.querySelector('#keypad-display');
  container.querySelectorAll('.keypad-key').forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasAnswered) return;
      sfx.playClick();
      const key = btn.dataset.key;

      if (key === 'clear') {
        enteredNumber = '';
        if (keypadDisplay) keypadDisplay.textContent = '-';
      } else if (key === 'submit') {
        if (!enteredNumber) {
          alert('נא להקליד מספר תחילה');
          return;
        }
        const result = validateAnswer(exercise, enteredNumber);
        handleResult(result, keypadDisplay, enteredNumber);
      } else {
        if (enteredNumber.length < 5) {
          enteredNumber += key;
          if (keypadDisplay) keypadDisplay.textContent = enteredNumber;
        }
      }
    });
  });

  // Next button click
  nextBtn.addEventListener('click', () => {
    sfx.playClick();
    triggerNext();
  });
}
