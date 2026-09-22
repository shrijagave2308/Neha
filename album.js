function initHearts(density = 38) {
    const canvas = document.getElementById('bg');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let w = 0;
    let h = 0;

    function resize() {
        const r = Math.min(devicePixelRatio || 1, 2);

        w = innerWidth;
        h = innerHeight;

        canvas.width = w * r;
        canvas.height = h * r;

        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        ctx.setTransform(r, 0, 0, r, 0, 0);
    }

    resize();

    addEventListener('resize', resize);

    const hearts = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 10 + 5,
        speed: Math.random() * 0.35 + 0.1,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.018 + 0.006,
        alpha: Math.random() * 0.18 + 0.08,
        color: Math.random() > 0.5
            ? '231,84,128'
            : '217,165,74'
    }));

    function drawHeart(x, y, s, a, c) {
        ctx.save();

        ctx.translate(x, y);
        ctx.scale(s / 16, s / 16);

        ctx.beginPath();

        ctx.moveTo(0, 4);
        ctx.bezierCurveTo(0, -3, -9, -3, -9, 4);
        ctx.bezierCurveTo(-9, 11, 0, 15, 0, 20);
        ctx.bezierCurveTo(0, 15, 9, 11, 9, 4);
        ctx.bezierCurveTo(9, -3, 0, -3, 0, 4);

        ctx.closePath();

        ctx.fillStyle = `rgba(${c},${a})`;
        ctx.fill();

        ctx.restore();
    }

    function tick() {
        ctx.clearRect(0, 0, w, h);

        hearts.forEach(p => {
            p.y -= p.speed;
            p.sway += p.swaySpeed;
            p.x += Math.sin(p.sway) * 0.08;

            if (p.y < -25) {
                p.y = h + 25;
                p.x = Math.random() * w;
            }

            drawHeart(
                p.x,
                p.y,
                p.size,
                p.alpha,
                p.color
            );
        });

        requestAnimationFrame(tick);
    }

    tick();
}

function initTrail(total = 5) {
    const oldTrail = document.querySelector('.trail');

    if (oldTrail) {
        oldTrail.remove();
    }

    const trail = document.createElement('div');
    trail.className = 'trail';

    for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        trail.appendChild(dot);
    }

    document.body.appendChild(trail);
}

initHearts(38);
initTrail(5);

const pages = [...document.querySelectorAll('.page')];
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const hint = document.getElementById('hint');
const wrap = document.getElementById('bookWrap');

pages.forEach((p, i) => {
    p.style.zIndex = pages.length - i;
});

let current = 0;
let locked = false;
let startX = 0;
let startY = 0;

function updateControls() {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= pages.length;

    if (current === 0) {
        hint.textContent = 'Start from here · Tap or swipe';
    } else if (current >= pages.length) {
        hint.textContent = 'That was for you. ♥';
    } else {
        hint.textContent = `Page ${current + 1} of ${pages.length} · Tap or swipe`;
    }
}

function flipNext() {
    if (locked || current >= pages.length) return;

    locked = true;

    const p = pages[current];

    p.classList.add('flipping');

    requestAnimationFrame(() => {
        p.classList.add('flipped');
    });

    current++;

    updateControls();

    setTimeout(() => {
        p.classList.remove('flipping');
        locked = false;
    }, 1100);
}

function flipPrev() {
    if (locked || current <= 0) return;

    locked = true;

    current--;

    const p = pages[current];

    p.classList.add('flipping');
    p.classList.remove('flipped');

    updateControls();

    setTimeout(() => {
        p.classList.remove('flipping');
        locked = false;
    }, 1100);
}

nextBtn.addEventListener('click', flipNext);

prevBtn.addEventListener('click', flipPrev);

wrap.addEventListener('click', e => {
    if (e.target.closest('.page')) {
        if (e.clientX > innerWidth / 2) {
            flipNext();
        } else {
            flipPrev();
        }
    }
});

wrap.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
}, {
    passive: true
});

wrap.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

    if (
        Math.abs(dx) > 40 &&
        Math.abs(dx) > Math.abs(dy)
    ) {
        if (dx < 0) {
            flipNext();
        } else {
            flipPrev();
        }
    }
}, {
    passive: true
});

document.addEventListener('keydown', e => {
    if (
        e.key === 'ArrowRight' ||
        e.key === ' ' ||
        e.key === 'Enter'
    ) {
        e.preventDefault();
        flipNext();
    }

    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        flipPrev();
    }
});

updateControls();
