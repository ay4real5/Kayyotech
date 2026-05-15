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
