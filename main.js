/* ═══════════════════════════════════════════════════
   QRIOUS CURATORS — Enhanced script.js v2
   Features:
   · Page loader
   · Custom cursor (smooth lag)
   · Scroll progress bar
   · Canvas particle system
   · Typewriter / text-scramble hero headline
   · Parallax orbs on mouse-move
   · Scroll-reveal (multi-direction)
   · Animated counters
   · 3D card tilt
   · Service card mouse-tracking glow
   · Portfolio filter
   · Testimonial slider (touch + auto)
   · Magnetic buttons
   · Nav scroll state
   · Hero italic underline trigger
═══════════════════════════════════════════════════ */

/* ─────────────────────────────────────
   0. INJECT DOM ELEMENTS
───────────────────────────────────── */
(function injectUI() {
  // Premium Curtain Reveal Overlay
  const curtain = document.createElement('div');
  curtain.className = 'curtain-reveal';
  curtain.innerHTML = `<div class="curtain-reveal__logo">QC<span>.</span></div>`;
  document.body.prepend(curtain);

  // Cursor elements
  const dot = document.createElement('div'); dot.id = 'cursor-dot';
  const ring = document.createElement('div'); ring.id = 'cursor-ring';
  document.body.append(dot, ring);

  // Scroll progress bar
  const bar = document.createElement('div'); bar.id = 'scroll-progress';
  document.body.prepend(bar);

  // Hero canvas
  const hero = document.getElementById('hero');
  if (hero) {
    const canvas = document.createElement('canvas');
    canvas.id = 'hero-canvas';
    hero.prepend(canvas);
  }

  // Rotating badge
  if (hero) {
    const badge = document.createElement('div');
    badge.className = 'hero__badge';
    badge.innerHTML = `
      <svg class="hero__badge-text" viewBox="0 0 110 110" width="110" height="110">
        <defs>
          <path id="circle-path"
            d="M 55,55 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"/>
        </defs>
        <text font-family="Syne,sans-serif" font-size="9.5" font-weight="700"
              fill="rgba(212,245,100,0.5)" letter-spacing="3">
          <textPath href="#circle-path">
            QRIOUS CURATORS · AGENCY ·&nbsp;
          </textPath>
        </text>
      </svg>
      <div class="hero__badge-dot"></div>
    `;
    hero.appendChild(badge);
  }

  // Glow div inside every service card
  document.querySelectorAll('.service-card').forEach(card => {
    const glow = document.createElement('div');
    glow.className = 'service-card__glow';
    card.appendChild(glow);
  });
})();

/* ─────────────────────────────────────
   1. PREMIUM START ANIMATION
───────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.add('app-loaded');
    
    // Trigger hero italic underline after load
    setTimeout(() => {
      const em = document.querySelector('.hero__headline em');
      if (em) em.classList.add('line-in');
    }, 600);
  }, 400); // slight delay for smooth intro
});

/* ─────────────────────────────────────
   2. CUSTOM CURSOR (smooth lag)
───────────────────────────────────── */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mx = -100, my = -100;
let rx = -100, ry = -100;
const LAG = 0.11;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  rx += (mx - rx) * LAG;
  ry += (my - ry) * LAG;

  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover state
