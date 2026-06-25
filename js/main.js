/* ===== Theme Toggle ===== */
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  html.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ===== Sticky Header ===== */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== Mobile Nav ===== */
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
});

document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

/* ===== Active Nav Link ===== */
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

window.addEventListener('scroll', highlightNav);
highlightNav();

/* ===== Scroll Reveal ===== */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

/* ===== Contact Form ===== */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn__text');
const btnLoader = submitBtn.querySelector('.btn__loader');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    formStatus.textContent = 'Please fill in all fields.';
    formStatus.className = 'form-status error';
    return;
  }

  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoader.hidden = false;
  formStatus.textContent = '';
  formStatus.className = 'form-status';

  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });

    if (response.ok) {
      formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
      formStatus.className = 'form-status success';
      contactForm.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to send message.');
    }
  } catch (err) {
    formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
    formStatus.className = 'form-status error';
  } finally {
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnLoader.hidden = true;
  }
});
