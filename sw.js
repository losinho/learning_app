// Service Worker for 100% offline capability
const CACHE_NAME = 'edu-learning-app-v42';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/tailwind.css',
  './css/app.css',
  './src/app.js',
  './src/storage.js',
  './src/audio/sfx.js',
  './src/audio/speech.js',
  './src/engine/validator.js',
  './src/engine/random.js',
  './src/engine/oddOneOut.js',
  './src/engine/patterns.js',
  './src/engine/procedural_math.js',
  './src/engine/shapes.js',
  './src/engine/coins.js',
  './src/engine/spatial.js',
  './src/components/englishTopicPicker.js',
  './public/icon.svg',
  './public/coins/agorot10.png',
  './public/coins/half.png',
  './public/coins/shekel1.png',
  './public/coins/shekel2.png',
  './public/coins/shekel5.png',
  './public/coins/shekel10.png',
  './src/data/index.js',
  './src/data/grades.js',
  './src/data/grades/roundUtils.js',
  './src/data/grades/math3.js',
  './src/data/grades/math4.js',
  './src/data/grades/english3.js',
  './src/data/grades/hebrew1.js',
  './src/data/grades/math1.js',
  './src/engine/grade1_math.js',
  './src/engine/grade2_math.js',
  './src/data/grades/hebrew2.js',
  './src/data/grades/math2.js',
  './src/data/grades/hebrew34.js',
  './src/data/grades/english4.js',
  './src/engine/area.js',
  './src/components/gradeChoiceModal.js',
  './src/data/age5/hebrew.js',
  './src/data/age5/math.js',
  './src/data/age5/english.js',
  './src/data/age5/russian.js',
  './src/data/age8_9/hebrew.js',
  './src/data/age8_9/math.js',
  './src/data/age8_9/english.js',
  './src/components/header.js',
  './src/components/subjectNav.js',
  './src/components/profileModal.js',
  './src/components/parentModal.js',
  './src/components/exerciseCard.js',
  './src/components/victoryModal.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // cache: 'reload' bypasses the browser's HTTP cache, otherwise a new version could re-cache old files
      return cache.addAll(ASSETS_TO_CACHE.map(url => new Request(url, { cache: 'reload' })));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Cache-first strategy for local assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback if offline
        return caches.match('./index.html');
      });
    })
  );
});
