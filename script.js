/* ═══════════════════════════════════════════════════
   EID MUBARAK — JAVASCRIPT
   script.js
═══════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   1. LOADER  — hide after assets load
───────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    gsap.to('#loader', {
      opacity: 0,
      duration: 0.8,
      onComplete: () => {
        document.getElementById('loader').style.display = 'none';
        initAnimations();
      }
    });
  }, 2000);
});

/* ─────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
const glow   = document.getElementById('mouse-glow');

let mx = 0, my = 0;   // mouse position
let rx = 0, ry = 0;   // ring position (lags behind)

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  // Snap cursor dot instantly
  gsap.to(cursor, { x: mx, y: my, duration: 0.05 });
  // Smoothly move glow
  gsap.to(glow,   { x: mx, y: my, duration: 0.8 });
});

// Ring follows with rubber-band lag
function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 21}px, ${ry - 21}px)`;
  requestAnimationFrame(animRing);
}
animRing();

// Cursor scale on hover
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor, { scale: 2.5,  duration: 0.3 });
    gsap.to(ring,   { width: 60, height: 60, borderColor: 'rgba(212,168,67,0.8)', duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor, { scale: 1,    duration: 0.3 });
    gsap.to(ring,   { width: 42, height: 42, borderColor: 'rgba(212,168,67,0.5)', duration: 0.3 });
  });
});

/* ─────────────────────────────────────────────
   3. STAR CANVAS  — twinkling starfield
───────────────────────────────────────────── */
const starCanvas = document.getElementById('star-canvas');
const sctx       = starCanvas.getContext('2d');
let   stars      = [];

function resizeStarCanvas() {
  starCanvas.width  = window.innerWidth;
  starCanvas.height = window.innerHeight;
}
resizeStarCanvas();
window.addEventListener('resize', resizeStarCanvas);

function initStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x:            Math.random() * starCanvas.width,
      y:            Math.random() * starCanvas.height,
      r:            Math.random() * 1.5 + 0.3,
      a:            Math.random(),
      twinkle:      Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005
    });
  }
}
initStars();

function drawStars() {
  sctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

  stars.forEach(s => {
    s.twinkle += s.twinkleSpeed;
    const alpha = s.a * (0.5 + 0.5 * Math.sin(s.twinkle));

    // Star dot
    sctx.beginPath();
    sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sctx.fillStyle = `rgba(212,168,67,${alpha})`;
    sctx.fill();

    // Cross flare on larger stars
    if (s.r > 1.2) {
      sctx.strokeStyle = `rgba(245,217,142,${alpha * 0.5})`;
      sctx.lineWidth   = 0.5;
      sctx.beginPath();
      sctx.moveTo(s.x - s.r * 3, s.y);
      sctx.lineTo(s.x + s.r * 3, s.y);
      sctx.moveTo(s.x, s.y - s.r * 3);
      sctx.lineTo(s.x, s.y + s.r * 3);
      sctx.stroke();
    }
  });

  requestAnimationFrame(drawStars);
}
drawStars();

/* ─────────────────────────────────────────────
   4. FLOATING LANTERNS
───────────────────────────────────────────── */
const lanternColors = [
  ['#D4A843', '#8A6A20'],
  ['#2E7D5E', '#1A4A3A'],
  ['#C43B3B', '#7A1E1E'],
  ['#8B4FC4', '#4A1F6E'],
  ['#D4A843', '#C43B3B']
];

function createLantern() {
  const container = document.getElementById('lanternContainer');
  const el        = document.createElement('div');
  el.className    = 'lantern';

  const ci    = Math.floor(Math.random() * lanternColors.length);
  const [c1, c2] = lanternColors[ci];
  const size  = 14 + Math.random() * 18;
  const dur   = 8 + Math.random() * 10;
  const drift = (Math.random() - 0.5) * 120;
  const left  = 5 + Math.random() * 90;
  const delay = Math.random() * 6;

  el.style.cssText = `left:${left}%;--drift:${drift}px;animation-duration:${dur}s;animation-delay:-${delay}s;`;

  el.innerHTML = `
    <div style="width:1px;height:${size * 0.7}px;background:linear-gradient(${c2},transparent)"></div>
    <div class="lantern-body"
         style="width:${size}px;height:${size * 1.5}px;
                box-shadow:0 0 ${size}px ${c1},0 0 ${size * 2}px ${c1}40">
      <div class="lantern-glow-inner"
           style="background:radial-gradient(circle at 40% 40%,${c1},${c2})"></div>
    </div>
    <div style="width:${size}px;height:4px;border-radius:0 0 6px 6px;background:${c2}"></div>
  `;

  container.appendChild(el);
  // Remove DOM node after animation completes to avoid memory leak
  setTimeout(() => el.remove(), (dur + delay) * 1000);
}

