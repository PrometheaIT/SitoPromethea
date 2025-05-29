document.addEventListener('DOMContentLoaded', () => {
    function initBounce() {
        const icon = document.getElementById('icon1');
        const footer = document.getElementById('footer');
        
        if(!icon || !footer) return;

        // Aggiungi stili per il contenimento
        footer.style.position = 'relative';
        footer.style.overflow = 'hidden'; // Contenimento fondamentale
        icon.style.position = 'absolute';
        icon.style.top = '0';
        icon.style.left = '0';

        const speed = 2;
        const iconRect = icon.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        
        // Calcola i limiti corretti considerando le dimensioni reali
        let posX = gsap.utils.random(0, footerRect.width - iconRect.width);
        let posY = gsap.utils.random(0, footerRect.height - iconRect.height);
        let dirX = gsap.utils.random(-speed, speed);
        let dirY = gsap.utils.random(-speed, speed);
        
        gsap.set(icon, { x: posX, y: posY });
        
        gsap.ticker.add(() => {
            const currentX = posX + dirX;
            const currentY = posY + dirY;
            
            // Controllo bordi con margine di sicurezza
            if(currentX <= 0 || currentX >= footerRect.width - iconRect.width) {
                dirX *= -1;
                posX = Math.max(0, Math.min(currentX, footerRect.width - iconRect.width));
            } else {
                posX = currentX;
            }
            
            if(currentY <= 0 || currentY >= footerRect.height - iconRect.height) {
                dirY *= -1;
                posY = Math.max(0, Math.min(currentY, footerRect.height - iconRect.height));
            } else {
                posY = currentY;
            }
            
            gsap.set(icon, {
                x: posX,
                y: posY,
                overwrite: "auto"
            });
        });
    }

    initBounce();
});