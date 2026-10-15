// Web Audio API Synthesizer for instant, zero-latency sound effects without external files
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(state) {
    this.enabled = state !== undefined ? state : !this.enabled;
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.15, delay = 0, gainVal = 0.15) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playSuccess() {
    // Joyful upward arpeggio: C5 -> E5 -> G5 -> C6
    this.playTone(523.25, 'triangle', 0.12, 0.0, 0.15);
    this.playTone(659.25, 'triangle', 0.12, 0.08, 0.15);
    this.playTone(783.99, 'triangle', 0.15, 0.16, 0.18);
    this.playTone(1046.50, 'triangle', 0.25, 0.24, 0.2);
  }

  playError() {
    // Gentle boop (soft low tone, reassuring, not discouraging)
    this.playTone(280, 'sine', 0.15, 0.0, 0.12);
    this.playTone(220, 'sine', 0.22, 0.1, 0.12);
  }

  playClick() {
    // Soft subtle tap
    this.playTone(600, 'sine', 0.04, 0.0, 0.08);
  }

  playStar() {
    // Sparkly star pickup chime
    this.playTone(880, 'sine', 0.08, 0.0, 0.12);
    this.playTone(1320, 'sine', 0.15, 0.07, 0.15);
  }

  playVictory() {
    // Grand celebration fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50, 880, 1046.50];
    const times = [0.0, 0.12, 0.24, 0.36, 0.52, 0.68];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', idx === notes.length - 1 ? 0.5 : 0.14, times[idx], 0.2);
    });
  }
}

export const sfx = new SoundEffects();
