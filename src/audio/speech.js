// Bulletproof Speech Service: Web Speech API with High-Quality Audio Stream Fallback
// Guarantees Hebrew & English pronunciation even on Windows PCs without Hebrew TTS installed

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.currentAudio = null;
    this.activeUtterance = null; // Prevents Chromium garbage collection bug

    if (this.synth) {
      this.loadVoices();
      if ('onvoiceschanged' in this.synth) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return [];
    try {
      this.voices = this.synth.getVoices() || [];
    } catch (e) {
      this.voices = [];
    }
    return this.voices;
  }

  hasVoiceFor(langCode) {
    this.loadVoices();
    const prefix = langCode.split('-')[0].toLowerCase();
    return this.voices.some(v => v.lang && v.lang.toLowerCase().startsWith(prefix));
  }

  speak(text, lang = 'he-IL', rate = 0.85, onEndCallback = null) {
    if (!text) return;

    // Clean nikkud for pronunciation engines
    const cleanText = text.replace(/[\u0591-\u05C7]/g, '').trim();
    if (!cleanText) return;

    this.stop();

    const langPrefix = lang.split('-')[0].toLowerCase();
    const hasNativeVoice = this.hasVoiceFor(langPrefix);

    // If device has a native Hebrew/English voice installed (e.g. mobile/Android), use it
    if (hasNativeVoice && this.synth) {
      this.speakNative(cleanText, lang, rate, onEndCallback, () => {
        // Fallback to audio stream if native synthesis throws an error
        this.speakAudioStream(cleanText, lang, onEndCallback);
      });
    } else {
      // Direct high-quality audio fallback (essential on Windows where Hebrew TTS voice is missing by default)
      this.speakAudioStream(cleanText, lang, onEndCallback);
    }
  }

  speakNative(text, lang, rate, onEndCallback, onErrorFallback) {
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      this.activeUtterance = utterance; // Prevent GC

      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = 1.05;

      const langPrefix = lang.split('-')[0].toLowerCase();
      const matchVoice = this.voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
      if (matchVoice) {
        utterance.voice = matchVoice;
      }

      let errorCalled = false;
      utterance.onerror = (e) => {
        console.warn('Native speech error, using stream fallback:', e);
        if (!errorCalled) {
          errorCalled = true;
          this.activeUtterance = null;
          if (onErrorFallback) onErrorFallback();
        }
      };

      utterance.onend = () => {
        this.activeUtterance = null;
        if (onEndCallback) onEndCallback();
      };

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Native speech exception:', e);
      if (onErrorFallback) onErrorFallback();
    }
  }

  // The stream endpoint accepts ~200 characters per request, so long texts (reading passages)
  // are split at sentence/comma boundaries and played one chunk after another.
  splitForStream(text, maxLen = 180) {
    const pieces = text.split(/(?<=[.!?:;,\n])\s+/);
    const chunks = [];
    let current = '';
    for (const piece of pieces) {
      if ((current + ' ' + piece).trim().length <= maxLen) {
        current = (current + ' ' + piece).trim();
        continue;
      }
      if (current) chunks.push(current);
      // A single piece longer than maxLen is cut at word boundaries
      let rest = piece;
      while (rest.length > maxLen) {
        const cut = rest.lastIndexOf(' ', maxLen) > 0 ? rest.lastIndexOf(' ', maxLen) : maxLen;
        chunks.push(rest.slice(0, cut).trim());
        rest = rest.slice(cut).trim();
      }
      current = rest;
    }
    if (current) chunks.push(current);
    return chunks;
  }

  speakAudioStream(text, lang, onEndCallback) {
    const tl = lang.startsWith('he') ? 'he' : 'en';
    const chunks = this.splitForStream(text);
    const finish = () => {
      this.currentAudio = null;
      if (onEndCallback) onEndCallback();
    };

    const playChunk = (index) => {
      if (index >= chunks.length) {
        finish();
        return;
      }
      try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(chunks[index])}`;
        const audio = new Audio(url);
        this.currentAudio = audio;
        audio.playbackRate = 0.95;

        audio.onended = () => {
          // stop() clears currentAudio; only continue if this chunk is still the active one
          if (this.currentAudio === audio) playChunk(index + 1);
        };

        audio.onerror = (err) => {
          console.warn('Audio stream error:', err);
          finish();
        };

        const promise = audio.play();
        if (promise !== undefined) {
          promise.catch(err => {
            console.warn('Playback promise failed:', err);
            finish();
          });
        }
      } catch (e) {
        console.warn('Audio stream creation failed:', e);
        finish();
      }
    };

    playChunk(0);
  }

  stop() {
    if (this.synth) {
      try { this.synth.cancel(); } catch (e) {}
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }
    this.activeUtterance = null;
  }

  speakHebrew(text, onEnd = null) {
    this.speak(text, 'he-IL', 0.85, onEnd);
  }

  speakEnglish(text, onEnd = null) {
    this.speak(text, 'en-US', 0.85, onEnd);
  }
}

export const speech = new SpeechService();
