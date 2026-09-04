// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  primaryNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================
// Theme toggle (light / dark)
// ============================
const THEME_KEY = 'ateera-theme';
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    themeToggle.textContent = theme === 'light' ? '🌙 Dark' : '☀️ Light';
  }
}

const savedTheme = (() => {
  try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
})();
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
  });
}

// ============================
// Product rendering
// ============================
// Data lives here directly (not fetched from a separate JSON file) so the
// shop works even when this page is opened straight from disk, where
// browsers block fetch() of local files. Edit this array to update the shop.
const PRODUCTS = [
  {
    id: 'p1',
    name: 'Mocha',
    notes: 'Brewed elegance in every flame',
    image: 'images/mocha.jpg',
    hue: 'rust'
  },
  {
    id: 'p2',
    name: 'Vanilla',
    notes: 'Sweet serenity in every flicker',
    image: 'images/vanilla.jpg',
    hue: 'marigold'
  },
  {
    id: 'p3',
    name: 'Mango',
    notes: 'Indulge in the sweet embrace of Mango dreams',
    image: 'images/mango.jpg',
    hue: 'amber'
  },
  {
    id: 'p4',
    name: 'Lemongrass',
    notes: 'Citrus zen in every flicker',
    image: 'images/lemongrass.jpg',
    hue: 'sage'
  },
  {
    id: 'p5',
    name: 'Lavender',
    notes: 'Premium quality, highly fragranced',
    image: 'images/lavender.jpg',
    hue: 'rose'
  },
  {
    id: 'p6',
    name: 'Coffee Latte',
    notes: 'Soy wax candle, made in India',
    image: 'images/coffee-latte.jpg',
    hue: 'forest'
  }
];

const HUES = {
  marigold: ['#F1B457', '#E7A33E'],
  forest:   ['#7C9270', '#3D5240'],
  rust:     ['#D98A66', '#B1452F'],
  sage:     ['#A9C19A', '#7C9270'],
  rose:     ['#E3A3A0', '#C36A66'],
  amber:    ['#E3A75E', '#C97B2E']
};

function candleSVG(hue) {
  const [light, dark] = HUES[hue] || HUES.marigold;
  return `
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${hue}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${light}"/>
          <stop offset="100%" stop-color="${dark}"/>
        </linearGradient>
      </defs>
      <path d="M42 20c0 6-5 8-5 15a5 5 0 0010 0c0-7-5-9-5-15z" fill="${dark}"/>
      <rect x="46" y="34" width="8" height="20" rx="2" fill="#EFE7D8"/>
      <rect x="20" y="50" width="60" height="60" rx="8" fill="url(#g-${hue})"/>
      <ellipse cx="50" cy="50" rx="30" ry="6" fill="${light}"/>
    </svg>`;
}

function candleFallback(imgEl, hue) {
  const wrapper = imgEl.closest('.product-photo');
  if (wrapper) wrapper.innerHTML = candleSVG(hue);
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-photo" style="background:${(HUES[p.hue] || HUES.marigold)[0]}22;">
        ${p.image
          ? `<img src="${p.image}" alt="${p.name} scented candle" loading="lazy"
                  onerror="candleFallback(this, '${p.hue}')">`
          : candleSVG(p.hue)}
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="product-notes">${p.notes}</p>
        <div class="product-footer">
          <span class="product-price" aria-label="Price on enquiry">₹</span>
          <a class="product-enquire"
             href="mailto:enactuszhdc@gmail.com?subject=${encodeURIComponent('Ateera candle enquiry: ' + p.name)}">
            Enquire
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

renderProducts(PRODUCTS);
