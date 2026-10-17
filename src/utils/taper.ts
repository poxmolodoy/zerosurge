import { ClinicalSource } from '../types';

export interface TaperPlan {
  isActive: boolean;
  startDate: string; // ISO 8601
  durationDays: number; // e.g. 14, 21, 28 days
  startDailyMg: number; // e.g. 400 mg
  targetDailyMg: number; // e.g. 0 mg
}

export interface ConsumptionEntry {
  id: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
  type: 'energy' | 'coffee' | 'tea' | 'other';
  title: string;
  volumeMl: number;
  caffeineMg: number;
}

export interface CaffeineItemPreset {
  id: string;
  name: string;
  category: 'energy' | 'coffee' | 'tea' | 'other';
  defaultVolumeMl: number;
  defaultCaffeineMg: number;
  source: ClinicalSource;
}

/**
 * Standard beverage presets based on published EFSA (2015) scientific data
 * and EU Directive 2002/67/EC for high-caffeine beverages (32 mg / 100 ml standard).
 */
export const DEFAULT_CAFFEINE_PRESETS: CaffeineItemPreset[] = [
  {
    id: 'energy-std',
    name: 'Энергетический напиток (0.25 л)',
    category: 'energy',
    defaultVolumeMl: 250,
    defaultCaffeineMg: 80, // Standard 32 mg/100 ml
    source: {
      title: 'EFSA Panel on Dietetic Products: Scientific Opinion on the safety of caffeine (2015)',
      url: 'https://doi.org/10.2903/j.efsa.2015.4102',
      year: 2015,
    },
  },
  {
    id: 'energy-large',
    name: 'Энергетический напиток (0.5 л)',
    category: 'energy',
    defaultVolumeMl: 500,
    defaultCaffeineMg: 160,
    source: {
      title: 'EFSA Panel on Dietetic Products: Scientific Opinion on the safety of caffeine (2015)',
      url: 'https://doi.org/10.2903/j.efsa.2015.4102',
      year: 2015,
    },
  },
  {
    id: 'espresso',
    name: 'Эспрессо (30–40 мл)',
    category: 'coffee',
    defaultVolumeMl: 35,
    defaultCaffeineMg: 65,
    source: {
      title: 'EFSA Panel on Dietetic Products: Scientific Opinion on the safety of caffeine (2015)',
      url: 'https://doi.org/10.2903/j.efsa.2015.4102',
      year: 2015,
    },
  },
  {
    id: 'filter-coffee',
    name: 'Фильтр-кофе / Американо (200 мл)',
    category: 'coffee',
    defaultVolumeMl: 200,
    defaultCaffeineMg: 90,
    source: {
      title: 'EFSA Panel on Dietetic Products: Scientific Opinion on the safety of caffeine (2015)',
      url: 'https://doi.org/10.2903/j.efsa.2015.4102',
      year: 2015,
    },
  },
  {
    id: 'black-tea',
    name: 'Чёрный чай (220 мл)',
    category: 'tea',
    defaultVolumeMl: 220,
    defaultCaffeineMg: 45,
    source: {
      title: 'EFSA Panel on Dietetic Products: Scientific Opinion on the safety of caffeine (2015)',
      url: 'https://doi.org/10.2903/j.efsa.2015.4102',
      year: 2015,
    },
  },
  {
    id: 'green-tea',
    name: 'Зелёный чай (220 мл)',
    category: 'tea',
    defaultVolumeMl: 220,
    defaultCaffeineMg: 28,
    source: {
      title: 'EFSA Panel on Dietetic Products: Scientific Opinion on the safety of caffeine (2015)',
      url: 'https://doi.org/10.2903/j.efsa.2015.4102',
      year: 2015,
    },
  },
];

/**
 * Calculates linear daily caffeine limit (mg) for a specific date according to taper plan.
 */
export function calculateTaperDailyLimit(plan: TaperPlan, targetDateStr?: string): number {
  if (!plan.isActive) return 0;

  const startMs = new Date(plan.startDate).setHours(0, 0, 0, 0);
  const targetMs = targetDateStr
    ? new Date(targetDateStr).setHours(0, 0, 0, 0)
    : new Date().setHours(0, 0, 0, 0);

  const diffDays = Math.floor((targetMs - startMs) / (24 * 60 * 60 * 1000));

  if (diffDays <= 0) {
    return plan.startDailyMg;
  }

  if (diffDays >= plan.durationDays) {
    return plan.targetDailyMg;
  }

  const fraction = diffDays / plan.durationDays;
  const reduction = fraction * (plan.startDailyMg - plan.targetDailyMg);
  return Math.max(plan.targetDailyMg, Math.round(plan.startDailyMg - reduction));
}

/**
 * Calculates sum of caffeine (mg) consumed on a specific date (YYYY-MM-DD).
 */
export function calculateDayTotalCaffeine(entries: ConsumptionEntry[], dateStr: string): number {
  return entries
    .filter((entry) => entry.date === dateStr)
    .reduce((sum, item) => sum + (Number(item.caffeineMg) || 0), 0);
}

/**
 * Calculates full taper status: daily limit, consumed amount, remaining allowance, and overflow.
 */
export function calculateTaperProgress(
  plan: TaperPlan,
  entries: ConsumptionEntry[],
  targetDateStr?: string
): {
  dailyLimitMg: number;
  consumedMg: number;
  remainingMg: number;
  isExceeded: boolean;
  dayNumber: number;
  totalDays: number;
} {
  const dateKey = targetDateStr || new Date().toISOString().split('T')[0];
  const dailyLimitMg = calculateTaperDailyLimit(plan, dateKey);
  const consumedMg = calculateDayTotalCaffeine(entries, dateKey);
  const remainingMg = Math.max(0, dailyLimitMg - consumedMg);
  const isExceeded = consumedMg > dailyLimitMg;

  const startMs = new Date(plan.startDate).setHours(0, 0, 0, 0);
  const targetMs = new Date(dateKey).setHours(0, 0, 0, 0);
  const elapsedDays = Math.max(1, Math.floor((targetMs - startMs) / (24 * 60 * 60 * 1000)) + 1);
  const dayNumber = Math.min(plan.durationDays, elapsedDays);

  return {
    dailyLimitMg,
    consumedMg,
    remainingMg,
    isExceeded,
    dayNumber,
    totalDays: plan.durationDays,
  };
}
