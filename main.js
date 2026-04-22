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
   CONTACT FORM — Netlify Forms via fetch (no page reload)
═══════════════════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name  = contactForm.querySelector('#name').value.trim();
  const email = contactForm.querySelector('#email').value.trim();

  // Client-side validation
  if (!name || !email) {
    const firstEmpty = !name
      ? contactForm.querySelector('#name')
      : contactForm.querySelector('#email');
    firstEmpty.focus();
    firstEmpty.style.borderColor = '#ef4444';
    setTimeout(() => firstEmpty.style.borderColor = '', 2500);
    return;
  }

  // Gather all form data
  const formData = new FormData(contactForm);
  const data     = Object.fromEntries(formData.entries());

  // Disable button while submitting
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled   = true;
  submitBtn.textContent = 'Sending…';

  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', ...data }),
    });

    // Show success state
    contactForm.innerHTML = `
      <div class="form-success">
        <div class="check">✓</div>
        <h3>Message Sent!</h3>
        <p>Thanks, ${name}! We'll be in touch within 24 hours.</p>
      </div>
    `;
  } catch (err) {
    // If something goes wrong, restore the button
    submitBtn.disabled   = false;
    submitBtn.textContent = 'Send Message →';
    alert('Something went wrong. Please try again or email us directly at trey@sheltonwebsolutions.com');
  }
});


/* ═══════════════════════════════════════════════════
   MOBILE STICKY CTA BAR — show after scrolling past hero
═══════════════════════════════════════════════════ */
const mobileCta  = document.getElementById('mobileCta');
const heroSection = document.getElementById('hero');

if (mobileCta && heroSection) {
  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Show bar when hero is out of view
      mobileCta.classList.toggle('visible', !entry.isIntersecting);
      mobileCta.setAttribute('aria-hidden', entry.isIntersecting ? 'true' : 'false');
    });
  }, { threshold: 0 });
  ctaObserver.observe(heroSection);
}


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
