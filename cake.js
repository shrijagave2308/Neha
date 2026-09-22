// ---- Floating hearts background ----
function initHearts(density = 30) {
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  const hearts = Array.from({ length: density }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h + h * 0.2,
    size: Math.random() * 12 + 6,
    speed: Math.random() * 0.5 + 0.15,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.02 + 0.008,
    swayAmp: Math.random() * 0.6 + 0.2,
    alpha: Math.random() * 0.20 + 0.12,
    color: Math.random() > 0.5 ? '231,84,128' : '255,0,0'
  }));

  function drawHeart(x, y, size, alpha, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 16, size / 16);

    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(0, -3, -9, -3, -9, 4);
    ctx.bezierCurveTo(-9, 11, 0, 15, 0, 20);
    ctx.bezierCurveTo(0, 15, 9, 11, 9, 4);
    ctx.bezierCurveTo(9, -3, 0, -3, 0, 4);
    ctx.closePath();

    ctx.fillStyle = `rgba(${color},${alpha})`;
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);

    for (const p of hearts) {
      p.y -= p.speed;
      p.sway += p.swaySpeed;
      p.x += Math.sin(p.sway) * p.swayAmp * 0.1;

      if (p.y < -20) {
        p.y = h + 20;
        p.x = Math.random() * w;
      }

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;

      drawHeart(p.x, p.y, p.size, p.alpha, p.color);
    }

    requestAnimationFrame(tick);
  }

  tick();
}

// ---- Scene-to-scene transition ----
function goTo(url) {
  document.body.classList.add('leaving');
  setTimeout(() => {
    window.location.href = url;
  }, 650);
}

function goTo(url) {
  document.body.classList.add('leaving');
  setTimeout(() => { window.location.href = url; }, 650);
}

function initTrail(step, total = 5) {
  const trail = document.createElement('div');
  trail.className = 'trail';
  for (let i = 1; i <= total; i++) {
    const dot = document.createElement('span');
    if (i < step) dot.classList.add('done');
    if (i === step) dot.classList.add('now');
    trail.appendChild(dot);
  }
  document.body.appendChild(trail);
}

function burst(originEl, count = 46) {
  const rect = originEl ? originEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const shapes = ['❤', '✦', '●'];
  const colors = ['#e75480', '#ffb6c1', '#d9a54a', '#fff0f5'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    el.style.position = 'fixed';
    el.style.left = cx + 'px';
    el.style.top = cy + 'px';
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.fontSize = (Math.random() * 14 + 8) + 'px';
    el.style.pointerEvents = 'none';
    el.style.zIndex = 20;
    el.style.opacity = '1';
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 220 + 80;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 60;
    const rot = (Math.random() * 360) | 0;
    const dur = Math.random() * 900 + 900;

    el.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 }
    ], { duration: dur, easing: 'cubic-bezier(.22,.68,.28,1)', fill: 'forwards' });

    setTimeout(() => el.remove(), dur + 50);
  }
}

initHearts(30);
initTrail(2);

const cakeHolder = document.getElementById('cakeHolder');
const revealText = document.getElementById('revealText');
const nextBtn = document.getElementById('nextBtn');
let clicked = false;

// Hint now appears after both lines of text, the cake, and all four
// candles have finished sparking up (last candle finishes around 5.9s)
setTimeout(() => {
  if (!clicked) {
    revealText.innerHTML = '<p style="color:var(--muted); font-style:normal; font-size:2rem;">Tap the cake&hellip;</p>';
  }
}, 6200);

cakeHolder.addEventListener('click', () => {
  if (clicked) return;
  clicked = true;

  burst(cakeHolder, 60);

  revealText.innerHTML = '<p class="birthday-message">Happy Birthday, Neha!❤️</p>';
  nextBtn.style.display = 'inline-flex';
});

nextBtn.addEventListener('click', () => goTo('wish.html'));
