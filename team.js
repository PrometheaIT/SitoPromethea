// Team Section Background Hover Effect
document.addEventListener('DOMContentLoaded', function() {
    const teamSection = document.querySelector('.team-section');
    const teamMembers = document.querySelectorAll('.team-member');
    
    // Configurazione background
    const bgConfig = {
    };

    // Funzione per cambiare background
    function changeBackground(bgType) {
        teamSection.style.background = bgConfig[bgType];
    }

    // Aggiungi event listeners
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => changeBackground('hover'));
        member.addEventListener('mouseleave', () => changeBackground('original'));
    });
});