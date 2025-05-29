document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarShowToggle = document.querySelector('.sidebar-show-toggle');
    const content = document.querySelector('.content');

    sidebar.classList.add('closed');

    let isDragging = false;
    let posX = 0, posY = 0;
    let startX = 0, startY = 0;
    const dragThreshold = 10;
    let isMobileDevice = false;

// LA SIDEBAR SI CHIUDE CLICCANDO FUORI
    function handleClickOutside(e) {
        if (isDragging) return; // Ignora i click durante il drag
        if (!sidebar.classList.contains('closed') && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.sidebar-show-toggle')) {
            sidebar.classList.add('closed');
            updateShowToggle();
        }
    }
    document.addEventListener('click', handleClickOutside);



    // Funzione di salvataggio migliorata
    function savePosition() {
        const rect = sidebarShowToggle.getBoundingClientRect();
        
        // Usa direttamente le coordinate relative alla viewport
        posX = rect.left;
        posY = rect.top;
        
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        
        posX = Math.min(Math.max(0, posX), maxX);
        posY = Math.min(Math.max(0, posY), maxY);
        
        localStorage.setItem('togglePosition', JSON.stringify({ x: posX, y: posY }));
    }
    // Inizializzazione posizione
    function initPosition() {
        isMobileDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        const saved = localStorage.getItem('togglePosition');
        
        if(saved) {
            try {
                const {x, y} = JSON.parse(saved);
                const maxX = window.innerWidth - sidebarShowToggle.offsetWidth;
                const maxY = window.innerHeight - sidebarShowToggle.offsetHeight;
                
                posX = Math.min(Math.max(0, x), maxX);
                posY = Math.min(Math.max(0, y), maxY);
                console.log('Position loaded:', posX, posY); // Debug
            } catch(e) {
                console.error('Error loading position:', e);
                setDefaultPosition();
            }
        } else {
            setDefaultPosition();
        }
        
        applyPosition();
    }

    function setDefaultPosition() {
        
        posX = isMobileDevice ? window.innerWidth - 60 : 20;
        posY = isMobileDevice ? window.innerHeight - 60 : 20;
        console.log('Default position:', posX, posY); // Debug
    }

    function applyPosition() {
        sidebarShowToggle.style.setProperty('--pos-x', `${posX}px`);
        sidebarShowToggle.style.setProperty('--pos-y', `${posY}px`);
        console.log('Position applied:', posX, posY); // Debug
    }

    function handleMove(e) {
        if (!isDragging) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
            posX += deltaX;
            posY += deltaY;

            const maxX = window.innerWidth - sidebarShowToggle.offsetWidth;
            const maxY = window.innerHeight - sidebarShowToggle.offsetHeight;
            
            posX = Math.min(Math.max(0, posX), maxX);
            posY = Math.min(Math.max(0, posY), maxY);

            applyPosition();
            startX = clientX;
            startY = clientY;
        }
    }

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        const rect = sidebarShowToggle.getBoundingClientRect();
        posX = rect.left;
        posY = rect.top;
        
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        
        sidebarShowToggle.style.transition = 'none';
        document.body.classList.add('sidebar-dragging');
    }

    function endDrag(e) {
        if (isDragging) {
            savePosition();
            
            // Gestione migliorata per touch/mobile
            let endX, endY;
            if (e.changedTouches) {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
            } else {
                endX = e.clientX;
                endY = e.clientY;
            }
    
            // Calcola il delta corretto per mobile/desktop
            const deltaX = Math.abs(endX - startX);
            const deltaY = Math.abs(endY - startY);
    
            // Se il movimento è minimo, considera come click
            if (deltaX < dragThreshold && deltaY < dragThreshold) {
                sidebar.classList.toggle('closed');
                updateShowToggle();
            }
        }
        
        isDragging = false;
        sidebarShowToggle.style.transition = '';
        document.body.classList.remove('sidebar-dragging');
    }

    


sidebarShowToggle.addEventListener('click', (e) => {
    e.stopPropagation(); 
});

// Posiziona l'event listener QUI:






    function updateShowToggle() {
        const isClosed = sidebar.classList.contains('closed');
        content.classList.toggle('full-width', isClosed);
        
        sidebarShowToggle.style.display = isMobileDevice ? (isClosed ? 'flex' : 'none') : 'flex';
        document.body.style.overflow = isMobileDevice ? (isClosed ? '' : 'hidden') : '';
        
        requestAnimationFrame(() => applyPosition());
    }

    if(sidebarShowToggle) {
        initPosition();
        
        // Event listeners
        sidebarShowToggle.addEventListener('mousedown', startDrag);
        sidebarShowToggle.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        document.addEventListener('mouseleave', endDrag);

        window.addEventListener('resize', () => {
            const newIsMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
            if(newIsMobile !== isMobileDevice) {
                isMobileDevice = newIsMobile;
                initPosition();
            }
            savePosition();
        });
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.add('closed');
            updateShowToggle();
        });
    }

    
    

    updateShowToggle();
});

// sidebar-toggle.js
document.addEventListener('DOMContentLoaded', () => {
  const servizi = document.getElementById('servizi-menu');

  servizi.addEventListener('click', () => {
    servizi.classList.toggle('open');
  });
});
