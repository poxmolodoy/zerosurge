import { describe, it, expect } from 'vitest';
import { CAFFEINE_HARM_DATA } from '../caffeineHarmData';

describe('Caffeine Harm Dataset (TDD)', () => {
  it('contains at least 6 core body systems with clinical depth', () => {
    expect(CAFFEINE_HARM_DATA.length).toBeGreaterThanOrEqual(6);
  });

  it('validates each harm record structure and non-empty clinical fields', () => {
    CAFFEINE_HARM_DATA.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.systemName).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.badgeLabel).toBeTruthy();
      expect(item.iconType).toBeTruthy();
      expect(item.shortDescription.length).toBeGreaterThan(20);
      expect(item.clinicalMechanism.length).toBeGreaterThan(40);
      expect(item.symptoms.length).toBeGreaterThanOrEqual(2);
      expect(item.reversibilityTimeline).toBeTruthy();
      expect(item.medicalCitation).toBeTruthy();
    });
  });

  it('includes key systems: cardiovascular, neurological, adrenals, gastrointestinal, renal, and dental', () => {
    const ids = CAFFEINE_HARM_DATA.map((i) => i.id);
    expect(ids).toContain('cardiovascular');
    expect(ids).toContain('neuro-sleep');
    expect(ids).toContain('adrenals-cortisol');
    expect(ids).toContain('gastrointestinal');
    expect(ids).toContain('renal-electrolytes');
    expect(ids).toContain('dental-acidity');
  });
});
