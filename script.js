/* Kayyotech Solutions — script.js v2 */
(function () {
  'use strict';

  const html = document.documentElement;

  /* ══════════════════════════════════════════
     1. THEME — defaults to dark, respects saved pref
  ══════════════════════════════════════════ */
  const saved = localStorage.getItem('kyt-theme');
  if (saved) {
    html.setAttribute('data-theme', saved);
  }
  // HTML already has data-theme="dark" so dark is default without saved pref

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const next   = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('kyt-theme', next);
  });

  /* ══════════════════════════════════════════
     2. NAV — scroll shadow + mobile toggle
  ══════════════════════════════════════════ */
  const header    = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    const spans = navToggle.querySelectorAll('span');
    if (open) {
      spans[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
      spans[1].style.cssText = 'opacity:0;transform:scaleX(0)';
      spans[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => s.removeAttribute('style'));
    }
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelectorAll('span').forEach(s => s.removeAttribute('style'));
    });
  });

  /* ══════════════════════════════════════════
     3. PARTICLE CANVAS
  ══════════════════════════════════════════ */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animId;

    const PARTICLE_COUNT = 72;
    const NAVY  = '27, 42, 107';
    const TEAL  = '58, 175, 169';

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function createParticle() {
      return {
        x:   rand(0, W),
        y:   rand(0, H),
        r:   rand(1, 3.2),
        vx:  rand(-0.25, 0.25),
        vy:  rand(-0.3, -0.08),
        alpha: rand(0.08, 0.55),
        color: Math.random() > 0.65 ? TEAL : NAVY,
      };
    }

    function initParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${TEAL}, ${0.06 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -6) { p.y = H + 6; p.x = rand(0, W); }
        if (p.x < -6) p.x = W + 6;
        if (p.x > W + 6) p.x = -6;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(tick);
    }

    resize();
    initParticles();
    tick();

    const ro = new ResizeObserver(() => { resize(); initParticles(); });
    ro.observe(canvas.parentElement);
  }

  /* ══════════════════════════════════════════
     4A. TYPED HERO TEXT
  ══════════════════════════════════════════ */
  const typedEl = document.getElementById('typed-line');
  if (typedEl) {
    const phrases = [
      'Work Smarter',
      'Serve Faster',
      'Grow Better',
      'Automate More',
      'Never Miss a Call',
      'Attract More Customers',
    ];
    let pIdx = 0, cIdx = 0, deleting = false;
    const TYPE_SPEED   = 68;
    const DELETE_SPEED = 34;
    const PAUSE_END    = 2200;
    const PAUSE_START  = 400;

    function typeStep() {
      const phrase = phrases[pIdx];
      if (!deleting) {
        typedEl.textContent = phrase.slice(0, ++cIdx);
        if (cIdx === phrase.length) {
          deleting = true;
          setTimeout(typeStep, PAUSE_END);
          return;
        }
        setTimeout(typeStep, TYPE_SPEED);
      } else {
        typedEl.textContent = phrase.slice(0, --cIdx);
        if (cIdx === 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
          setTimeout(typeStep, PAUSE_START);
          return;
        }
        setTimeout(typeStep, DELETE_SPEED);
      }
    }
    setTimeout(typeStep, 900);
  }

  /* ══════════════════════════════════════════
     4B. MOUSE PARALLAX — hero glow
  ══════════════════════════════════════════ */
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    document.addEventListener('mousemove', e => {
      const xPct = (e.clientX / window.innerWidth  - 0.5) * 60;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 60;
      heroGlow.style.transform = `translate(${xPct}px, ${yPct}px)`;
    }, { passive: true });
  }

  /* ══════════════════════════════════════════
     4C. CURSOR SPOTLIGHT
  ══════════════════════════════════════════ */
  const spotlight = document.getElementById('cursor-spotlight');
  if (spotlight) {
    let spotX = 0, spotY = 0, rafSpot;
    document.addEventListener('mousemove', e => {
      spotX = e.clientX;
      spotY = e.clientY;
      spotlight.classList.add('active');
      cancelAnimationFrame(rafSpot);
      rafSpot = requestAnimationFrame(() => {
        spotlight.style.left = spotX + 'px';
        spotlight.style.top  = spotY + 'px';
      });
    }, { passive: true });
    document.addEventListener('mouseleave', () => spotlight.classList.remove('active'));
  }

  /* ══════════════════════════════════════════
     4D. SCROLL SPY — active nav link
  ══════════════════════════════════════════ */
  const sections   = document.querySelectorAll('section[id], div[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const spyObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => spyObs.observe(s));

  /* ══════════════════════════════════════════
     4E. 3D CARD TILT
  ══════════════════════════════════════════ */
  const MAX_TILT   = 9;   // degrees
  const SCALE_UP   = 1.03;

  document.querySelectorAll('.tilt-card').forEach(card => {
    const shine = card.querySelector('.tilt-shine');

    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const rotX  = -dy * MAX_TILT;
      const rotY  =  dx * MAX_TILT;

      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${SCALE_UP})`;

      if (shine) {
        const shineX = ((e.clientX - rect.left) / rect.width)  * 100;
        const shineY = ((e.clientY - rect.top)  / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.1), transparent 65%)`;
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      if (shine) shine.style.background = '';
    });
  });

  /* ══════════════════════════════════════════
     4. INTERSECTION OBSERVER — reveal + stat bars + counters
  ══════════════════════════════════════════ */
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix || '';
    const dur     = 1800;
    const start   = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(easeOut(progress) * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');

      /* Stat bars */
      el.querySelectorAll('.stat-fill').forEach(bar => {
        bar.classList.add('animated');
      });

      /* Counters */
      el.querySelectorAll('.stat-num[data-target]').forEach(num => {
        animateCounter(num);
      });

      revealObs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Directly visible on load ── */
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('visible');
    });
  }, 120);

  /* ══════════════════════════════════════════
     5. CONTACT FORM
  ══════════════════════════════════════════ */
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      status.textContent = '';
      status.className   = 'form-note';

      const name      = form.name.value.trim();
      const email     = form.email.value.trim();
      const challenge = form.challenge.value.trim();

      if (!name || !email || !challenge) {
        status.textContent = 'Please fill in all required fields.';
        status.classList.add('error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        status.classList.add('error');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled     = true;
      btn.textContent  = 'Sending…';

      /* Swap for fetch() to your backend / Formspree endpoint */
      setTimeout(() => {
        status.textContent = "Message received — we'll be in touch within one business day.";
        form.reset();
        btn.disabled    = false;
        btn.textContent = 'Send Message';
      }, 1400);
    });
  }

  /* ══════════════════════════════════════════
     6. FOOTER YEAR
  ══════════════════════════════════════════ */
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();

})();
