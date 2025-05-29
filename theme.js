document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');
    const root = document.documentElement;
    const themeImages = document.querySelectorAll('[data-theme-light], [data-theme-dark]');

    // Funzione per aggiornare le immagini
    function updateThemeImages(theme) {
        themeImages.forEach(img => {
            img.src = theme === 'dark-theme' 
                ? img.dataset.themeDark 
                : img.dataset.themeLight;
        });
    }

    // Funzione per impostare le variabili
    function setScrollbarVars(theme) {
        if(theme === 'dark-theme') {
            root.style.setProperty('--scrollbar-thumb', '#9F1893');
            root.style.setProperty('--scrollbar-track', '#0F0F0F');
        } else {
            root.style.setProperty('--scrollbar-thumb', '#EF0095');
            root.style.setProperty('--scrollbar-track', '#FFFAF7');
        }
    }

    // Imposta il tema iniziale
    if (currentTheme) {
        document.body.className = currentTheme;
        toggleSwitch.checked = currentTheme === 'dark-theme';
        setScrollbarVars(currentTheme);
        updateThemeImages(currentTheme); // Aggiorna immagini al caricamento
    }

    // Gestione cambio tema
    toggleSwitch.addEventListener('change', function(e) {
        const theme = e.target.checked ? 'dark-theme' : 'light-theme';
        document.body.className = theme;
        localStorage.setItem('theme', theme);
        setScrollbarVars(theme);
        updateThemeImages(theme); // Aggiorna immagini al cambio tema
    });

    // Aggiornamento iniziale per il tema di sistema
    if(!currentTheme) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? 'dark-theme' 
            : 'light-theme';
        updateThemeImages(systemTheme);
    }
});