// Spawn lanterns on interval; pre-spawn a few immediately
setInterval(createLantern, 1500);
for (let i = 0; i < 6; i++) {
  setTimeout(createLantern, i * 400);
}

/* ─────────────────────────────────────────────
   5. GSAP ANIMATIONS
───────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

function initAnimations() {

  /* Hero entrance sequence */
  gsap.to('.mosque-svg', { opacity: 1, duration: 1.2, ease: 'power2.out' });

  gsap.fromTo('#crescent',
    { y: -30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.4, ease: 'back.out(1.5)', delay: 0.3 }
  );

  gsap.to('.hero-arabic', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8
  });

  gsap.fromTo('.hero-title',
    { opacity: 0, y: 60, skewY: 3 },
    { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power3.out', delay: 1.1 }
  );

  gsap.to('.hero-divider', { opacity: 1, duration: 0.8, delay: 1.4 });
  gsap.to('.hero-sub',     { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',    delay: 1.5 });
  gsap.to('.hero-btn',     { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)', delay: 1.7 });
  gsap.to('.scroll-hint',  { opacity: 1, duration: 0.6, delay: 2.2 });

  /* Crescent gentle float loop */
  gsap.to('#crescent', {
    y: -8,
    repeat: -1,
    yoyo: true,
    duration: 3,
    ease: 'sine.inOut'
  });

  /* Generic scroll reveals (.reveal class) */
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      }
    );
  });

  /* Wishes cards — staggered entrance */
  gsap.fromTo('.wish-card',
    { opacity: 0, y: 60, scale: 0.96 },
    {
      opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '.wishes-grid', start: 'top 80%' }
    }
  );

  /* Greeting card reveal */
  gsap.fromTo('.greeting-card',
    { opacity: 0, y: 80 },
    {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.greeting-card', start: 'top 80%' }
    }
  );

  /* Photo cards — staggered entrance */
  gsap.fromTo('.photo-card',
    { opacity: 0, y: 80, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out',
      stagger: 0.2,
      scrollTrigger: { trigger: '.photo-gallery-grid', start: 'top 82%' }
    }
  );

  // Auto-update the photo counter badge
  const count = document.querySelectorAll('.photo-gallery-grid .photo-card').length;
  const badge = document.getElementById('photoCount');
  if (badge) badge.textContent = count;

  /* Footer fade-in */
  gsap.fromTo('footer',
    { opacity: 0 },
    {
      opacity: 1, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: 'footer', start: 'top 90%' }
    }
  );
}

/* ─────────────────────────────────────────────
   6. FIREWORKS  — canvas particle system
───────────────────────────────────────────── */
const fwCanvas = document.getElementById('fwCanvas');
const fwctx    = fwCanvas.getContext('2d');
let   fwParticles = [];
let   fwRunning   = false;

function resizeFW() {
  fwCanvas.width  = fwCanvas.parentElement.offsetWidth;
  fwCanvas.height = fwCanvas.parentElement.offsetHeight;
}
resizeFW();
window.addEventListener('resize', resizeFW);

class FWParticle {
  constructor(x, y, color) {
    this.x = x; this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1.5;
    this.vx    = Math.cos(angle) * speed;
    this.vy    = Math.sin(angle) * speed;
    this.color = color;
    this.life  = 1;
    this.decay = Math.random() * 0.015 + 0.008;
    this.r     = Math.random() * 3 + 1;
    this.trail = [];
  }

  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 6) this.trail.shift();
    this.vy += 0.05;       // gravity
    this.x  += this.vx;
    this.y  += this.vy;
    this.vx *= 0.99;
    this.vy *= 0.99;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.save();

    // Trail
    this.trail.forEach((p, i) => {
      const a = (i / this.trail.length) * this.life * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, this.r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace('1)', `${a})`);
      ctx.fill();
    });

    // Head
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle  = this.color.replace('1)', `${this.life})`);
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fill();

    ctx.restore();
  }
}

