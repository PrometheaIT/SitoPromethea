document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.final-logo');
    const cards = document.querySelectorAll('.cardhome');
    let rafId = null;
    let lastState = false;
    let scrollDelta = 0;
    let lastScrollY = window.scrollY;
    const SCROLL_THRESHOLD = 200; // Soglia ridotta per comparire prima
    const MAX_SCROLL_COUNT = 30;   // Scroll necessari per nascondere

    // Ottimizzazione performance con debounce
    function debounce(func, wait = 16) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function getCardsState() {
        return Array.from(cards).every(card => {
            const opacity = parseFloat(getComputedStyle(card).opacity);
            return opacity <= 0.1; // Considera anche opacità molto basse
        });
    }

    function handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        const delta = Math.abs(currentScrollY - lastScrollY);
        
        if(getCardsState()) {
            if(scrollDirection === 'down') {
                scrollDelta = Math.min(scrollDelta + delta, SCROLL_THRESHOLD * MAX_SCROLL_COUNT);
            } else {
                scrollDelta = Math.max(scrollDelta - delta * 3, 0); // Più reattivo allo scroll up
            }
        }
        
        lastScrollY = currentScrollY;
    }

    function updateLogoState() {
        const cardsHidden = getCardsState();
        const shouldShow = cardsHidden && (scrollDelta < SCROLL_THRESHOLD);

        if(shouldShow !== lastState) {
            lastState = shouldShow;
            
            if(shouldShow) {
                logo.style.display = 'flex';
                anime({
                    targets: logo,
                    opacity: [0, 1],
                    scale: [0.9, 1],
                    filter: ['blur(10px)', 'blur(0px)'],
                    duration: 300,
                    easing: 'cubicBezier(0.33, 1, 0.68, 1)',
                    begin: () => {
                        logo.style.willChange = 'transform, opacity, filter';
                    }
                });
            } else {
                anime({
                    targets: logo,
                    opacity: [1, 0],
                    scale: [1, 0.95],
                    filter: ['blur(0px)', 'blur(15px)'],
                    duration: 400,
                    easing: 'cubicBezier(0.33, 1, 0.68, 1)',
                    complete: () => {
                        logo.style.display = 'none';
                        logo.style.willChange = 'auto';
                    }
                });
            }
        }
        
        rafId = requestAnimationFrame(updateLogoState);
    }

    // Gestione eventi ottimizzata
    const optimizedScrollHandler = debounce(handleScroll);
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

    // Reset a scroll completato
    window.addEventListener('scroll', () => {
        if(window.scrollY < 50) scrollDelta = 0;
    }, { passive: true });

    // Avvia il monitoraggio
    updateLogoState();

    // Cleanup
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('scroll', optimizedScrollHandler);
    });
});