const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const bookingForm = document.getElementById('bookingForm');
const formStatus = document.getElementById('formStatus');
const year = document.getElementById('year');
const header = document.getElementById('siteHeader');
const equipmentField = document.getElementById('equipmentField');

const WHATSAPP_NUMBER = '2348038090208';

year.textContent = new Date().getFullYear();

const setMenuOpen = (open) => {
  navLinks.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
};

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

// Elevate the floating header after scrolling.
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Click-to-book: tapping equipment adds it to the form and jumps to booking
document.querySelectorAll('[data-item]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.getAttribute('data-item');
    if (!equipmentField) return;
    const current = equipmentField.value.trim();
    if (!current.toLowerCase().includes(item.toLowerCase())) {
      equipmentField.value = current ? `${current}, ${item}` : item;
    }
    formStatus.textContent = `Added "${item}" — complete the form to book.`;
    formStatus.className = 'form-status success';
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach((el) => observer.observe(el));

// Animated counters (kept for any data-count elements)
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const val = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = val.toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach((c) => counterObserver.observe(c));

// Minimum event date = today
const eventDate = document.getElementById('eventDate');
if (eventDate) {
  eventDate.min = new Date().toISOString().split('T')[0];
}

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  formStatus.replaceChildren();
  formStatus.className = 'form-status';

  const formData = new FormData(bookingForm);
  const value = (name) => String(formData.get(name) || '').trim();
  const message = [
    'Hello BUTOTAM Rentals Services, I would like to book event equipment.',
    '',
    `Name: ${value('name')}`,
    `Phone: ${value('phone')}`,
    `Email: ${value('email') || 'Not provided'}`,
    `Event type: ${value('eventType')}`,
    `Event date: ${value('eventDate')}`,
    `Guest count: ${value('guestCount') || 'Not provided'}`,
    `Delivery/setup: ${value('delivery') || 'Not specified'}`,
    `Equipment needed: ${value('equipment')}`,
    `Event location: ${value('location')}`,
    `Additional message: ${value('message') || 'None'}`
  ].join('\n');

  const link = document.createElement('a');
  link.className = 'whatsapp-recipient-link';
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Continue to WhatsApp';

  formStatus.classList.add('success');
  formStatus.append(
  );

  const recipientLinks = document.createElement('div');
  recipientLinks.className = 'whatsapp-recipient-links';
  recipientLinks.append(link);
  formStatus.append(recipientLinks);

  const whatsappWindow = window.open(link.href, '_blank');
  if (whatsappWindow) {
    whatsappWindow.opener = null;
  }
});
