export const scoreLabels = [
  { value: '1', label: '1 · Svakt' },
  { value: '2', label: '2' },
  { value: '3', label: '3 · Nøytralt' },
  { value: '4', label: '4' },
  { value: '5', label: '5 · Sterkt' },
];

export const testVariantIds = ['hodero', 'tankerydd', 'hodefred', 'fokusflyt', 'klaresinn'];

export const variantConfigs = [
  {
    id: 'default',
    name: 'Navnetest',
    badge: 'Eksperiment 01 · ADHD/Fokus App',
    heroTitle: 'Hvilket navn får deg til å tenke: “den appen trenger jeg”?',
    lead: 'Vi tester navn på en voice-first fokusapp som lar deg snakke rotete, og får tilbake struktur, prioritet og neste minste steg.',
    tagline: 'Snakk rotet. Få planen.',
    description: 'En voice-first fokusapp som gjør tankekaos om til struktur, prioritering og neste minste steg.',
  },
  {
    id: 'hodero',
    name: 'HodeRo',
    badge: 'Navnevariant · HodeRo',
    heroTitle: 'HodeRo gjør rotete tanker om til neste steg.',
    lead: 'Snakk fritt når hodet er fullt. HodeRo rydder innholdet til oppgaver, prioritet og ett lite steg du kan starte med.',
    tagline: 'Snakk rotet. Få ro i hodet.',
    description: 'Et rolig navn for en app som gjør tankekaos lettere å se og starte på.',
  },
  {
    id: 'tankerydd',
    name: 'Tankerydd',
    badge: 'Navnevariant · Tankerydd',
    heroTitle: 'Tankerydd rydder tankekaoset ditt til en enkel plan.',
    lead: 'Les inn alt som surrer. Tankerydd sorterer det til oppgaver, bekymringer, ideer og neste minste handling.',
    tagline: 'Fra tankekaos til neste steg.',
    description: 'Et konkret navn for en app som sorterer rotete tanker til oppgaver og neste steg.',
  },
  {
    id: 'hodefred',
    name: 'Hodefred',
    badge: 'Navnevariant · Hodefred',
    heroTitle: 'Hodefred hjelper deg å få tankene ut av hodet.',
    lead: 'Når alt kjennes overveldende, kan du snakke det inn og få tilbake en roligere oversikt med prioritet og neste steg.',
    tagline: 'Få fred i hodet — ett steg av gangen.',
    description: 'Et lavterskel navn for en app som gir roligere oversikt når hodet er fullt.',
  },
  {
    id: 'fokusflyt',
    name: 'FokusFlyt',
    badge: 'Navnevariant · FokusFlyt',
    heroTitle: 'FokusFlyt gjør brain dumps om til fokusert fremdrift.',
    lead: 'Snakk inn rotete tanker, få dem strukturert og finn det mest realistiske neste steget akkurat nå.',
    tagline: 'Fra rot til fokusflyt.',
    description: 'Et produktivt navn for en app som gjør brain dumps om til strukturert fremdrift.',
  },
  {
    id: 'klaresinn',
    name: 'KlareSinn',
    badge: 'Navnevariant · KlareSinn',
    heroTitle: 'KlareSinn gjør tanker tydeligere når alt kjennes fullt.',
    lead: 'Bruk stemmen som innboks. KlareSinn organiserer det du sier til oversikt, prioritet og neste minste steg.',
    tagline: 'Tydeligere tanker. Enklere start.',
    description: 'Et klarhetsorientert navn for en app som organiserer det du sier til prioritet og neste steg.',
  },
];

const configById = new Map(variantConfigs.map((config) => [config.id, config]));
const nameToId = new Map(variantConfigs.map((config) => [config.name.toLowerCase(), config.id]));

export function getRandomVariantId(random = Math.random) {
  const index = Math.floor(random() * testVariantIds.length);
  return testVariantIds[Math.max(0, Math.min(index, testVariantIds.length - 1))];
}

export function getPublicVariantId(rawVariant, random = Math.random) {
  const normalized = normalizeVariant(rawVariant);
  return testVariantIds.includes(normalized) ? normalized : getRandomVariantId(random);
}

export function normalizeVariant(rawVariant) {
  return String(rawVariant || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9æøå]/g, '');
}

export function getVariantConfig(rawVariant) {
  const normalized = normalizeVariant(rawVariant);
  const id = nameToId.get(normalized) || normalized;
  return configById.get(id) || configById.get('default');
}

export function buildResponsePayload(formData, metadata) {
  const variantName = metadata.variantName || metadata.favorite || formData.favorite || '';
  return {
    favorite: formData.favorite || variantName,
    understanding: formData.understanding || '',
    feeling: formData.feeling || '',
    understanding_score: formData.understanding_score || '',
    trust_score: formData.trust_score || '',
    try_intent_score: formData.try_intent_score || '',
    overwhelm_score: formData.overwhelm_score || '',
    variant: metadata.variant || '',
    variantName,
    pageUrl: metadata.pageUrl || '',
    referrer: metadata.referrer || '',
    userAgent: metadata.userAgent || '',
    language: metadata.language || '',
    timezone: metadata.timezone || '',
    screen: metadata.screen || '',
    utm_source: metadata.utm_source || '',
    utm_medium: metadata.utm_medium || '',
    utm_campaign: metadata.utm_campaign || '',
  };
}
