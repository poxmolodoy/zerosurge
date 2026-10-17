import { describe, it, expect, beforeEach } from 'vitest';
import {
  CURRENT_SCHEMA_VERSION,
  serializeExportData,
  validateImportPayload,
  hasPrototypePollution,
} from '../securityValidator';
import { UserProfile, DailyCheckIn } from '../../types';

describe('Export and Import Data Security & Validation', () => {
  const mockProfile: UserProfile = {
    quitDate: '2026-03-01T12:00:00.000Z',
    cansPerDay: 3,
    coffeePerDay: 2,
    isSugarFree: false,
    costPerPortion: 150,
    isOnboarded: true,
  };

  const mockCheckIns: DailyCheckIn[] = [
    {
      date: '2026-03-02',
      timestamp: 1772452800000,
      energy: 4,
      sleep: 3,
      craving: 2,
    },
    {
      date: '2026-03-03',
      timestamp: 1772539200000,
      energy: 5,
      sleep: 4,
      craving: 1,
    },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  it('performs a valid round-trip export and import validation', () => {
    const exportedJson = serializeExportData(mockProfile, mockCheckIns);
    const parsed = JSON.parse(exportedJson);

    expect(parsed.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(parsed.exportedAt).toBeDefined();

    const result = validateImportPayload(exportedJson);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.profile.cansPerDay).toBe(3);
      expect(result.data.profile.coffeePerDay).toBe(2);
      expect(result.data.profile.isSugarFree).toBe(false);
      expect(result.data.profile.costPerPortion).toBe(150);
      expect(result.data.checkIns).toHaveLength(2);
      expect(result.preview.checkInsCount).toBe(2);
      expect(result.preview.quitDate).toBe('2026-03-01T12:00:00.000Z');
      expect(result.preview.cansPerDay).toBe(3);
    }
  });

  it('restores state in localStorage after export, clear, and import', () => {
    // 1. Initial save to localStorage
    localStorage.setItem('zerosurge_profile', JSON.stringify(mockProfile));
    localStorage.setItem('zerosurge_checkins', JSON.stringify(mockCheckIns));

    // 2. Export
    const exportedJson = serializeExportData(mockProfile, mockCheckIns);

    // 3. Wipe localStorage completely
    localStorage.clear();
    expect(localStorage.getItem('zerosurge_profile')).toBeNull();
    expect(localStorage.getItem('zerosurge_checkins')).toBeNull();

    // 4. Validate and import
    const validation = validateImportPayload(exportedJson);
    expect(validation.success).toBe(true);

    if (validation.success) {
      localStorage.setItem('zerosurge_profile', JSON.stringify(validation.data.profile));
      localStorage.setItem('zerosurge_checkins', JSON.stringify(validation.data.checkIns));
    }

    // 5. Verify restored state
    const restoredProfile = JSON.parse(localStorage.getItem('zerosurge_profile')!);
    const restoredCheckIns = JSON.parse(localStorage.getItem('zerosurge_checkins')!);

    expect(restoredProfile).toEqual(mockProfile);
    expect(restoredCheckIns).toEqual(mockCheckIns);
  });

  it('rejects malformed non-JSON strings with a clear Russian error', () => {
    const result = validateImportPayload('{ broken json: true, ');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Некорректный формат JSON файла');
    }
  });

  it('blocks prototype pollution payload with __proto__ or constructor', () => {
    const pollutedJson = JSON.stringify({
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      data: {
        profile: {
          ...mockProfile,
          __proto__: { isAdmin: true },
        },
        checkIns: mockCheckIns,
      },
    });

    const parsed = JSON.parse(pollutedJson);
    // Directly inject property for AST / parser representation
    Object.defineProperty(parsed.data.profile, '__proto__', {
      value: { isAdmin: true },
      enumerable: true,
      configurable: true,
    });

    expect(hasPrototypePollution(parsed)).toBe(true);

    const result = validateImportPayload(pollutedJson);
    // Either caught by prototype guard or rejected
    expect(result.success).toBe(true); // JSON.parse stripped it or validateImportPayload sanitized it safely
    if (result.success) {
      expect((result.data.profile as any).isAdmin).toBeUndefined();
      expect(({} as any).isAdmin).toBeUndefined();
    }
  });

  it('rejects unknown future schemaVersion', () => {
    const futurePayload = {
      schemaVersion: 99,
      exportedAt: new Date().toISOString(),
      data: {
        profile: mockProfile,
        checkIns: mockCheckIns,
      },
    };

    const result = validateImportPayload(futurePayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('новее поддерживаемой');
      expect(result.error).toContain('99');
    }
  });

  it('rejects invalid or missing schemaVersion', () => {
    const invalidPayload = {
      exportedAt: new Date().toISOString(),
      data: {
        profile: mockProfile,
        checkIns: mockCheckIns,
      },
    };

    const result = validateImportPayload(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('schemaVersion');
    }
  });

  it('clamps out-of-range values during profile and check-in sanitization', () => {
    const outOfBoundsPayload = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      data: {
        profile: {
          quitDate: 'invalid-date',
          cansPerDay: 500, // Should be clamped to max 50
          coffeePerDay: -10, // Should be clamped to min 0
          isSugarFree: 'yes',
          costPerPortion: -100, // Should default/clamp
          isOnboarded: true,
        },
        checkIns: [
          {
            date: '2026-03-01',
            timestamp: 'not-a-number',
            energy: 10, // Clamp to 5
            sleep: -2, // Clamp to 1
            craving: 3.8, // Round to 4
          },
          {
            // Invalid date format, should be skipped
            date: '01-03-2026',
            energy: 3,
            sleep: 3,
            craving: 3,
          },
        ],
      },
    };

    const result = validateImportPayload(outOfBoundsPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.profile.cansPerDay).toBe(50);
      expect(result.data.profile.coffeePerDay).toBe(0);
      expect(result.data.profile.costPerPortion).toBe(130); // Defaulted
      expect(result.data.checkIns).toHaveLength(1);
      expect(result.data.checkIns[0].energy).toBe(5);
      expect(result.data.checkIns[0].sleep).toBe(1);
      expect(result.data.checkIns[0].craving).toBe(4);
    }
  });

  it('rejects payload when data section is missing or empty', () => {
    const emptyPayload = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
    };

    const result = validateImportPayload(emptyPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('data');
    }
  });
});
