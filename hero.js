/* Dastchin Hero — rebuilt from scratch */
(() => {
  const root = document.querySelector('.hero-section');
  if (!root) return;

  const viewport = root.querySelector('.hero-viewport');
  const track = root.querySelector('.hero-track');
  const slides = [...root.querySelectorAll('.hero-slide')];
  const dots = [...root.querySelectorAll('.hero-dot')];
  const prev = root.querySelector('[data-hero-prev]');
  const next = root.querySelector('[data-hero-next]');
  const progress = root.querySelector('.hero-progress span');
  const delay = 5000;
  let index = 0;
  let timer = null;
  let touchStartX = 0;
  let touchStartY = 0;

  const render = (nextIndex, animate = true) => {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translate3d(-${index * 100}%,0,0)`;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
    root.classList.remove('is-playing');
    void root.offsetWidth;
    root.classList.add('is-playing');
    if (progress) progress.style.animation = 'none';
    if (progress) {
      void progress.offsetWidth;
      progress.style.animation = '';
    }
  };

  const stop = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const start = () => {
    stop();
    timer = setTimeout(() => {
      render(index + 1);
      start();
    }, delay);
  };

  const restart = () => { render(index); start(); };

  prev?.addEventListener('click', () => { render(index - 1); start(); });
  next?.addEventListener('click', () => { render(index + 1); start(); });
  dots.forEach(dot => dot.addEventListener('click', () => {
    render(Number(dot.dataset.slide));
    start();
  }));

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', e => {
    if (!root.contains(e.relatedTarget)) start();
  });

  viewport?.addEventListener('touchstart', e => {
    const touch = e.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    stop();
  }, { passive: true });

  viewport?.addEventListener('touchend', e => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      render(index + (dx < 0 ? 1 : -1));
    }
    start();
  }, { passive: true });

  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); render(index - 1); restart(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); render(index + 1); restart(); }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  render(0, false);
  start();
})();
