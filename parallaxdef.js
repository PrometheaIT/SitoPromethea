document.addEventListener('DOMContentLoaded', () => {
  const sections = Array.from(document.querySelectorAll('.scroll-section'));
  const cards    = Array.from(document.querySelectorAll('.cardhome'));
  const offsetY  = 30;
  const screenTh = 0.3;
  const threshold = 1;  // al 100% progress

  // traccia lo stato (visibile/nascosta) di ogni card
  const state = cards.map(() => ({ hidden: false }));

  // progress da 0 a 1
  function getProgress(sec) {
    const scrollY = window.pageYOffset;
    const vh      = window.innerHeight;
    const top     = sec.offsetTop;
    const start   = top - vh*(1 - screenTh);
    const end     = top + vh*screenTh;
    return Math.min(1, Math.max(0, (scrollY - start)/(end - start)));
  }

  // parallax originale
  function updateParallax() {
    cards.forEach((card, i) => {
      const p = getProgress(sections[i]);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const x  = vw/2;
      const y  = vh/2 + i*offsetY;
      const scale = 1 - 0.05*Math.pow(p,0.8);

      card.style.position  = p>=1 ? 'fixed' : 'absolute';
      card.style.left      = `${x}px`;
      card.style.top       = `${y}px`;
      card.style.transform = `translate(-50%,-50%) scale(${scale})`;
      card.style.zIndex    = `${10 - i}`;
      sections[i].classList.toggle('active', p > 0);
    });
  }

  // dissolvenza + blur out
  function hideCard(i) {
    state[i].hidden = true;
    anime({
      targets: cards[i],
      opacity: 0,
      scale: 0.8,
      filter: ['blur(0px)', 'blur(6px)'],
      duration: 600,
      easing: 'easeOutQuad'
    });
  }

  // dissolvenza + blur in
  function showCard(i) {
    state[i].hidden = false;
    anime({
      targets: cards[i],
      opacity: 1,
      scale: 1,
      filter: ['blur(6px)', 'blur(0px)'],
      duration: 400,
      easing: 'easeInQuad'
    });
  }

  // loop su scroll/resize
  function onScroll() {
    updateParallax();
    cards.forEach((card, i) => {
      const p = getProgress(sections[i]);
      if (!state[i].hidden && p >= threshold) {
        hideCard(i);
      }
      if ( state[i].hidden && p < threshold) {
        showCard(i);
      }
    });
  }

  window.addEventListener('scroll',  onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // init
  cards.forEach(c => {
    c.style.opacity = 1;
    c.style.filter  = 'blur(0px)';
    c.style.transformOrigin = 'center center';
  });
  updateParallax();
});
