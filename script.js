import { buildResponsePayload, getVariantConfig } from './src/name-test.js';

const form = document.querySelector('#name-test-form');
const status = document.querySelector('#form-status');
const submitButton = form?.querySelector('button[type="submit"]');
const params = new URLSearchParams(window.location.search);
const variantConfig = getVariantConfig(params.get('variant'));

function applyVariant(config) {
  document.title = `${config.name} — Voice-first fokusapp`;
  document.querySelectorAll('[data-variant-field]').forEach((element) => {
    const field = element.dataset.variantField;
    if (field && config[field]) element.textContent = config[field];
  });
  document.querySelectorAll('[data-variant-input="favorite"]').forEach((element) => {
    element.value = config.name;
  });
  document.querySelectorAll('.name-card').forEach((card) => {
    const url = new URL(card.href, window.location.href);
    const cardVariant = getVariantConfig(url.searchParams.get('variant'));
    if (cardVariant.id === config.id) card.setAttribute('aria-current', 'true');
  });
}

function getMetadata() {
  return {
    variant: variantConfig.id,
    variantName: variantConfig.name,
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

applyVariant(variantConfig);

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(form).entries());
  const data = buildResponsePayload(formData, getMetadata());
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
    applyVariant(variantConfig);
  } catch (error) {
    console.error('Kunne ikke sende inn svar', error);
    if (status) {
      status.textContent = `Svaret ble lagret lokalt i nettleseren, men ikke sendt inn. Prøv igjen senere. Lokale svar her: ${localCount}`;
    }
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});
