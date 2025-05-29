document.querySelectorAll('.custom-select').forEach(sel => {
  const btn       = sel.querySelector('.selected');
  const list      = sel.querySelector('.options');
  const hiddenInp = sel.querySelector('input[type="hidden"]');
  
  btn.addEventListener('click', () => {
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
  });
  
  list.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      btn.textContent       = li.textContent;
      hiddenInp.value       = li.dataset.value;
      list.style.display    = 'none';
    });
  });
  
  // chiudi fuori clic
  document.addEventListener('click', e => {
    if (!sel.contains(e.target)) list.style.display = 'none';
  });
});
