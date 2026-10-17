import { describe, it, expect } from 'vitest';
import {
  calculateTaperDailyLimit,
  calculateDayTotalCaffeine,
  calculateTaperProgress,
  DEFAULT_CAFFEINE_PRESETS,
  TaperPlan,
  ConsumptionEntry,
} from '../taper';

describe('Caffeine Tapering and Consumption Formulas (P1-4)', () => {
  const plan: TaperPlan = {
    isActive: true,
    startDate: '2026-03-01T00:00:00.000Z',
    durationDays: 14,
    startDailyMg: 400,
    targetDailyMg: 0,
  };

  it('calculates linear limit on start day (day 0)', () => {
    const limit = calculateTaperDailyLimit(plan, '2026-03-01');
    expect(limit).toBe(400);
  });

  it('calculates linear limit on midpoint (day 7 of 14)', () => {
    const limit = calculateTaperDailyLimit(plan, '2026-03-08');
    // 400 - (7/14) * 400 = 200 mg
    expect(limit).toBe(200);
  });

  it('calculates linear limit on final day (day 14)', () => {
    const limit = calculateTaperDailyLimit(plan, '2026-03-15');
    expect(limit).toBe(0);
  });

  it('clamps limit to targetDailyMg after duration has passed', () => {
    const limit = calculateTaperDailyLimit(plan, '2026-03-25');
    expect(limit).toBe(0);
  });

  it('calculates total caffeine consumed for a specific date', () => {
    const entries: ConsumptionEntry[] = [
      {
        id: '1',
        timestamp: 1772452800000,
        date: '2026-03-02',
        type: 'energy',
        title: 'Энергетик 0.5 л',
        volumeMl: 500,
        caffeineMg: 160,
      },
      {
        id: '2',
        timestamp: 1772460000000,
        date: '2026-03-02',
        type: 'coffee',
        title: 'Эспрессо',
        volumeMl: 30,
        caffeineMg: 65,
      },
      {
        id: '3',
        timestamp: 1772539200000,
        date: '2026-03-03',
        type: 'energy',
        title: 'Энергетик 0.25 л',
        volumeMl: 250,
        caffeineMg: 80,
      },
    ];

    const day2Total = calculateDayTotalCaffeine(entries, '2026-03-02');
    expect(day2Total).toBe(225);

    const day3Total = calculateDayTotalCaffeine(entries, '2026-03-03');
    expect(day3Total).toBe(80);

    const emptyDay = calculateDayTotalCaffeine(entries, '2026-03-04');
    expect(emptyDay).toBe(0);
  });

  it('evaluates taper progress, remaining allowance, and overflow', () => {
    const entries: ConsumptionEntry[] = [
      {
        id: '1',
        timestamp: Date.now(),
        date: '2026-03-08',
        type: 'energy',
        title: 'Энергетик 0.5 л',
        volumeMl: 500,
        caffeineMg: 160,
      },
    ];

    const progress = calculateTaperProgress(plan, entries, '2026-03-08');
    expect(progress.dailyLimitMg).toBe(200);
    expect(progress.consumedMg).toBe(160);
    expect(progress.remainingMg).toBe(40);
    expect(progress.isExceeded).toBe(false);

    // Add extra cup of coffee exceeding the 200mg limit
    entries.push({
      id: '2',
      timestamp: Date.now(),
      date: '2026-03-08',
      type: 'coffee',
      title: 'Американо',
      volumeMl: 200,
      caffeineMg: 90,
    });

    const exceededProgress = calculateTaperProgress(plan, entries, '2026-03-08');
    expect(exceededProgress.consumedMg).toBe(250);
    expect(exceededProgress.remainingMg).toBe(0);
    expect(exceededProgress.isExceeded).toBe(true);
  });

  it('provides verified clinical source citations for all standard presets', () => {
    expect(DEFAULT_CAFFEINE_PRESETS.length).toBeGreaterThanOrEqual(4);
    for (const preset of DEFAULT_CAFFEINE_PRESETS) {
      expect(preset.source).toBeDefined();
      expect(preset.source.url).toMatch(/^https:\/\//);
      expect(preset.defaultCaffeineMg).toBeGreaterThan(0);
      expect(preset.defaultVolumeMl).toBeGreaterThan(0);
    }
  });
});
