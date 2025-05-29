// Controlla la query string e seleziona la custom-select
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service');
  if (!serviceParam) return;

  // trova l'elemento custom-select
  const customSelect = document.querySelector('.custom-select');
  const selectedBtn = customSelect.querySelector('.selected');
  const hiddenInput = customSelect.querySelector('input[name="service"]');
  const options = [...customSelect.querySelectorAll('.options li')];

  // trova l'opzione con data-value uguale al parametro
  const match = options.find(li => li.dataset.value === serviceParam);
  if (match) {
    // imposta il testo del button e il valore dell'input nascosto
    selectedBtn.textContent = match.textContent;
    hiddenInput.value = serviceParam;

    // (opzionale) aggiunge classe "open" o "active" se ne hai una
    customSelect.classList.add('has-selection');
  }
});
