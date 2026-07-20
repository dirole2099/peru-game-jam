function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

let currentLang = localStorage.getItem('pgj-lang') || 'en';

function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const val = getPath(dict, el.getAttribute('data-i18n'));
    if (val != null) el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const val = getPath(dict, el.getAttribute('data-i18n-html'));
    if (val != null) el.innerHTML = val;
  });

  const label = document.getElementById('lang-label');
  if (label) label.textContent = lang.toUpperCase();

  document.querySelectorAll('.lang-option').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

function buildModalContent(kind, city) {
  const t = translations[currentLang].modals;

  if (kind === 'vision') {
    const bullets = t.vision.bullets.map((b) => `<li>${b}</li>`).join('');
    return `
      <div class="modal-icon"><img src="assets/images/logo-full-transparent-red.png" alt="${t.vision.imageAlt}"></div>
      <h3 class="modal-title-center">${t.vision.title}</h3>
      <ul class="modal-bullets">${bullets}</ul>
    `;
  }

  if (kind === 'howitworks') {
    const steps = t.howItWorks.steps.map((s) => `
      <div class="modal-step">
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
      </div>
    `).join('');
    return `
      <h3>${t.howItWorks.title}</h3>
      <img class="modal-image" src="https://picsum.photos/seed/pgj-gamedev/900/560" alt="${t.howItWorks.imageAlt}">
      <div class="modal-steps">${steps}</div>
    `;
  }

  if (kind === 'lima') {
    return `
      <img class="modal-image" src="assets/images/hero-lima.jpg" alt="${t.lima.imageAlt}">
      <h3>${t.lima.title}</h3>
      <p>${t.lima.text}</p>
    `;
  }

  if (kind === 'comingSoon' && city) {
    return `
      <h3>${t.comingSoon[city]}</h3>
      <p>${t.comingSoon.message}</p>
    `;
  }

  return '';
}

function openModal(html) {
  const overlay = document.getElementById('modal-overlay');
  const body = document.getElementById('modal-body');
  if (!overlay || !body) return;
  body.innerHTML = html;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(currentLang);

  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
      toggle.classList.toggle('active');
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) {
        nav.classList.remove('nav-open');
        toggle.classList.remove('active');
      }
    });
  }

  // Language dropdown (click to open/close)
  const langDropdown = document.getElementById('lang-dropdown');
  const langSwitch = document.getElementById('lang-switch');
  if (langDropdown && langSwitch) {
    langSwitch.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => langDropdown.classList.remove('open'));
    document.querySelectorAll('.lang-option').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLang = btn.getAttribute('data-lang');
        localStorage.setItem('pgj-lang', currentLang);
        applyTranslations(currentLang);
        langDropdown.classList.remove('open');
      });
    });
  }

  // Waitlist popup trigger
  const openWaitlistButtons = document.querySelectorAll('.js-open-waitlist');
  const filloutTrigger = document.getElementById('fillout-waitlist-trigger');
  openWaitlistButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!filloutTrigger) return;
      const filloutButton = filloutTrigger.querySelector('button, a, [role="button"]');
      (filloutButton || filloutTrigger).click();
    });
  });

  // Generic content modal triggers
  document.querySelectorAll('[data-modal-kind]').forEach((el) => {
    el.addEventListener('click', () => {
      const kind = el.getAttribute('data-modal-kind');
      const city = el.getAttribute('data-city');
      openModal(buildModalContent(kind, city));
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const kind = el.getAttribute('data-modal-kind');
        const city = el.getAttribute('data-city');
        openModal(buildModalContent(kind, city));
      }
    });
  });

  // Modal close handlers
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
