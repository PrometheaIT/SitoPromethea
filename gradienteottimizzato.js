document.addEventListener('DOMContentLoaded', () => {
    const interactiveBlob = document.querySelector('.blob-interactive');
    let targetX = 0, targetY = 0;
    let rafId = null;
    let isTouching = false;

    function updateBlobPosition() {
        interactiveBlob.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        rafId = requestAnimationFrame(updateBlobPosition);
    }

    function handleMove(x, y) {
        if (!rafId) rafId = requestAnimationFrame(updateBlobPosition);
        targetX = (x - window.innerWidth/2) * 0.5;
        targetY = (y - window.innerHeight/2) * 0.5;
    }

    // Mouse events
    window.addEventListener('mousemove', (e) => {
        handleMove(e.clientX, e.clientY);
    });

    // Touch events
    window.addEventListener('touchstart', (e) => {
        isTouching = true;
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault(); // Previene lo scroll
    });

    window.addEventListener('touchmove', (e) => {
        if (isTouching) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
            e.preventDefault(); // Previene lo scroll
        }
    });

    window.addEventListener('touchend', () => {
        isTouching = false;
        cancelAnimationFrame(rafId);
        rafId = null;
    });

    // Cleanup events
    window.addEventListener('blur', () => {
        cancelAnimationFrame(rafId);
        rafId = null;
    });

    window.addEventListener('touchcancel', () => {
        isTouching = false;
        cancelAnimationFrame(rafId);
        rafId = null;
    });
});