document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
      toggle.classList.toggle('active');
    });
  }

  const openButtons = document.querySelectorAll('.js-open-waitlist');
  const trigger = document.getElementById('fillout-waitlist-trigger');

  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!trigger) return;
      const filloutButton = trigger.querySelector('button, a, [role="button"]');
      (filloutButton || trigger).click();
    });
  });
});
