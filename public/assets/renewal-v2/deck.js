(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const indicator = document.getElementById('slideIndicator');
  const select = document.getElementById('slide-select');
  const previous = document.getElementById('prev');
  const next = document.getElementById('next');
  let current = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function update(index) {
    current = index;
    indicator.textContent = `${index + 1} / ${slides.length}`;
    select.value = String(index + 1);
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
  }
  function go(index) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    update(target);
    slides[target].scrollIntoView({behavior: reduced.matches ? 'auto' : 'smooth', block:'start'});
    history.replaceState(null, '', `#slide-${target + 1}`);
  }
  previous.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  select.addEventListener('change', () => go(Number(select.value) - 1));
  document.getElementById('print').addEventListener('click', () => window.print());
  document.addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select,button,a,[contenteditable]')) return;
    if (['ArrowRight','PageDown'].includes(e.key)) {e.preventDefault();go(current + 1);}
    if (['ArrowLeft','PageUp'].includes(e.key)) {e.preventDefault();go(current - 1);}
    if(e.key==='Home'){e.preventDefault();go(0);}
    if(e.key==='End'){e.preventDefault();go(slides.length-1);}
  });
  let scheduled = false;
  addEventListener('scroll', () => {
    if(scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      const top = document.querySelector('.deck-nav').getBoundingClientRect().bottom + 35;
      let index = 0;
      slides.forEach((slide, i) => { if(slide.getBoundingClientRect().top <= top) index = i; });
      update(index); scheduled = false;
    });
  }, {passive:true});
  const initial = /^#slide-(\d+)$/.exec(location.hash);
  update(initial ? Math.max(0,Math.min(slides.length-1,Number(initial[1])-1)) : 0);
})();
