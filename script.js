const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.main-nav a')];

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

navLinks.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

const sections = [...document.querySelectorAll('main section[id]')];
const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .2, .5, .8] });
sections.forEach(section => observer.observe(section));

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contact-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  status.textContent = 'Merci ! Le formulaire est prêt à être relié à votre adresse e-mail.';
  form.reset();
});

// Contenu administrable — chargé depuis content/site.json
(async function loadManagedContent() {
  try {
    const response = await fetch('/content/site.json', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    document.querySelectorAll('[data-content]').forEach((el) => {
      const value = el.dataset.content.split('.').reduce((obj, key) => obj && obj[key], data);
      if (typeof value === 'string') el.textContent = value;
    });
  } catch (error) {
    console.warn('Contenu administrable indisponible :', error);
  }
})();