document.querySelectorAll('a, button, .work-card, .service-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ─────────────────────────────────────
   3. SCROLL PROGRESS BAR
───────────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

/* ─────────────────────────────────────
   4. NAV SCROLL STATE
───────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─────────────────────────────────────
   5. MOBILE MENU
───────────────────────────────────── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mmLinks = document.querySelectorAll('.mm-link');

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.children[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  burger.children[1].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
mmLinks.forEach(l => l.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  burger.children[0].style.transform = '';
  burger.children[1].style.transform = '';
}));

/* ─────────────────────────────────────
   6. PARTICLE CANVAS (HERO BG)
───────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 55;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.alpha = Math.random() * 0.4 + 0.05;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 150;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.y < -10 || this.life > this.maxLife) this.reset(false);
    }
    draw() {
      const fade = this.life < 30
        ? this.life / 30
        : this.life > this.maxLife - 30
          ? (this.maxLife - this.life) / 30
          : 1;
      ctx.globalAlpha = this.alpha * fade;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = '#d4f564';
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Draw faint connecting lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.globalAlpha = (1 - dist / 110) * 0.04;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#d4f564';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ─────────────────────────────────────
   7. PARALLAX ORBS ON MOUSE MOVE
───────────────────────────────────── */
(function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const orb1 = hero.querySelector('.orb--1');
  const orb2 = hero.querySelector('.orb--2');
  if (!orb1 || !orb2) return;

  let targetX = 0, targetY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function update() {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    orb1.style.transform = `translate(${curX * 28}px, ${curY * 22}px) scale(1)`;
    orb2.style.transform = `translate(${-curX * 20}px, ${-curY * 16}px) scale(1)`;
    requestAnimationFrame(update);
  }
  update();
})();

/* ─────────────────────────────────────
   8. TEXT SCRAMBLE (HERO HEADLINE)
───────────────────────────────────── */
(function initScramble() {
  const headline = document.querySelector('.hero__headline');
  if (!headline) return;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&';
  const lines = Array.from(headline.querySelectorAll('br')).length + 1;
  // Only scramble the plain text nodes, not <em>
  const nodes = Array.from(headline.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim());

  nodes.forEach(node => {
    const original = node.textContent;
    const span = document.createElement('span');
    span.textContent = original;
    node.parentNode.replaceChild(span, node);

    let frame = 0;
    const DURATION = 20; // frames per char

    function scramble() {
      const progress = Math.min(frame / (original.length * DURATION), 1);
      const revealed = Math.floor(progress * original.length);
      let out = '';
      for (let i = 0; i < original.length; i++) {
        if (original[i] === ' ' || original[i] === '\n') { out += original[i]; continue; }
        if (i < revealed) { out += original[i]; }
        else { out += chars[Math.floor(Math.random() * chars.length)]; }
      }
      span.textContent = out;
      frame++;
      if (progress < 1) requestAnimationFrame(scramble);
    }

    // Kick off after loader
    setTimeout(() => scramble(), 1700);
  });
})();

/* ─────────────────────────────────────
   9. SCROLL REVEAL (multi-direction)
───────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────
   10. ANIMATED COUNTERS
───────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  const run = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 4); // quartic ease-out
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(run);
    else el.textContent = target;
  };
  requestAnimationFrame(run);
}

const statNums = document.querySelectorAll('.stat__num[data-target]');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statsObserver.observe(el));

/* ─────────────────────────────────────
   11. 3D CARD TILT (work cards)
───────────────────────────────────── */
(function initTilt() {
  if (!window.matchMedia('(hover:hover)').matches) return;

  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        translateY(-8px) scale(1.012)
        perspective(800px)
        rotateX(${-y * 8}deg)
        rotateY(${x * 8}deg)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─────────────────────────────────────
   12. SERVICE CARD MOUSE-TRACKING GLOW
───────────────────────────────────── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ─────────────────────────────────────
   13. STAGGERED SERVICE CARD REVEAL
───────────────────────────────────── */
const serviceCards = document.querySelectorAll('.service-card');
const sObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const raw = getComputedStyle(entry.target).getPropertyValue('--card-delay').trim();
      const delay = parseInt(raw) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      sObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
serviceCards.forEach(c => sObserver.observe(c));

/* ─────────────────────────────────────
   14. PORTFOLIO FILTER
───────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    workCards.forEach((card, idx) => {
      const cats = card.dataset.cat || 'all';
      const show = filter === 'all' || cats.includes(filter);

      if (show) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.97)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          card.style.transition = `opacity 0.4s ease ${idx * 40}ms, transform 0.4s cubic-bezier(.22,1,.36,1) ${idx * 40}ms`;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }));
      } else {
        card.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px) scale(0.97)';
        setTimeout(() => { card.classList.add('hidden'); card.style.transform = ''; }, 300);
      }
    });
  });
});

/* ─────────────────────────────────────
   15. TESTIMONIAL SLIDER
───────────────────────────────────── */
const tTrack = document.getElementById('tTrack');
const tDots = document.querySelectorAll('.tdot');
let tCurrent = 0;
let tTimer;

function goTo(idx) {
  tCurrent = idx;
  tTrack.style.transform = `translateX(${-100 * idx}%)`;
  tDots.forEach((d, i) => d.classList.toggle('active', i === idx));
}
function nextSlide() { goTo((tCurrent + 1) % tDots.length); }

tDots.forEach(d => d.addEventListener('click', () => {
  clearInterval(tTimer);
  goTo(+d.dataset.idx);
  tTimer = setInterval(nextSlide, 5000);
}));
tTimer = setInterval(nextSlide, 5000);

// Touch / swipe
let tsX = null;
if (tTrack) {
  tTrack.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; }, { passive: true });
  tTrack.addEventListener('touchend', e => {
    if (tsX === null) return;
    const dx = e.changedTouches[0].clientX - tsX;
    if (Math.abs(dx) > 44) {
      clearInterval(tTimer);
      goTo(dx < 0
        ? Math.min(tCurrent + 1, tDots.length - 1)
        : Math.max(tCurrent - 1, 0));
      tTimer = setInterval(nextSlide, 5000);
    }
    tsX = null;
  });
}

