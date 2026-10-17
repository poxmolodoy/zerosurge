import { describe, it, expect } from 'vitest';
import { sanitizeUserProfile, sanitizeCheckIns } from '../securityValidator';

describe('Security Validator (TDD)', () => {
  describe('sanitizeUserProfile', () => {
    it('returns null when input is null, undefined, or not an object', () => {
      expect(sanitizeUserProfile(null)).toBeNull();
      expect(sanitizeUserProfile(undefined)).toBeNull();
      expect(sanitizeUserProfile('string')).toBeNull();
      expect(sanitizeUserProfile(123)).toBeNull();
    });

    it('sanitizes valid profile with bounds checking', () => {
      const valid = {
        quitDate: '2026-10-15T12:00:00.000Z',
        cansPerDay: 3,
        coffeePerDay: 2,
        isSugarFree: true,
        costPerPortion: 150,
        isOnboarded: true,
      };

      const result = sanitizeUserProfile(valid);
      expect(result).not.toBeNull();
      expect(result?.cansPerDay).toBe(3);
      expect(result?.isSugarFree).toBe(true);
      expect(result?.costPerPortion).toBe(150);
    });

    it('defends against extreme numbers and NaN tampering', () => {
      const tampered = {
        quitDate: 'invalid-date',
        cansPerDay: -10,
        coffeePerDay: 999999,
        isSugarFree: 'malicious-string',
        costPerPortion: NaN,
        isOnboarded: true,
      };

      const result = sanitizeUserProfile(tampered);
      expect(result).not.toBeNull();
      // Negative cans should be clamped to 0
      expect(result?.cansPerDay).toBe(0);
      // Extreme coffee should be clamped to safe max (50)
      expect(result?.coffeePerDay).toBe(50);
      // NaN cost should fallback to default (130)
      expect(result?.costPerPortion).toBe(130);
      // Invalid date should fallback to valid ISO date
      expect(new Date(result?.quitDate || '').getTime()).not.toBeNaN();
    });

    it('prevents prototype pollution injection', () => {
      const maliciousPayload = JSON.parse(
        '{"__proto__": {"polluted": true}, "cansPerDay": 2, "costPerPortion": 130}'
      );
      const result = sanitizeUserProfile(maliciousPayload);
      expect(result).not.toBeNull();
      expect((Object.prototype as any).polluted).toBeUndefined();
    });
  });

  describe('sanitizeCheckIns', () => {
    it('returns empty array when input is not an array', () => {
      expect(sanitizeCheckIns(null)).toEqual([]);
      expect(sanitizeCheckIns({})).toEqual([]);
      expect(sanitizeCheckIns('string')).toEqual([]);
    });

    it('filters out corrupted items and clamps ratings to 1-5', () => {
      const mixed = [
        { date: '2026-10-16', timestamp: 12345678, energy: 4, sleep: 5, craving: 2 },
        { date: 'invalid-date', energy: 10, sleep: -5, craving: 3 }, // invalid date format
        { date: '2026-10-17', timestamp: 12345679, energy: 99, sleep: -1, craving: 0 }, // out of range
        null,
        'corrupted',
      ];

      const result = sanitizeCheckIns(mixed);
      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2026-10-16');
      expect(result[0].energy).toBe(4);

      // Clamped ratings for second valid date
      expect(result[1].date).toBe('2026-10-17');
      expect(result[1].energy).toBe(5); // Clamped from 99 to 5
      expect(result[1].sleep).toBe(1); // Clamped from -1 to 1
      expect(result[1].craving).toBe(1); // Clamped from 0 to 1
    });
  });
});
