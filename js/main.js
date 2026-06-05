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

  /* ── Course horizontal slider ── */
  const courseSlider = document.getElementById('course-slider');
  const coursePrev = document.querySelector('.course-slide-btn--prev');
  const courseNext = document.querySelector('.course-slide-btn--next');
  const courseCount = document.getElementById('course-slide-count');

  if (courseSlider) {
    const courseCards = Array.from(courseSlider.querySelectorAll('.course-card'));
    const currentCount = courseCount?.querySelector('.course-slide-count-current');
    const totalCount = courseCount?.querySelector('.course-slide-count-total');
    let courseTicking = false;

    if (totalCount) totalCount.textContent = String(courseCards.length);

    const updateCourseCount = () => {
      if (!currentCount || !courseCards.length) return;

      const activeIndex = courseCards.reduce((closestIndex, card, index) => {
        const currentCardLeft = courseCards[closestIndex].offsetLeft - courseSlider.offsetLeft;
        const cardLeft = card.offsetLeft - courseSlider.offsetLeft;
        return Math.abs(cardLeft - courseSlider.scrollLeft) < Math.abs(currentCardLeft - courseSlider.scrollLeft)
          ? index
          : closestIndex;
      }, 0);

      currentCount.textContent = String(activeIndex + 1);
    };

    const requestCourseCountUpdate = () => {
      if (courseTicking) return;
      courseTicking = true;
      requestAnimationFrame(() => {
        updateCourseCount();
        courseTicking = false;
      });
    };

    const scrollCourse = (direction) => {
      const card = courseSlider.querySelector('.course-card');
      const gap = 16;
      const amount = card ? card.offsetWidth + gap : courseSlider.clientWidth * 0.8;
      courseSlider.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };

    if (coursePrev) coursePrev.addEventListener('click', () => scrollCourse(-1));
    if (courseNext) courseNext.addEventListener('click', () => scrollCourse(1));
    courseSlider.addEventListener('scroll', requestCourseCountUpdate, { passive: true });
    window.addEventListener('resize', requestCourseCountUpdate);
    updateCourseCount();
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