/* ─────────────────────────────────────
   16. MAGNETIC BUTTONS
───────────────────────────────────── */
(function initMagnetic() {
  if (!window.matchMedia('(hover:hover)').matches) return;
  document.querySelectorAll('.btn--primary, .btn--outline').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.24;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.24;
      btn.style.transform = `translate(${x}px, ${y}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

/* ─────────────────────────────────────
   17. SMOOTH ANCHOR SCROLL
───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────
   18. NAV ACTIVE LINK (INTERSECTION)
───────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.style.color = 'var(--text)';
          }
        });
      }
    });
  }, { threshold: 0.45 });
  sections.forEach(s => secObserver.observe(s));
})();

/* ─────────────────────────────────────
   19. WORK CARD SPOTLIGHT GLOW
───────────────────────────────────── */
(function initWorkGlow() {
  document.querySelectorAll('.work-card').forEach(card => {
    // inject glow layer
    const glow = document.createElement('div');
    glow.className = 'work-card__glow';
    card.appendChild(glow);

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
})();

/* ─────────────────────────────────────
   20. SLIDING FILTER PILL + PROJECT COUNT
───────────────────────────────────── */
(function initFilterEnhancements() {
  const filtersEl = document.querySelector('.work__filters');
  const grid = document.querySelector('.work__grid');
  if (!filtersEl || !grid) return;

  /* ── Inject sliding pill ── */
  const pill = document.createElement('div');
  pill.className = 'work__filter-pill';
  filtersEl.insertBefore(pill, filtersEl.firstChild);

  function movePill(btn) {
    pill.style.left = btn.offsetLeft + 'px';
    pill.style.width = btn.offsetWidth + 'px';
  }

  // Position pill on active btn immediately
  const initActive = filtersEl.querySelector('.filter-btn.active');
  if (initActive) {
    pill.style.transition = 'none';
    movePill(initActive);
    requestAnimationFrame(() => { pill.style.transition = ''; });
  }

  filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => movePill(btn));
  });

  /* ── Inject project count ── */
  const countEl = document.createElement('div');
  countEl.className = 'work__count';
  countEl.innerHTML = `Showing <span class="work__count-num" id="workCountNum">5</span> projects`;
  grid.insertAdjacentElement('beforebegin', countEl);

  const countNum = document.getElementById('workCountNum');

  function animateCount(newVal) {
    countNum.classList.add('out');
    setTimeout(() => {
      countNum.textContent = newVal;
      countNum.classList.remove('out');
      countNum.classList.add('in');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        countNum.classList.remove('in');
      }));
    }, 250);
  }

  // Hook into filter clicks to update count
  filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      const allCards = document.querySelectorAll('.work-card');
      let visible = 0;
      allCards.forEach(c => {
        const cats = c.dataset.cat || '';
        if (filter === 'all' || cats.includes(filter)) visible++;
      });
      animateCount(visible);
    });
  });
})();

/* ─────────────────────────────────────
   21. PROJECT MODAL
───────────────────────────────────── */
(function initProjectModal() {

  /* ── Project data ── */
  const projects = [
    {
      cardEl: null, // filled below
      dataId: 'luminary',
      thumb: 'thumb--1',
      tag: 'Brand + Web',
      title: 'Luminary Co.',
      sub: 'Complete brand identity & e-commerce site',
      year: '2024', duration: '8 Weeks',
      desc: 'A full brand overhaul for a premium wellness brand — from logo & visual identity to a fully custom Webflow e-commerce experience. We built every touchpoint from scratch to feel cohesive, premium, and conversion-focused.',
      results: [
        { label: 'Revenue Increase', val: '+180%', pct: 90 },
        { label: 'Traffic Growth', val: '+320%', pct: 100 },
        { label: 'Conversion Rate', val: '4.8%', pct: 48 }
      ],
      tags: ['Brand Identity', 'Webflow', 'E-Commerce', 'UX Design', 'Copywriting'],
      cat: 'brand web'
    },
    {
      dataId: 'nourishmint',
      thumb: 'thumb--2',
      tag: 'Social Media',
      title: 'NourishMint',
      sub: 'Content strategy & growth campaign',
      year: '2024', duration: '6 Months',
      desc: 'A strategic social media overhaul turning a health brand\'s dormant presence into a viral growth machine — with scroll-stopping reels, a consistent content calendar, and data-driven growth sprints.',
      results: [
        { label: 'Follower Growth', val: '4k → 62k', pct: 92 },
        { label: 'Engagement Rate', val: '8.4%', pct: 84 },
        { label: 'Monthly Reach', val: '420k', pct: 78 }
      ],
      tags: ['Instagram', 'Content Strategy', 'Reels', 'Growth Hacking'],
      cat: 'social'
    },
    {
      dataId: 'vertex',
      thumb: 'thumb--3',
      tag: 'Web Design',
      title: 'Vertex SaaS',
      sub: 'Landing page with 3.2× conversion lift',
      year: '2023', duration: '3 Weeks',
      desc: 'A high-performance SaaS landing page engineered for conversion — combining strategic copywriting, motion design, and relentless A/B testing to turn ad traffic into paying customers.',
      results: [
        { label: 'Conversion Lift', val: '3.2×', pct: 96 },
        { label: 'Bounce Rate Drop', val: '−44%', pct: 66 },
        { label: 'Lighthouse Score', val: '98/100', pct: 98 }
      ],
      tags: ['Landing Page', 'WordPress', 'CRO', 'Motion Design', 'Copywriting'],
      cat: 'web'
    },
    {
      dataId: 'solstice',
      thumb: 'thumb--4',
      tag: 'Branding',
      title: 'Solstice Studio',
      sub: 'Brand refresh & guidelines system',
      year: '2023', duration: '5 Weeks',
      desc: 'A modern brand refresh that evolved a tired creative studio identity into a bold, scalable visual system — with a comprehensive brand guidelines document delivered for every use case.',
      results: [
        { label: 'Assets Delivered', val: '60+', pct: 60 },
        { label: 'Client Satisfaction', val: '100%', pct: 100 },
        { label: 'Delivered On Time', val: '✓', pct: 100 }
      ],
      tags: ['Logo Design', 'Brand Guidelines', 'Typography', 'Color System'],
      cat: 'brand'
    },
    {
      dataId: 'archetype',
      thumb: 'thumb--5',
      tag: 'Social + Web',
      title: 'Archetype Apparel',
      sub: 'Shopify + Instagram growth system',
      year: '2024', duration: '4 Months',
      desc: 'An end-to-end digital transformation for a streetwear brand — a rebuilt Shopify storefront paired with a relentless Instagram growth engine that doubled revenue and built a cult following.',
      results: [
        { label: 'Revenue Growth', val: '+210%', pct: 95 },
        { label: 'Instagram Followers', val: '28k+', pct: 72 },
        { label: 'Store Conversion', val: '5.6%', pct: 56 }
      ],
      tags: ['Shopify', 'Instagram', 'Social Commerce', 'Email Marketing', 'UGC'],
      cat: 'social web'
    }
  ];

  /* ── Build & inject modal backdrop ── */
  const backdrop = document.createElement('div');
  backdrop.className = 'proj-modal-backdrop';
  backdrop.id = 'projModalBackdrop';
  backdrop.innerHTML = `
    <div class="proj-modal" id="projModal" role="dialog" aria-modal="true" aria-label="Project Details">
      <button class="proj-modal__close" id="projModalClose" aria-label="Close">✕</button>
      <div class="proj-modal__thumb">
        <div class="proj-modal__thumb-inner" id="projModalThumb"></div>
      </div>
      <div class="proj-modal__body">
        <span class="proj-modal__tag"  id="projModalTag"></span>
        <h2  class="proj-modal__title" id="projModalTitle"></h2>
        <p   class="proj-modal__sub"   id="projModalSub"></p>
        <div class="proj-modal__meta"  id="projModalMeta"></div>
        <div class="proj-modal__divider"></div>
        <p   class="proj-modal__desc"  id="projModalDesc"></p>
        <p   class="proj-modal__section-label">Key Results</p>
        <div class="proj-modal__results" id="projModalResults"></div>
        <p   class="proj-modal__section-label">Stack & Services</p>
        <div class="proj-modal__tags"  id="projModalTags"></div>
        <div class="proj-modal__footer">
          <a href="#contact" class="proj-modal__cta" id="projModalCta">Start a Similar Project →</a>
          <button class="proj-modal__cta-ghost" id="projModalClose2">← Back to Work</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  const modal = document.getElementById('projModal');
  const closeBtn = document.getElementById('projModalClose');
  const closeBtn2 = document.getElementById('projModalClose2');
  const ctaBtn = document.getElementById('projModalCta');

  /* ── Open modal ── */
  function openModal(proj) {
    // Populate thumbnail
    document.getElementById('projModalThumb').className = 'proj-modal__thumb-inner ' + proj.thumb;

    // Basic info
    document.getElementById('projModalTag').textContent = proj.tag;
    document.getElementById('projModalTitle').textContent = proj.title;
    document.getElementById('projModalSub').textContent = proj.sub;
    document.getElementById('projModalDesc').textContent = proj.desc;

    // Meta (year + duration)
    document.getElementById('projModalMeta').innerHTML = `
      <div class="proj-modal__meta-item">
        <span class="proj-modal__meta-label">Year</span>
        <span class="proj-modal__meta-val">${proj.year}</span>
      </div>
      <div class="proj-modal__meta-item">
        <span class="proj-modal__meta-label">Duration</span>
        <span class="proj-modal__meta-val">${proj.duration}</span>
      </div>
      <div class="proj-modal__meta-item">
        <span class="proj-modal__meta-label">Category</span>
        <span class="proj-modal__meta-val">${proj.tag}</span>
      </div>
    `;

    // Results bars (reset widths first for re-animation)
    const resultsEl = document.getElementById('projModalResults');
    resultsEl.innerHTML = proj.results.map(r => `
      <div class="result-bar">
        <div class="result-bar__header">
          <span class="result-bar__name">${r.label}</span>
          <span class="result-bar__val">${r.val}</span>
        </div>
        <div class="result-bar__track">
          <div class="result-bar__fill" data-pct="${r.pct}"></div>
        </div>
      </div>
    `).join('');

    // Tags / chips
    document.getElementById('projModalTags').innerHTML =
      proj.tags.map(t => `<span class="proj-modal__chip">${t}</span>`).join('');

    // Show backdrop
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;

    // Animate result bars after transition
    setTimeout(() => {
      modal.querySelectorAll('.result-bar__fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
    }, 420);
  }

  /* ── Close modal ── */
  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  closeBtn2.addEventListener('click', closeModal);
  ctaBtn.addEventListener('click', closeModal); // allow navigation

  // Click outside modal box to close
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });

  // ESC key to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
  });

  /* ── Attach click to each work card ── */
  document.querySelectorAll('.work-card').forEach((card, idx) => {
    if (!projects[idx]) return;
    card.style.cursor = 'pointer';

    card.addEventListener('click', e => {
      // Don't open modal if user is just finishing a tilt gesture (small movement)
      openModal(projects[idx]);
    });
  });

  /* ── Touch: prevent modal on swipe (only open on tap) ── */
  document.querySelectorAll('.work-card').forEach((card, idx) => {
    if (!projects[idx]) return;
    let touchStartX, touchStartY;
    card.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    card.addEventListener('touchend', e => {
      const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
      if (dx < 8 && dy < 8) openModal(projects[idx]); // tap only
    });
  });

})();

