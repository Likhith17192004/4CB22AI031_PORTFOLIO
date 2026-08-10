const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.primary-nav');
const filterButtons = document.querySelectorAll('.filter-button');
const projects = document.querySelectorAll('.project-card');
const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');

function applyTheme(theme) {
  const light = theme === 'light';
  body.classList.toggle('light-theme', light);
  themeToggle?.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
}

const savedTheme = localStorage.getItem('likith-portfolio-theme');
if (savedTheme) applyTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
  const next = body.classList.contains('light-theme') ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('likith-portfolio-theme', next);
});

function closeMenu() {
  navigation?.classList.remove('is-open');
  navToggle?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open menu');
}

navToggle?.addEventListener('click', () => {
  const isOpen = navigation?.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    projects.forEach((project) => {
      const matches = filter === 'all' || project.dataset.category === filter;
      project.classList.toggle('is-hidden', !matches);
    });
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.email);
    copyStatus.textContent = 'Email copied to clipboard.';
  } catch {
    copyStatus.textContent = 'Email: ' + copyButton.dataset.email;
  }
  window.setTimeout(() => { copyStatus.textContent = ''; }, 2600);
});

document.getElementById('year').textContent = new Date().getFullYear();
