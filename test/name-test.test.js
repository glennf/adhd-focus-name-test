import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildResponsePayload,
  getPublicVariantId,
  getRandomVariantId,
  getVariantConfig,
  scoreLabels,
  testVariantIds,
  variantConfigs,
} from '../src/name-test.js';

test('getVariantConfig returns HodeRo copy for hodero URL variant', () => {
  const config = getVariantConfig('hodero');

  assert.equal(config.id, 'hodero');
  assert.equal(config.name, 'HodeRo');
  assert.match(config.heroTitle, /HodeRo/);
  assert.match(config.tagline, /Snakk rotet/);
});

test('getVariantConfig falls back to default for unknown variant', () => {
  const config = getVariantConfig('unknown-name');

  assert.equal(config.id, 'default');
  assert.equal(config.name, 'Navnetest');
});

test('variantConfigs contains the planned name candidates', () => {
  const names = variantConfigs.map((config) => config.name);

  assert.deepEqual(names, [
    'Navnetest',
    'HodeRo',
    'Tankerydd',
    'Hodefred',
    'FokusFlyt',
    'KlareSinn',
  ]);
});

test('public test variants exclude default and can be deterministically randomized', () => {
  assert.deepEqual(testVariantIds, ['hodero', 'tankerydd', 'hodefred', 'fokusflyt', 'klaresinn']);
  assert.equal(getRandomVariantId(() => 0), 'hodero');
  assert.equal(getRandomVariantId(() => 0.999), 'klaresinn');
});

test('getPublicVariantId only allows planned test variants', () => {
  assert.equal(getPublicVariantId('tankerydd', () => 0), 'tankerydd');
  assert.equal(getPublicVariantId('Tankerydd', () => 0.2), 'tankerydd');
  assert.equal(getPublicVariantId('hva-som-helst', () => 0.999), 'klaresinn');
  assert.equal(getPublicVariantId('default', () => 0), 'hodero');
  assert.equal(getPublicVariantId('', () => 0.4), 'hodefred');
});

test('scoreLabels provides a five-point Likert scale', () => {
  assert.equal(scoreLabels.length, 5);
  assert.equal(scoreLabels[0].value, '1');
  assert.equal(scoreLabels[4].value, '5');
});

test('buildResponsePayload includes scores, variant and metadata', () => {
  const formData = {
    understanding: 'Den rydder tanker',
    feeling: 'Rolig',
    understanding_score: '5',
    trust_score: '4',
    try_intent_score: '5',
    overwhelm_score: '2',
  };
  const metadata = {
    variant: 'tankerydd',
    variantName: 'Tankerydd',
    pageUrl: 'https://navnetest.datasmie.no/?variant=tankerydd',
    referrer: '',
    userAgent: 'node-test',
    language: 'nb-NO',
    timezone: 'Europe/Oslo',
    screen: '0x0',
    utm_source: 'telegram',
    utm_medium: 'dm',
    utm_campaign: 'round1',
  };

  const payload = buildResponsePayload(formData, metadata);

  assert.equal(payload.favorite, 'Tankerydd');
  assert.equal(payload.variant, 'tankerydd');
  assert.equal(payload.variantName, 'Tankerydd');
  assert.equal(payload.understanding_score, '5');
  assert.equal(payload.trust_score, '4');
  assert.equal(payload.try_intent_score, '5');
  assert.equal(payload.overwhelm_score, '2');
  assert.equal(payload.utm_campaign, 'round1');
});
