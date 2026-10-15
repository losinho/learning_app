// LocalStorage-based Multi-Profile & Progression Manager with Session Logging & Parental Analytics
const STORAGE_KEY = 'edu_kids_app_data_v1';

const DEFAULT_AVATARS = ['🦁', '🐬', '🚀', '🦄', '🐼', '🦊', '🦖', '⭐', '🦉', '🎨'];

class StorageService {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
    }

    // Initial default profile setup
    const defaultProfile = {
      id: 'profile_' + Date.now(),
      name: 'איתי',
      ageGroup: '5', // '5' or '8-9'
      avatar: '🦁',
      createdAt: Date.now(),
      stars: 0,
      completedExercises: [],
      sessionLogs: [],
      stats: {
        hebrew: 0,
        math: 0,
        english: 0,
        totalAnswered: 0,
        totalCorrect: 0,
        totalIncorrect: 0
      }
    };

    const initialData = {
      profiles: [defaultProfile],
      activeProfileId: defaultProfile.id,
      settings: {
        sound: true,
        speech: true
      }
    };

    this.save(initialData);
    return initialData;
  }

  save(dataToSave = null) {
    if (dataToSave) {
      this.data = dataToSave;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  getProfiles() {
    return this.data.profiles || [];
  }

  getActiveProfile() {
    const profile = this.data.profiles.find(p => p.id === this.data.activeProfileId);
    if (!profile && this.data.profiles.length > 0) {
      this.data.activeProfileId = this.data.profiles[0].id;
      this.save();
      return this.data.profiles[0];
    }
    return profile;
  }

  setActiveProfile(profileId) {
    const exists = this.data.profiles.some(p => p.id === profileId);
    if (exists) {
      this.data.activeProfileId = profileId;
      this.save();
    }
  }

  createProfile(name, ageGroup, avatar) {
    const newProfile = {
      id: 'profile_' + Date.now(),
      name: name.trim() || 'ילד/ה',
      ageGroup: ageGroup || '5',
      avatar: avatar || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
      createdAt: Date.now(),
      stars: 0,
      completedExercises: [],
      sessionLogs: [],
      stats: {
        hebrew: 0,
        math: 0,
        english: 0,
        totalAnswered: 0,
        totalCorrect: 0,
        totalIncorrect: 0
      }
    };

    this.data.profiles.push(newProfile);
    this.data.activeProfileId = newProfile.id;
    this.save();
    return newProfile;
  }

  updateProfile(profileId, updates) {
    const idx = this.data.profiles.findIndex(p => p.id === profileId);
    if (idx !== -1) {
      this.data.profiles[idx] = { ...this.data.profiles[idx], ...updates };
      this.save();
      return this.data.profiles[idx];
    }
    return null;
  }

  deleteProfile(profileId) {
    if (this.data.profiles.length <= 1) return false;
    this.data.profiles = this.data.profiles.filter(p => p.id !== profileId);
    if (this.data.activeProfileId === profileId) {
      this.data.activeProfileId = this.data.profiles[0].id;
    }
    this.save();
    return true;
  }

  recordSuccess(exerciseId, subject) {
    const profile = this.getActiveProfile();
    if (!profile) return;

    if (!profile.completedExercises) profile.completedExercises = [];
    if (!profile.stats) profile.stats = { hebrew: 0, math: 0, english: 0, totalAnswered: 0, totalCorrect: 0, totalIncorrect: 0 };

    profile.stars = (profile.stars || 0) + 1;
    if (!profile.completedExercises.includes(exerciseId)) {
      profile.completedExercises.push(exerciseId);
    }
    if (subject && profile.stats[subject] !== undefined) {
      profile.stats[subject] += 1;
    }

    this.save();
    return profile;
  }

  saveSession(sessionData) {
    const profile = this.getActiveProfile();
    if (!profile) return;
    if (!profile.sessionLogs) profile.sessionLogs = [];

    // Keep last 50 sessions per child
    profile.sessionLogs.unshift(sessionData);
    if (profile.sessionLogs.length > 50) {
      profile.sessionLogs = profile.sessionLogs.slice(0, 50);
    }

    if (!profile.stats) {
      profile.stats = { hebrew: 0, math: 0, english: 0, totalAnswered: 0, totalCorrect: 0, totalIncorrect: 0 };
    }
    profile.stats.totalAnswered = (profile.stats.totalAnswered || 0) + (sessionData.totalQuestions || 0);
    profile.stats.totalCorrect = (profile.stats.totalCorrect || 0) + (sessionData.correctCount || 0);
    profile.stats.totalIncorrect = (profile.stats.totalIncorrect || 0) + (sessionData.incorrectCount || 0);

    this.save();
    return sessionData;
  }

  getProfileAnalytics(profileId = null) {
    const profile = profileId ? this.data.profiles.find(p => p.id === profileId) : this.getActiveProfile();
    if (!profile) return null;

    const logs = profile.sessionLogs || [];
    const topicStats = {};
    const subjectStats = {
      hebrew: { total: 0, correct: 0 },
      math: { total: 0, correct: 0 },
      english: { total: 0, correct: 0 }
    };

    logs.forEach(session => {
      if (subjectStats[session.subject]) {
        subjectStats[session.subject].total += session.totalQuestions || 0;
        subjectStats[session.subject].correct += session.correctCount || 0;
      }

      (session.questions || []).forEach(q => {
        const topicName = q.topic || q.title || 'כללי';
        if (!topicStats[topicName]) {
          topicStats[topicName] = { 
            topic: topicName, 
            category: q.category || session.subject,
            total: 0, 
            correct: 0, 
            incorrect: 0, 
            mistakes: [] 
          };
        }
        topicStats[topicName].total += 1;
        if (q.isCorrect) {
          topicStats[topicName].correct += 1;
        } else {
          topicStats[topicName].incorrect += 1;
          topicStats[topicName].mistakes.push(q);
        }
      });
    });

    // Calculate accuracy percentage per topic and identify problem areas
    const allTopics = Object.values(topicStats).map(t => ({
      ...t,
      accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 100
    }));

    // Problem areas: Topics with mistakes where accuracy is under 75%
    const problemAreas = allTopics
      .filter(t => t.incorrect > 0 && t.accuracy < 75)
      .sort((a, b) => a.accuracy - b.accuracy);

    const overallTotal = profile.stats?.totalAnswered || logs.reduce((sum, s) => sum + (s.totalQuestions || 0), 0);
    const overallCorrect = profile.stats?.totalCorrect || logs.reduce((sum, s) => sum + (s.correctCount || 0), 0);
    const overallAccuracy = overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 100;

    return {
      profile,
      totalSessions: logs.length,
      overallTotal,
      overallCorrect,
      overallAccuracy,
      subjectStats,
      allTopics,
      problemAreas,
      recentSessions: logs
    };
  }

  clearSessionLogs(profileId = null) {
    const profile = profileId ? this.data.profiles.find(p => p.id === profileId) : this.getActiveProfile();
    if (!profile) return;
    profile.sessionLogs = [];
    if (profile.stats) {
      profile.stats.totalAnswered = 0;
      profile.stats.totalCorrect = 0;
      profile.stats.totalIncorrect = 0;
    }
    this.save();
  }

  getAvatars() {
    return DEFAULT_AVATARS;
  }

  getSettings() {
    return this.data.settings || { sound: true, speech: true };
  }

  updateSettings(settings) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
  }
}

export const storage = new StorageService();
