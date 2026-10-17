import { describe, it, expect } from 'vitest';
import { CAFFEINE_HARM_DATA } from '../caffeineHarmData';
import { MEDICAL_MILESTONES_BASE } from '../medicalMilestones';

describe('Clinical Sources & Medical Evidence Integrity (P0-1)', () => {
  describe('Caffeine Harm Data Sources', () => {
    it('requires every harm item to have at least one verified source', () => {
      expect(CAFFEINE_HARM_DATA.length).toBeGreaterThan(0);

      CAFFEINE_HARM_DATA.forEach((item) => {
        expect(item.sources, `Item ${item.id} must have a sources array`).toBeDefined();
        expect(item.sources.length, `Item ${item.id} must have at least one source`).toBeGreaterThanOrEqual(1);

        item.sources.forEach((source, idx) => {
          expect(source.title.trim().length, `Source #${idx} in ${item.id} must have title`).toBeGreaterThan(5);
          expect(source.url, `Source #${idx} in ${item.id} must use secure HTTPS`).toMatch(/^https:\/\//);
        });
      });
    });

    it('does not contain unscientific pseudo-diagnoses like "истощение надпочечников" or "adrenal fatigue"', () => {
      const serialized = JSON.stringify(CAFFEINE_HARM_DATA).toLowerCase();
      expect(serialized).not.toContain('истощение надпочечников');
      expect(serialized).not.toContain('adrenal fatigue');
      expect(serialized).not.toContain('адреналового выгорания');
    });

    it('includes cautious language for reversibility timelines', () => {
      CAFFEINE_HARM_DATA.forEach((item) => {
        expect(
          item.reversibilityTimeline.toLowerCase(),
          `Item ${item.id} must contain cautious or approximate language`
        ).toMatch(/ориентировочно|зависит|индивидуально/);
      });
    });
  });

  describe('Medical Milestones Sources', () => {
    it('requires every bio-milestone to have at least one verified source', () => {
      expect(MEDICAL_MILESTONES_BASE.length).toBeGreaterThan(0);

      MEDICAL_MILESTONES_BASE.forEach((milestone) => {
        expect(milestone.sources, `Milestone ${milestone.id} must have sources array`).toBeDefined();
        expect(
          milestone.sources.length,
          `Milestone ${milestone.id} must have at least one source`
        ).toBeGreaterThanOrEqual(1);

        milestone.sources.forEach((source, idx) => {
          expect(source.title.trim().length, `Source #${idx} in ${milestone.id} must have title`).toBeGreaterThan(5);
          expect(source.url, `Source #${idx} in ${milestone.id} must use secure HTTPS`).toMatch(/^https:\/\//);
        });
      });
    });
  });
});
