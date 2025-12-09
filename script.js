// Modern animated interactions using GSAP + small vanilla helpers
document.addEventListener('DOMContentLoaded', () => {
  // Fill year (guard)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });

    // Close nav when clicking outside (mobile)
    document.addEventListener('click', (e) => {
      const insideNav = nav.contains(e.target) || navToggle.contains(e.target);
      if (!insideNav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scrolling ONLY for in-page anchor links (#)
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      // If link starts with # → smooth scroll within page
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
      // Close mobile nav when any nav link is clicked
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Highlight active page link based on current file
  (function setActiveNav() {
    const links = document.querySelectorAll('.nav-link');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      // normalize common names (index/home)
      const name = href.split('/').pop();
      if (!name) return;
      if (name === current || (name === 'index.html' && current === '') ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  })();

  // GSAP animations (only run if available)
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance (only if hero on page)
    if (document.querySelector('.hero-left .hero-title')) {
      gsap.from('.hero-left .hero-title', {
        y: 28, opacity: 0, duration: .9, ease: 'power3.out', delay: .15
      });
      gsap.from('.hero-left .hero-sub', { y: 20, opacity: 0, duration: .9, ease: 'power3.out', delay: .25 });
      gsap.from('.hero-cta .btn', { y: 14, opacity: 0, duration: .8, ease: 'power3.out', stagger: 0.08, delay: 0.5 });
    }

    // Reveal on scroll for sections
    gsap.utils.toArray('.section').forEach(section => {
      gsap.from(section.querySelectorAll('h2, p, .project-card, .skill-pill, .contact-card, .contact-form, .about-right'), {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 24, opacity: 0, duration: .7, stagger: 0.06, ease: 'power2.out'
      });
    });

    // Project cards slight hover tilt (if project cards exist)
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (py - 0.5) * 6;
        const ry = (px - 0.5) * -8;
        gsap.to(card, { transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`, duration: 0.4, ease: 'power3.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { transform: 'rotateX(0) rotateY(0) translateZ(0)', duration: 0.6, ease: 'power3.out' });
      });
    });
  }
});
