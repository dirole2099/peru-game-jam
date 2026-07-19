document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
      toggle.classList.toggle('active');
    });
  }

  const form = document.getElementById('waitlist-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      form.innerHTML = `<p style="color:#fff;font-weight:600;">Thanks! We'll be in touch at ${email}.</p>`;
    });
  }
});
