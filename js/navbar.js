const existingNav = document.querySelector('body > nav.sticky');
const mount = document.querySelector('[data-site-nav]') || document.createElement('div');
const page = window.location.pathname.split('/').pop();
if (['admin.html', 'member.html', 'speaker.html'].includes(page)) {
  document.body.classList.add('dashboard-page');
}
if (['401.html', '403.html', '404.html', '429.html', '500.html'].includes(page)) {
  document.body.classList.add('flex-col', 'site-error-page');
}
const currentPage = page === 'kontak.html' ? 'contact'
  : page === 'about.html' ? 'about'
  : page === 'legal.html' ? 'legal'
  : page === 'events.html' || page === 'event-detail.html' ? 'events'
  : page === 'projects.html' || page === 'project-detail.html' ? 'projects'
  : 'home';

if (existingNav) existingNav.replaceWith(mount);
else if (!mount.isConnected) document.body.prepend(mount);
mount.classList.add('site-nav-mount');

const links = [
  ['home', 'index.html', 'Beranda'],
  ['events', 'events.html', 'Event'],
  ['projects', 'projects.html', 'Project'],
  ['about', 'about.html', 'Tentang'],
  ['contact', 'kontak.html', 'Kontak'],
];

mount.innerHTML = `
  <nav class="site-nav" aria-label="Navigasi utama">
    <div class="site-nav__inner">
      <a class="site-nav__brand" href="index.html">
        <span class="site-nav__logo"><img src="/img/palembangpy.png" alt="PalembangPy Logo"></span>
        <span>PalembangPy</span>
      </a>
      <button class="site-nav__toggle" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="siteNavLinks">
        <span></span><span></span><span></span>
      </button>
    </div>
    <button class="site-nav__backdrop" type="button" aria-label="Tutup menu"></button>
    <div class="site-nav__links" id="siteNavLinks">
      ${links.map(([key, href, label]) => `<a href="${href}"${key === currentPage ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </div>
  </nav>`;

const nav = mount.querySelector('.site-nav');
const toggle = mount.querySelector('.site-nav__toggle');
const backdrop = nav.querySelector('.site-nav__backdrop');
const menu = nav.querySelector('.site-nav__links');
document.body.append(backdrop, menu);
const menuLinks = menu.querySelectorAll('a');

const setMenuOpen = (open) => {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  document.body.classList.toggle('site-nav-menu-open', open);
};

toggle.addEventListener('click', () => {
  setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
});
backdrop.addEventListener('click', () => setMenuOpen(false));
menuLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});
const closeMenuOnDesktop = () => {
  if (!window.matchMedia('(max-width: 767px)').matches) setMenuOpen(false);
};

window.addEventListener('resize', closeMenuOnDesktop);
window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
  if (event.matches) setMenuOpen(false);
});