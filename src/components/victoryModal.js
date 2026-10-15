// Victory modal when completing exercises set
import { sfx } from '../audio/sfx.js';

export function showVictoryModal(container, starsEarned, onContinue) {
  sfx.playVictory();

  // Simple, self-contained canvas confetti animation
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.style.position = 'fixed';
  confettiCanvas.style.top = '0';
  confettiCanvas.style.left = '0';
  confettiCanvas.style.width = '100vw';
  confettiCanvas.style.height = '100vh';
  confettiCanvas.style.pointerEvents = 'none';
  confettiCanvas.style.zIndex = '9999';
  document.body.appendChild(confettiCanvas);

  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
    r: Math.random() * 8 + 4,
    d: Math.random() * 20 + 10,
    color: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'][Math.floor(Math.random() * 6)],
    tilt: Math.floor(Math.random() * 10) - 10,
    tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
    tiltAngle: 0
  }));

  let animationFrame;
  const drawConfetti = () => {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.tilt = Math.sin(p.tiltAngle - (p.r / 3)) * 15;

      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + (p.r / 4), p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 4));
      ctx.stroke();
    });
    animationFrame = requestAnimationFrame(drawConfetti);
  };
  drawConfetti();

  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    if (confettiCanvas.parentNode) confettiCanvas.parentNode.removeChild(confettiCanvas);
  }, 4000);

  container.innerHTML = `
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-4 border-amber-300 animate-pop">
        <div class="text-6xl mb-3 animate-bounce-gentle">🏆</div>
        <h2 class="text-2xl font-black text-slate-800 mb-1">אלופים! כל הכבוד!</h2>
        <p class="text-sm font-semibold text-slate-500 mb-4">סיימת בהצלחה את התרגילים!</p>
        
        <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-5 flex items-center justify-center gap-3">
          <span class="text-4xl">⭐</span>
          <div class="text-right">
            <div class="text-xs font-bold text-amber-800">הרווחת כוכבים:</div>
            <div class="text-2xl font-black text-amber-600">+${starsEarned} כוכבים חדשים!</div>
          </div>
        </div>

        <button id="btn-victory-continue" class="w-full btn-tactile bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3.5 rounded-2xl border-b-4 border-emerald-700 text-lg shadow-emerald-200 cursor-pointer">
          להמשיך לתרגילים נוספים! 🚀
        </button>
      </div>
    </div>
  `;

  container.querySelector('#btn-victory-continue').addEventListener('click', () => {
    sfx.playClick();
    container.innerHTML = '';
    if (onContinue) onContinue();
  });
}
