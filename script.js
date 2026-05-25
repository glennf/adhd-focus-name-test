const form = document.querySelector('#name-test-form');
const status = document.querySelector('#form-status');
const submitButton = form?.querySelector('button[type="submit"]');
const nameCards = document.querySelectorAll('.name-card');
const select = form?.querySelector('select[name="favorite"]');
const params = new URLSearchParams(window.location.search);

function getMetadata() {
  return {
    variant: params.get('variant') || '',
    pageUrl: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${window.screen.width}x${window.screen.height}`,
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
  };
}

function saveLocalBackup(data) {
  const responses = JSON.parse(localStorage.getItem('name-test-responses') || '[]');
  responses.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem('name-test-responses', JSON.stringify(responses, null, 2));
  return responses.length;
}

nameCards.forEach((card) => {
  card.addEventListener('click', () => {
    if (select) select.value = card.dataset.name;
    document.querySelector('#test')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = { ...Object.fromEntries(new FormData(form).entries()), ...getMetadata() };
  const localCount = saveLocalBackup(data);

  if (status) status.textContent = 'Lagrer svar …';
  if (submitButton) submitButton.disabled = true;

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    if (status) status.textContent = 'Takk! Svaret er lagret.';
    form.reset();
  } catch (error) {
    console.error('Kunne ikke lagre til Google Sheets', error);
    if (status) {
      status.textContent = `Svaret ble lagret lokalt i nettleseren, men ikke sendt inn. Prøv igjen senere. Lokale svar her: ${localCount}`;
    }
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});