const fwColors = [
  'rgba(212,168,67,1)',
  'rgba(245,217,142,1)',
  'rgba(60,186,138,1)',
  'rgba(255,200,100,1)',
  'rgba(200,150,255,1)',
  'rgba(255,120,80,1)',
  'rgba(100,200,255,1)'
];

function launchFirework() {
  const x     = Math.random() * fwCanvas.width;
  const y     = Math.random() * (fwCanvas.height * 0.6) + 20;
  const color = fwColors[Math.floor(Math.random() * fwColors.length)];
  const count = 80 + Math.floor(Math.random() * 50);

  for (let i = 0; i < count; i++) {
    fwParticles.push(new FWParticle(x, y, color));
  }
}

function animateFireworks() {
  if (!fwRunning) return;

  // Fade trail effect (semi-transparent fill)
  fwctx.fillStyle = 'rgba(4,13,26,0.18)';
  fwctx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

  fwParticles = fwParticles.filter(p => p.life > 0);
  fwParticles.forEach(p => { p.update(); p.draw(fwctx); });

  requestAnimationFrame(animateFireworks);
}

document.getElementById('fwBtn').addEventListener('click', () => {
  fwRunning = true;
  fwctx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  animateFireworks();

  let count = 0;
  const burst = setInterval(() => {
    launchFirework();
    count++;
    if (count > 12) {
      clearInterval(burst);
      // Let particles finish, then stop loop
      setTimeout(() => { fwRunning = false; }, 3000);
    }
  }, 200);

  // Button pulse feedback
  gsap.fromTo('#fwBtn',
    { scale: 1 },
    { scale: 1.1, yoyo: true, repeat: 1, duration: 0.15 }
  );
});

/* ─────────────────────────────────────────────
   7. MUSIC  — Web Audio API pentatonic melody
───────────────────────────────────────────── */
let audioCtx      = null;
let musicInterval = null;
let musicOn       = false;

function playNote(freq, startTime, duration, ctx, gainNode) {
  const osc = ctx.createOscillator();
  const g   = ctx.createGain();

  osc.connect(g);
  g.connect(gainNode);

  osc.frequency.value = freq;
  osc.type            = 'sine';

  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

function startMusic() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const master      = audioCtx.createGain();
  master.gain.value = 0.6;
  master.connect(audioCtx.destination);

  // D pentatonic: D E F# A B D5 E5
  const scale   = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25];
  const pattern = [0, 2, 3, 5, 4, 2, 1, 3, 5, 6, 4, 2, 0, 3, 2, 1];
  let step = 0;

  function playNext() {
    if (!musicOn) return;
    const now  = audioCtx.currentTime;
    const freq = scale[pattern[step % pattern.length]];
    playNote(freq,          now, 0.5, audioCtx, master);
    playNote(freq * 0.502,  now, 0.7, audioCtx, master); // soft harmony
    step++;
  }

  playNext();
  musicInterval = setInterval(playNext, 520);
}

function stopMusic() {
  clearInterval(musicInterval);
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
}

document.getElementById('musicBtn').addEventListener('click', function () {
  musicOn = !musicOn;

  if (musicOn) {
    startMusic();
    this.querySelector('.music-eq').style.color = 'var(--gold)';
    // Update last text node
    this.childNodes[this.childNodes.length - 1].textContent = ' Stop Music';
  } else {
    stopMusic();
    this.querySelector('.music-eq').style.color = '';
    this.childNodes[this.childNodes.length - 1].textContent = ' Play Festive Tone';
  }
});

/* ─────────────────────────────────────────────
   8. PARALLAX  — hero scene moves on scroll
───────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const heroScene = document.querySelector('.hero-scene');
  if (heroScene) {
    heroScene.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
});

/* ─────────────────────────────────────────────
   9. 3D CARD TILT  — mouse-move perspective
───────────────────────────────────────────── */
document.querySelectorAll('.greeting-card, .wish-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);

    card.style.transform =
      `translateY(-8px) rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg) scale(1.01)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
    card.style.transform  = '';
  });
});
