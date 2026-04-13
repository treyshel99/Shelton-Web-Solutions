/* ═══════════════════════════════════════════════════
   NAVBAR — scroll state + mobile drawer
═══════════════════════════════════════════════════ */
const nav       = document.getElementById('nav');
const hambBtn   = document.getElementById('hambBtn');
const drawer    = document.getElementById('drawer');
const drawerClose = document.getElementById('drawerClose');

// Sticky nav style on scroll
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Open drawer
hambBtn.addEventListener('click', () => {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
});

// Close drawer
function closeDrawer() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
drawerClose.addEventListener('click', closeDrawer);

// Close drawer when a link is clicked
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));


/* ═══════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


/* ═══════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name  = contactForm.querySelector('#name').value.trim();
  const email = contactForm.querySelector('#email').value.trim();

  if (!name || !email) {
    const firstEmpty = !name
      ? contactForm.querySelector('#name')
      : contactForm.querySelector('#email');
    firstEmpty.focus();
    firstEmpty.style.borderColor = '#ef4444';
    setTimeout(() => firstEmpty.style.borderColor = '', 2000);
    return;
  }

  // Show success state
  contactForm.innerHTML = `
    <div class="form-success">
      <div class="check">✓</div>
      <h3>Message Sent!</h3>
      <p>Thanks, ${name}! We'll be in touch within 24 hours.</p>
    </div>
  `;
});


/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL (for older browsers)
═══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
