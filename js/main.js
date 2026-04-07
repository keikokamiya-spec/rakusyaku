/* =============================================
   Scroll Reveal + Slider + Mobile Nav + Header
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll Reveal ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Header scroll state ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── Mobile Navigation ── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      if (open) {
        mobileNav.style.display = 'flex';
        requestAnimationFrame(() => mobileNav.classList.add('open'));
        document.body.style.overflow = 'hidden';
      } else {
        mobileNav.classList.remove('open');
        setTimeout(() => { mobileNav.style.display = 'none'; }, 400);
        document.body.style.overflow = '';
      }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        setTimeout(() => { mobileNav.style.display = 'none'; }, 400);
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Slider ── */
  const track = document.getElementById('slider-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (track) {
    let currentX = 0;
    let startX = 0;
    let isDragging = false;
    let startTranslate = 0;

    const getMaxScroll = () => {
      const items = track.querySelectorAll('.slide-item');
      if (!items.length) return 0;
      const itemW = items[0].offsetWidth + 16; // gap
      return -Math.max(0, (items.length - Math.floor(track.parentElement.offsetWidth / itemW)) * itemW);
    };

    const clampX = (x) => Math.max(getMaxScroll(), Math.min(0, x));

    const setX = (x) => {
      currentX = clampX(x);
      track.style.transform = `translateX(${currentX}px)`;
    };

    const slideBy = (dir) => {
      const items = track.querySelectorAll('.slide-item');
      const step = items.length ? items[0].offsetWidth + 16 : 320;
      setX(currentX + dir * -step);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => slideBy(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => slideBy(1));

    // Drag/touch
    const onDragStart = (clientX) => {
      isDragging = true;
      startX = clientX;
      startTranslate = currentX;
      track.style.transition = 'none';
    };
    const onDragMove = (clientX) => {
      if (!isDragging) return;
      setX(startTranslate + (clientX - startX));
    };
    const onDragEnd = () => {
      isDragging = false;
      track.style.transition = '';
    };

    track.addEventListener('mousedown', e => onDragStart(e.clientX));
    window.addEventListener('mousemove', e => onDragMove(e.clientX));
    window.addEventListener('mouseup', onDragEnd);

    track.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchmove', e => onDragMove(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchend', onDragEnd);
  }

  /* ── Smooth anchor for all hash links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

});
