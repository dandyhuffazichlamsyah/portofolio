/* =============================================
   DANDY HUFFAZ — UBSI PORTFOLIO — script.js
   ============================================= */

/* === SCROLL PROGRESS BAR === */
function updateScrollProgress() {
  const el = document.getElementById('scroll-progress');
  if (!el) return;
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
  el.style.width = pct + '%';
}

/* === NAVBAR SCROLL === */
function updateNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

/* === ACTIVE NAV LINK === */
function updateActiveNav() {
  const sections = ['tentang', 'akademik', 'pengalaman', 'proyek', 'sertifikasi', 'prestasi', 'penelitian', 'keahlian', 'kontak'];
  const scrollPos = window.scrollY + 120;
  let active = '';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollPos) active = id;
  });

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + active) l.classList.add('active');
  });
}

/* === HAMBURGER MENU === */
function initHamburger() {
  const btn = document.getElementById('hamburger-btn');
  const links = document.getElementById('nav-links-list');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* === TYPEWRITER === */
function initTypewriter() {
  const el = document.getElementById('hero-tw');
  if (!el) return;

  const texts = [
    'Digital Administrative Specialist',
    'Generative AI & Web/Mobile Developer',
    'Generative AI & Data Engineer'
  ];

  let i = 0, charIdx = 0, deleting = false;
  const speed = { type: 60, delete: 30, pause: 2000 };

  function type() {
    const current = texts[i];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, speed.pause);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        i = (i + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? speed.delete : speed.type);
  }

  setTimeout(type, 800);
}

/* === COUNTER ANIMATION === */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* === SKILL BAR ANIMATION === */
function animateSkillBars(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.sk-fill');
      fills.forEach(fill => {
        const pct = fill.style.getPropertyValue('--p');
        setTimeout(() => { fill.style.width = pct; }, 100);
      });
    }
  });
}

/* === INTERSECTION OBSERVER === */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Counter animation for hero stats
        const nums = entry.target.querySelectorAll('.hs-num[data-target]');
        nums.forEach(n => animateCounter(n));

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Skill bars observer
  const skillObs = new IntersectionObserver(animateSkillBars, { threshold: 0.3 });
  const skillSection = document.getElementById('keahlian');
  if (skillSection) skillObs.observe(skillSection);

  // Also trigger counter for hero stats immediately visible
  const heroStats = document.querySelectorAll('.hs-num[data-target]');
  const heroObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.hs-num[data-target]');
        nums.forEach(n => animateCounter(n));
        heroObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const statsRow = document.querySelector('.hero-stats-row');
  if (statsRow) heroObs.observe(statsRow);
}

/* === SMOOTH SCROLL === */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* === CONTACT FORM === */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  const ok = document.getElementById('form-ok');
  const form = document.getElementById('contact-form');

  if (btn) {
    btn.textContent = 'Mengirim...';
    btn.disabled = true;
  }

  setTimeout(() => {
    if (form) form.reset();
    if (btn) { btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Kirim Pesan'; btn.disabled = false; }
    if (ok) { ok.style.display = 'flex'; setTimeout(() => { ok.style.display = 'none'; }, 5000); }
  }, 1200);
}

/* === CARD 3D TILT (hero card) === */
function initCardTilt() {
  const card = document.getElementById('hero-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
}

/* === CERTIFICATE POPUP MODAL === */
function initCertModal() {
  const modal = document.getElementById('cert-modal');
  const closeBtn = document.getElementById('modal-close');
  const viewerArea = document.getElementById('cert-viewer-area');

  if (!modal || !closeBtn || !viewerArea) return;

  // Simpan template bawaan sertifikat mock
  const defaultTemplate = viewerArea.innerHTML;

  // Open modal when card is clicked
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const file = card.dataset.file || '';
      const title = card.dataset.title || '';

      if (file) {
        // Jika ada file terlampir, render iframe atau img
        const fileExt = file.split('.').pop().toLowerCase();
        if (fileExt === 'pdf') {
          viewerArea.innerHTML = `<iframe src="${file}" width="100%" height="550px" style="border: none; border-radius: 8px; background: #f8fafc;"></iframe>`;
        } else if (['png', 'jpg', 'jpeg', 'webp'].includes(fileExt)) {
          viewerArea.innerHTML = `<div style="text-align: center; overflow: auto; max-height: 550px;"><img src="${file}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: var(--shadow-md);" /></div>`;
        } else {
          // Format tidak dikenal, berikan link download langsung
          viewerArea.innerHTML = `
            <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
              <p style="margin-bottom: 16px;">Format file tidak didukung secara langsung di dalam web.</p>
              <a href="${file}" target="_blank" class="btn-primary" style="display: inline-flex; text-decoration: none;">Buka Berkas Sertifikat</a>
            </div>`;
        }
      } else {
        // Jika tidak ada file terlampir, kembalikan ke layout sertifikat mock dinamis
        viewerArea.innerHTML = defaultTemplate;

        const modalTitle = document.getElementById('modal-cert-title');
        const modalIssuer = document.getElementById('modal-cert-issuer');
        const modalDate = document.getElementById('modal-cert-date');
        const modalDesc = document.getElementById('modal-cert-desc');
        const modalVerify = document.getElementById('modal-cert-verify-id');

        const issuer = card.dataset.issuer || '';
        const date = card.dataset.date || '';
        const desc = card.dataset.desc || '';
        const verify = card.dataset.verify || '';

        if (modalTitle) modalTitle.textContent = title;
        if (modalIssuer) modalIssuer.textContent = issuer;
        if (modalDate) modalDate.textContent = date;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalVerify) modalVerify.textContent = `ID Verifikasi: ${verify.toUpperCase()}`;
      }

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // prevent scroll
    });
  });

  // Close function
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // enable scroll
    // Hentikan/bersihkan konten modal untuk menghentikan loading PDF/video di latar belakang saat ditutup
    setTimeout(() => {
      viewerArea.innerHTML = '';
    }, 300);
  }

  closeBtn.addEventListener('click', closeModal);

  // Close when clicking overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* === INIT === */
document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initTypewriter();
  initReveal();
  initSmoothScroll();
  initCardTilt();
  initCertModal();

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateNavbar();
    updateActiveNav();
  }, { passive: true });

  updateScrollProgress();
  updateNavbar();
  updateActiveNav();
});
