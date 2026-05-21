/* ── Theme Toggle ──────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
let isDark = localStorage.getItem('theme') === 'dark';
function applyTheme() {
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
applyTheme();
themeToggle.addEventListener('click', () => { isDark = !isDark; applyTheme(); });

/* ── Navbar shrink ─────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Hamburger ─────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
function toggleMobileMenu() {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
}

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

hamburger.addEventListener('click', toggleMobileMenu);
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ── Scroll Reveal ─────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── Parallax ──────────────────────────────────────────────── */
const parallaxSections = [
  { banner: document.getElementById('parallax1'), bg: document.getElementById('pb1') },
  { banner: document.getElementById('parallax2'), bg: document.getElementById('pb2') },
  { banner: document.getElementById('parallax3'), bg: document.getElementById('pb3') },
];
let ticking = false;

function updateParallax() {
  parallaxSections.forEach(({ banner, bg }) => {
    if (!banner || !bg) return;
    const rect = banner.getBoundingClientRect();
    const wH = window.innerHeight;
    if (rect.bottom < 0 || rect.top > wH) return;
    const progress = (wH - rect.top) / (wH + rect.height);
    const offset = (progress - 0.5) * 120;
    bg.style.transform = `translateY(${offset}px)`;
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });
updateParallax();

/* ── FAQ Accordion ─────────────────────────────────────────── */
function closeAllFaqItems() {
  document.querySelectorAll('[data-faq]').forEach(faq => faq.classList.remove('open'));
}

document.querySelectorAll('[data-faq]').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    closeAllFaqItems();
    if (!isOpen) item.classList.add('open');
  });
});

/* ── Depoimentos Carousel ──────────────────────────────────── */
const track = document.getElementById('depoTrack');
const dots = document.querySelectorAll('.depo-dot');
let current = 0;
const cards = document.querySelectorAll('.depo-card');

function goTo(idx) {
  if (!track || !cards.length) return;

  current = Math.max(0, Math.min(idx, cards.length - 1));

  const activeCard = cards[current];
  const viewport = track.parentElement;
  const viewportW = viewport.getBoundingClientRect().width;
  const cardW = activeCard.getBoundingClientRect().width;
  const cardOffset = activeCard.offsetLeft;
  const maxTranslate = Math.max(0, track.scrollWidth - viewportW);

  // Move by exact pixels and keep the active card centered in the visible area.
  const centeredOffset = cardOffset - (viewportW - cardW) / 2;
  const translateX = Math.max(0, Math.min(centeredOffset, maxTranslate));

  track.style.transform = `translateX(-${translateX}px)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

if (track && cards.length) {
  const depoPrev = document.getElementById('depoPrev');
  const depoNext = document.getElementById('depoNext');
  if (depoPrev) depoPrev.addEventListener('click', () => goTo(current - 1));
  if (depoNext) depoNext.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  window.addEventListener('resize', () => goTo(current));
  goTo(0);
}

/* ── Smooth active nav link ────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navLinkByHref = new Map([...navLinks].map(link => [link.getAttribute('href'), link]));

function setActiveNavLink(activeId) {
  navLinks.forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
  });
}

const linkObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      if (navLinkByHref.has(`#${e.target.id}`)) setActiveNavLink(e.target.id);
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => linkObs.observe(s));

/* ── Hover tilt on pilar cards ─────────────────────────────── */
document.querySelectorAll('.pilar-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Hero badges on mobile ─────────────────────────────────── */
const heroBadge = document.getElementById('heroBadge1');
const heroBadgeQuery = window.matchMedia('(max-width: 767px)');

function syncHeroBadgeState() {
  if (!heroBadge) return;

  if (heroBadgeQuery.matches) {
    heroBadge.classList.add('is-collapsed');
    heroBadge.classList.remove('is-expanded');
    heroBadge.setAttribute('aria-expanded', 'false');
  } else {
    heroBadge.classList.remove('is-collapsed', 'is-expanded');
    heroBadge.setAttribute('aria-expanded', 'false');
  }
}

syncHeroBadgeState();

if (heroBadge) {
  heroBadge.addEventListener('click', () => {
    if (!heroBadgeQuery.matches) return;

    const isExpanded = heroBadge.classList.toggle('is-expanded');
    heroBadge.classList.toggle('is-collapsed', !isExpanded);
    heroBadge.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  });
}

if (heroBadgeQuery.addEventListener) {
  heroBadgeQuery.addEventListener('change', syncHeroBadgeState);
} else if (heroBadgeQuery.addListener) {
  heroBadgeQuery.addListener(syncHeroBadgeState);
}