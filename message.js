function initHearts(density = 30) {
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
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
    alpha: Math.random() * 0.35 + 0.2,
    color: Math.random() > 0.5 ? '231,84,128' : '255,165,74'
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
      if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      drawHeart(p.x, p.y, p.size, p.alpha, p.color);
    }
    requestAnimationFrame(tick);
  }
  tick();
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

initHearts(30);
initTrail(4);
document.getElementById('nextBtn').addEventListener('click', () => goTo('album.html'));
