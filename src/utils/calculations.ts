import { UserProfile, ElapsedTime, AppStats, BioMilestone, Achievement } from '../types';
import { MEDICAL_MILESTONES_BASE } from '../data/medicalMilestones';

export const SECONDS_IN_DAY = 86400;
export const SECONDS_IN_HOUR = 3600;
export const SECONDS_IN_MINUTE = 60;

/**
 * Calculates elapsed time components from a quit date timestamp to a current timestamp.
 * Handles future dates by clamping to 0.
 */
export function calculateElapsedTime(quitTimestamp: number, currentTimestamp: number): ElapsedTime {
  const diffMs = currentTimestamp - quitTimestamp;
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

  const days = Math.floor(totalSeconds / SECONDS_IN_DAY);
  const hours = Math.floor((totalSeconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR);
  const minutes = Math.floor((totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  const seconds = totalSeconds % SECONDS_IN_MINUTE;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
  };
}

/**
 * Calculates money saved, portions avoided, caffeine, sugar, and calories.
 */
export function calculateStats(profile: UserProfile, totalSeconds: number): AppStats {
  const daysElapsed = totalSeconds / SECONDS_IN_DAY;

  const cansAvoided = daysElapsed * profile.cansPerDay;
  const cupsAvoided = daysElapsed * profile.coffeePerDay;
  const moneySaved = (cansAvoided + cupsAvoided) * profile.costPerPortion;

  // 160 mg caffeine per can, 120 mg per coffee cup
  const caffeineAvoidedMg = cansAvoided * 160 + cupsAvoided * 120;

  // Sugar & Calories (only if not sugar-free)
  const sugarAvoidedGrams = profile.isSugarFree ? 0 : cansAvoided * 55;
  const caloriesAvoidedKcal = profile.isSugarFree ? 0 : cansAvoided * 220;

  return {
    moneySaved,
    cansAvoided,
    cupsAvoided,
    caffeineAvoidedMg,
    sugarAvoidedGrams,
    caloriesAvoidedKcal,
  };
}

/**
 * Computes live percentage and completion status for the 5 body recovery milestones.
 */
export function calculateBioProgress(totalSeconds: number): BioMilestone[] {
  return MEDICAL_MILESTONES_BASE.map((milestone) => {
    const totalRequiredSeconds = milestone.durationHours * SECONDS_IN_HOUR;
    const rawPercent = (totalSeconds / totalRequiredSeconds) * 100;
    const progressPercent = Math.min(100, Math.max(0, Math.round(rawPercent * 10) / 10));
    const isCompleted = progressPercent >= 100;

    return {
      ...milestone,
      progressPercent,
      isCompleted,
    };
  });
}

/**
 * Evaluates the 8 achievements based on elapsed time, consumption avoided, and money saved.
 */
export function evaluateAchievements(
  profile: UserProfile,
  stats: AppStats,
  totalSeconds: number
): Achievement[] {
  const daysElapsed = totalSeconds / SECONDS_IN_DAY;

  const achievementsList: Achievement[] = [
    {
      id: 'ach-24h',
      title: 'Первые 24 часа',
      description: 'Сутки без стимуляторов. Кофеин полностью покинул кровь.',
      iconName: 'Clock',
      requirementLabel: '24 часа чистоты',
      progressPercent: Math.min(100, (totalSeconds / (1 * SECONDS_IN_DAY)) * 100),
      unlocked: daysElapsed >= 1,
    },
    {
      id: 'ach-3d',
      title: 'Пик ломки пройден',
      description: '3 дня позади. Самый тяжелый кризис синдрома отмены преодолён.',
      iconName: 'ShieldCheck',
      requirementLabel: '3 дня чистоты',
      progressPercent: Math.min(100, (totalSeconds / (3 * SECONDS_IN_DAY)) * 100),
      unlocked: daysElapsed >= 3,
    },
    {
      id: 'ach-7d',
      title: 'Чистые сосуды и сон',
      description: 'Неделя чистоты. Возвращение глубоких фаз сна и естественного пульса.',
      iconName: 'Moon',
      requirementLabel: '7 дней чистоты',
      progressPercent: Math.min(100, (totalSeconds / (7 * SECONDS_IN_DAY)) * 100),
      unlocked: daysElapsed >= 7,
    },
    {
      id: 'ach-14d',
      title: 'Свободные рецепторы',
      description: '2 недели чистоты. Аденозиновые рецепторы мозга сбросили толерантность.',
      iconName: 'Brain',
      requirementLabel: '14 дней чистоты',
      progressPercent: Math.min(100, (totalSeconds / (14 * SECONDS_IN_DAY)) * 100),
      unlocked: daysElapsed >= 14,
    },
    {
      id: 'ach-30d',
      title: 'Месяц чистоты',
      description: '30 дней абсолютной автономии от стимуляторов. Новая привычка закреплена.',
      iconName: 'Trophy',
      requirementLabel: '30 дней чистоты',
      progressPercent: Math.min(100, (totalSeconds / (30 * SECONDS_IN_DAY)) * 100),
      unlocked: daysElapsed >= 30,
    },
    {
      id: 'ach-10cans',
      title: '10 невыпитых банок',
      description: 'Вы спасли организм от ударной дозы 10 банок химических энергетиков.',
      iconName: 'ZapOff',
      requirementLabel: '10 пропущенных банок',
      progressPercent: Math.min(100, (stats.cansAvoided / 10) * 100),
      unlocked: stats.cansAvoided >= 10,
    },
    {
      id: 'ach-sugar500',
      title: profile.isSugarFree ? 'Защита эмали и ЖКТ' : 'Минус 500 г сахара',
      description: profile.isSugarFree
        ? '10 дней без химических подсластителей, кислот и искусственных добавок.'
        : 'Пол килограмма чистого белого сахара не попало в ваш организм.',
      iconName: 'HeartPulse',
      requirementLabel: profile.isSugarFree ? '10 дней чистоты' : '500 г сахара',
      progressPercent: profile.isSugarFree
        ? Math.min(100, (totalSeconds / (10 * SECONDS_IN_DAY)) * 100)
        : Math.min(100, (stats.sugarAvoidedGrams / 500) * 100),
      unlocked: profile.isSugarFree ? daysElapsed >= 10 : stats.sugarAvoidedGrams >= 500,
    },
    {
      id: 'ach-money1000',
      title: 'Первая сэкономленная 1000 ₽',
      description: 'Деньги остались в вашем кошельке, а не в кассе супермаркета.',
      iconName: 'Coins',
      requirementLabel: '1 000 ₽ экономии',
      progressPercent: Math.min(100, (stats.moneySaved / 1000) * 100),
      unlocked: stats.moneySaved >= 1000,
    },
  ];

  return achievementsList;
}

export interface RelapsePenaltyResult {
  newQuitTimestamp: number;
  penaltySeconds: number;
  isTotalReset: boolean;
  previousCansAvoided: number;
  remainingCansAvoided: number;
}

/**
 * Calculates time and consumption penalty for a relapse event (energy drink or coffee).
 * If relapsed portion >= accumulated clean portions, performs a full reset.
 * Otherwise, shifts the quit timestamp forward by the equivalent time penalty.
 */
export function calculateRelapsePenalty(
  currentQuitTimestamp: number,
  currentTimestamp: number,
  relapseCount: number,
  cansPerDay: number,
  itemType: 'energy' | 'coffee' = 'energy',
  coffeePerDay: number = 1
): RelapsePenaltyResult {
  if (relapseCount <= 0) {
    const totalSecs = Math.max(0, Math.floor((currentTimestamp - currentQuitTimestamp) / 1000));
    const currentAvoided = (totalSecs / SECONDS_IN_DAY) * Math.max(0, cansPerDay);
    return {
      newQuitTimestamp: currentQuitTimestamp,
      penaltySeconds: 0,
      isTotalReset: false,
      previousCansAvoided: currentAvoided,
      remainingCansAvoided: currentAvoided,
    };
  }

  if (cansPerDay <= 0) {
    return {
      newQuitTimestamp: currentTimestamp,
      penaltySeconds: 0,
      isTotalReset: true,
      previousCansAvoided: 0,
      remainingCansAvoided: 0,
    };
  }

  const currentTotalSeconds = Math.max(
    0,
    Math.floor((currentTimestamp - currentQuitTimestamp) / 1000)
  );
  const previousCansAvoided = (currentTotalSeconds / SECONDS_IN_DAY) * cansPerDay;

  let secondsPerUnit: number;
  if (itemType === 'coffee') {
    if (coffeePerDay > 0) {
      secondsPerUnit = SECONDS_IN_DAY / coffeePerDay;
    } else {
      // 1 cup of coffee = 120mg caffeine vs 1 can = 160mg (0.75 ratio)
      secondsPerUnit = (120 / 160) * (SECONDS_IN_DAY / cansPerDay);
    }
  } else {
    secondsPerUnit = SECONDS_IN_DAY / cansPerDay;
  }

  const penaltySeconds = Math.floor(relapseCount * secondsPerUnit);

  // If penalty reaches or exceeds accumulated progress -> total reset
  if (penaltySeconds >= currentTotalSeconds) {
    return {
      newQuitTimestamp: currentTimestamp,
      penaltySeconds: currentTotalSeconds,
      isTotalReset: true,
      previousCansAvoided,
      remainingCansAvoided: 0,
    };
  }

  // Soft penalty: shift quit timestamp forward
  const newQuitTimestamp = currentQuitTimestamp + penaltySeconds * 1000;
  const remainingSeconds = currentTotalSeconds - penaltySeconds;
  const remainingCansAvoided = Math.max(0, (remainingSeconds / SECONDS_IN_DAY) * cansPerDay);

  return {
    newQuitTimestamp,
    penaltySeconds,
    isTotalReset: false,
    previousCansAvoided,
    remainingCansAvoided,
  };
}
