/* Kayyotech Solutions — script.js */

(function () {
  'use strict';

  /* ── Dark mode ── */
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('kyt-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved === 'dark' || (!saved && prefersDark)) {
    html.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('kyt-theme', isDark ? 'light' : 'dark');
  });

  /* ── Nav scroll shadow ── */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav toggle ── */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    animateBurger(open);
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      animateBurger(false);
    });
  });

  function animateBurger(open) {
    const spans = navToggle.querySelectorAll('span');
    if (open) {
      spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
      spans[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
      spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => s.removeAttribute('style'));
    }
  }

  /* ── Intersection Observer — reveal on scroll ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Contact form — basic client-side handling ── */
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form-note';

    const name      = form.name.value.trim();
    const email     = form.email.value.trim();
    const challenge = form.challenge.value.trim();

    if (!name || !email || !challenge) {
      status.textContent = 'Please fill in all required fields.';
      status.classList.add('error');
      return;
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.classList.add('error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    /* Simulated send — replace with your backend/service endpoint */
    setTimeout(() => {
      status.textContent = "Thanks! We'll be in touch within one business day.";
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }, 1200);
  });

  /* ── Footer year ── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