/* ─────────────────────────────────────
   22. PROJECT NUMBERS + SHINE LINE INJECT
───────────────────────────────────── */
(function injectCardElements() {
  document.querySelectorAll('.work-card').forEach((card, i) => {
    const num = document.createElement('span');
    num.className = 'work-card__num';
    num.textContent = String(i + 1).padStart(2, '0');
    card.appendChild(num);

    const media = card.querySelector('.work-card__media');
    if (media) {
      const shine = document.createElement('div');
      shine.className = 'work-card__shine';
      media.appendChild(shine);
    }
  });
})();

/* ─────────────────────────────────────
   23. SCROLL PARALLAX ON CARD THUMBS
───────────────────────────────────── */
(function initThumbParallax() {
  if (!window.matchMedia('(hover:hover)').matches) return;
  const thumbs = Array.from(document.querySelectorAll('.work-card__thumb'));
  function update() {
    const vh = window.innerHeight;
    thumbs.forEach(thumb => {
      const card = thumb.closest('.work-card');
      const rect = card.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const pct = (rect.top + rect.height / 2 - vh / 2) / vh;
      thumb.style.backgroundPositionY = `calc(50% + ${(pct * 16).toFixed(1)}px)`;
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─────────────────────────────────────
   24. BUTTON RIPPLE
───────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const r = document.createElement('span');
    r.className = 'btn-ripple';
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
    this.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});

/* ─────────────────────────────────────
   25. CARD ENTRANCE PULSE
───────────────────────────────────── */
(function initCardEntrance() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const card = e.target;
        setTimeout(() => {
          card.classList.add('just-entered');
          setTimeout(() => card.classList.remove('just-entered'), 900);
        }, 180);
        obs.unobserve(card);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.work-card').forEach(c => obs.observe(c));
})();

/* ─────────────────────────────────────
   26. CLIP-PATH REVEAL ON SECTION TITLES
───────────────────────────────────── */
document.querySelectorAll('.section-title.reveal').forEach(el => {
  el.classList.add('clip-reveal');
});

/* ─────────────────────────────────────
   27. MAGNETIC BUTTON ANIMATIONS
───────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(elem => {
  elem.addEventListener('mousemove', (e) => {
    const rect = elem.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calculate magnet strength based on distance from center
    elem.classList.remove('active');
    elem.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });

  elem.addEventListener('mouseleave', () => {
    elem.classList.add('active'); // active gives it the snap-back transition
    elem.style.transform = `translate(0px, 0px)`;
    
    // Remove active class after transition completes
    setTimeout(() => elem.classList.remove('active'), 300);
  });
});