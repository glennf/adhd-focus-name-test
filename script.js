const form = document.querySelector('#name-test-form');
const status = document.querySelector('#form-status');
const nameCards = document.querySelectorAll('.name-card');
const select = form?.querySelector('select[name="favorite"]');

nameCards.forEach((card) => {
  card.addEventListener('click', () => {
    if (select) select.value = card.dataset.name;
    document.querySelector('#test')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const responses = JSON.parse(localStorage.getItem('name-test-responses') || '[]');
  responses.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem('name-test-responses', JSON.stringify(responses, null, 2));
  status.textContent = `Lagret lokalt. Antall testresponser i denne nettleseren: ${responses.length}`;
  form.reset();
});
