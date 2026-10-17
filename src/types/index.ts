export interface UserProfile {
  quitDate: string; // ISO 8601 string
  cansPerDay: number;
  coffeePerDay: number;
  isSugarFree: boolean;
  costPerPortion: number; // in RUB (e.g. 130)
  isOnboarded: boolean;
}

export interface ElapsedTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export interface AppStats {
  moneySaved: number;
  cansAvoided: number;
  cupsAvoided: number;
  caffeineAvoidedMg: number;
  sugarAvoidedGrams: number;
  caloriesAvoidedKcal: number;
}

export interface BioMilestone {
  id: string;
  title: string;
  durationHours: number;
  durationLabel: string;
  progressPercent: number;
  isCompleted: boolean;
  shortDescription: string;
  fullMedicalDescription: string;
  biochemicalEffect: string;
  currentSymptoms: string;
  category: 'detox' | 'cardio' | 'sleep' | 'neuro' | 'metabolic';
}

export interface DailyCheckIn {
  date: string; // YYYY-MM-DD
  timestamp: number;
  energy: number; // 1-5
  sleep: number; // 1-5
  craving: number; // 1-5
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressPercent: number;
  requirementLabel: string;
}
