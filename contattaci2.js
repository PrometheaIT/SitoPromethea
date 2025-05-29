// Inizializza EmailJS
emailjs.init("g8PJB6ZiWexp4af2B"); // <-- Sostituisci con il tuo USER ID

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("my-form");
  const selectedButton = document.querySelector(".custom-select .selected");
  const options = document.querySelectorAll(".custom-select .options li");
  const hiddenInput = document.querySelector(".custom-select input[type='hidden']");
  const ul = document.querySelector(".custom-select .options");

  // Gestione selezione personalizzata
  selectedButton.addEventListener("click", function () {
    ul.classList.toggle("show");
  });

  options.forEach(option => {
    option.addEventListener("click", function () {
      const value = option.dataset.value;
      const label = option.textContent;
      hiddenInput.value = value;
      selectedButton.textContent = label;
      ul.classList.remove("show");
    });
  });

  // Chiudi menu se clicchi fuori
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".custom-select")) {
      ul.classList.remove("show");
    }
  });

  // Invio form con EmailJS
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Mostra un messaggio durante l'invio (facoltativo)
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    button.textContent = "Invio in corso...";

    emailjs.sendForm("service_hkg6sli", "template_chet0yc", form)
      .then(() => {
        alert("Messaggio inviato con successo! Ti risponderemo entro 24h lavorative.");
        form.reset();
        selectedButton.textContent = "Seleziona un servizio";
        button.disabled = false;
        button.textContent = "Invia richiesta";
      }, (error) => {
        console.error("Errore invio:", error);
        alert("Si è verificato un errore. Riprova più tardi.");
        button.disabled = false;
        button.textContent = "Invia richiesta";
      });
  });
});
