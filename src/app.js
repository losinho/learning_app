// Main Application Controller with Session Logging & Parental Dashboard Integration
import { storage } from './storage.js';
import { sfx } from './audio/sfx.js';
import { renderHeader, updateHeaderStars } from './components/header.js';
import { renderSubjectNav } from './components/subjectNav.js';
import { renderProfileModal } from './components/profileModal.js';
import { renderParentModal } from './components/parentModal.js';
import { renderExerciseCard } from './components/exerciseCard.js';
import { showVictoryModal } from './components/victoryModal.js';
import { getExercisesForProfile } from './data/index.js';

class LearningApp {
  constructor() {
    this.activeSubject = 'hebrew';
    this.currentIndex = 0;
    this.exercises = [];
    this.sessionStars = 0;
    this.currentSession = null;

    this.headerMount = document.getElementById('header-mount');
    this.navMount = document.getElementById('nav-mount');
    this.exerciseMount = document.getElementById('exercise-mount');
    this.modalMount = document.getElementById('modal-mount');
  }

  init() {
    // Unlock Web Audio on first user interaction anywhere
    const unlockAudio = () => {
      sfx.init();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    this.renderLayout();
    this.loadExercises();
    this.renderCurrentExercise();
  }

  renderLayout() {
    renderHeader(
      this.headerMount, 
      () => this.openProfileModal(),
      () => this.openParentModal()
    );
    renderSubjectNav(this.navMount, this.activeSubject, (sub) => this.changeSubject(sub));
  }

  openProfileModal() {
    renderProfileModal(this.modalMount, () => {
      this.renderLayout();
      this.currentIndex = 0;
      this.sessionStars = 0;
      this.loadExercises();
      this.renderCurrentExercise();
    });
  }

  openParentModal() {
    renderParentModal(this.modalMount, () => {
      this.renderLayout();
    });
  }

  changeSubject(newSubject) {
    this.activeSubject = newSubject;
    this.currentIndex = 0;
    this.renderLayout();
    this.loadExercises();
    this.renderCurrentExercise();
  }

  loadExercises() {
    const profile = storage.getActiveProfile();
    this.exercises = getExercisesForProfile(profile, this.activeSubject);

    // Initialize fresh session tracking log
    this.currentSession = {
      id: 'sess_' + Date.now(),
      timestamp: Date.now(),
      subject: this.activeSubject,
      ageGroup: profile ? profile.ageGroup : '5',
      totalQuestions: this.exercises.length,
      correctCount: 0,
      incorrectCount: 0,
      questions: []
    };
  }

  renderCurrentExercise() {
    if (!this.exercises || this.exercises.length === 0) {
      this.exerciseMount.innerHTML = `
        <div class="text-center p-8 bg-white rounded-3xl border-2 border-slate-200">
          <p class="text-lg font-bold text-slate-600">אין תרגילים זמינים כעת בנושא זה.</p>
        </div>
      `;
      return;
    }

    if (this.currentIndex >= this.exercises.length) {
      // Session finished! Save session to persistent storage
      if (this.currentSession) {
        storage.saveSession(this.currentSession);
      }

      showVictoryModal(this.modalMount, this.sessionStars || this.exercises.length, () => {
        this.sessionStars = 0;
        this.currentIndex = 0;
        this.loadExercises();
        this.renderCurrentExercise();
      });
      return;
    }

    const currentEx = this.exercises[this.currentIndex];

    // Progress bar above exercise
    const progressPercent = Math.round(((this.currentIndex) / this.exercises.length) * 100);

    const progressHeader = `
      <div class="max-w-2xl mx-auto mb-3 px-2 flex items-center justify-between text-xs font-bold text-slate-500">
        <span>תרגיל ${this.currentIndex + 1} מתוך ${this.exercises.length}</span>
        <div class="w-36 sm:w-48 bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300">
          <div class="bg-emerald-500 h-full transition-all duration-300 rounded-full" style="width: ${progressPercent}%"></div>
        </div>
        <span>${progressPercent}%</span>
      </div>
    `;

    this.exerciseMount.innerHTML = progressHeader + `<div id="card-inner-mount"></div>`;

    const cardInner = this.exerciseMount.querySelector('#card-inner-mount');
    renderExerciseCard(cardInner, currentEx, (completedEx, attemptResult) => {
      this.handleExerciseCompleted(completedEx, attemptResult);
    });
  }

  handleExerciseCompleted(completedEx, attemptResult) {
    const isCorrect = Boolean(attemptResult && attemptResult.isCorrect);

    if (isCorrect) {
      this.sessionStars += 1;
      const updatedProfile = storage.recordSuccess(completedEx.id, this.activeSubject);
      if (updatedProfile) {
        updateHeaderStars(updatedProfile.stars);
        sfx.playStar();
      }
      if (this.currentSession) {
        this.currentSession.correctCount += 1;
      }
    } else {
      if (this.currentSession) {
        this.currentSession.incorrectCount += 1;
      }
    }

    // Save individual question result into the session log
    if (this.currentSession) {
      this.currentSession.questions.push({
        exerciseId: completedEx.id,
        title: completedEx.title || 'שאלה',
        topic: completedEx.title || 'כללי',
        category: completedEx.category || this.activeSubject,
        prompt: completedEx.instructionHebrew || completedEx.prompt || '',
        userAnswer: attemptResult?.userAnswer !== undefined ? attemptResult.userAnswer : '-',
        correctAnswer: attemptResult?.correctAnswer !== undefined ? attemptResult.correctAnswer : '-',
        isCorrect: isCorrect,
        timestamp: Date.now()
      });
    }

    this.currentIndex += 1;
    this.renderCurrentExercise();
  }
}

// Start app once DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new LearningApp();
  app.init();
});
