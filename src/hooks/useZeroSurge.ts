import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserProfile,
  DailyCheckIn,
  ElapsedTime,
  AppStats,
  BioMilestone,
  Achievement,
} from '../types';
import {
  calculateElapsedTime,
  calculateStats,
  calculateBioProgress,
  evaluateAchievements,
  calculateRelapsePenalty,
  RelapsePenaltyResult,
} from '../utils/calculations';
import {
  sanitizeUserProfile,
  sanitizeCheckIns,
  sanitizeTaperPlan,
  sanitizeConsumptionLog,
  BackupDataV2,
} from '../utils/securityValidator';
import { TaperPlan, ConsumptionEntry } from '../utils/taper';

const PROFILE_KEY = 'zerosurge_profile';
const CHECKINS_KEY = 'zerosurge_checkins';
const TAPER_PLAN_KEY = 'zerosurge_taper_plan';
const CONSUMPTION_LOG_KEY = 'zerosurge_consumption_log';

export function useZeroSurge() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (!stored) return null;
      return sanitizeUserProfile(JSON.parse(stored));
    } catch {
      return null;
    }
  });

  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => {
    try {
      const stored = localStorage.getItem(CHECKINS_KEY);
      if (!stored) return [];
      return sanitizeCheckIns(JSON.parse(stored));
    } catch {
      return [];
    }
  });

  const [taperPlan, setTaperPlan] = useState<TaperPlan>(() => {
    try {
      const stored = localStorage.getItem(TAPER_PLAN_KEY);
      if (!stored) {
        return {
          isActive: false,
          startDate: new Date().toISOString(),
          durationDays: 14,
          startDailyMg: 300,
          targetDailyMg: 0,
        };
      }
      return sanitizeTaperPlan(JSON.parse(stored));
    } catch {
      return {
        isActive: false,
        startDate: new Date().toISOString(),
        durationDays: 14,
        startDailyMg: 300,
        targetDailyMg: 0,
      };
    }
  });

  const [consumptionLog, setConsumptionLog] = useState<ConsumptionEntry[]>(() => {
    try {
      const stored = localStorage.getItem(CONSUMPTION_LOG_KEY);
      if (!stored) return [];
      return sanitizeConsumptionLog(JSON.parse(stored));
    } catch {
      return [];
    }
  });

  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  // Background sync on focus and gentle 30s interval (prevents 1Hz full-app re-renders)
  useEffect(() => {
    const handleFocus = () => setCurrentTime(Date.now());
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
      clearInterval(timer);
    };
  }, []);

  const saveProfile = useCallback((newProfile: UserProfile) => {
    const sanitized = sanitizeUserProfile(newProfile);
    if (!sanitized) return;

    setProfile(sanitized);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(sanitized));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }, []);

  const resetAllData = useCallback(() => {
    setProfile(null);
    setCheckIns([]);
    setTaperPlan({
      isActive: false,
      startDate: new Date().toISOString(),
      durationDays: 14,
      startDailyMg: 300,
      targetDailyMg: 0,
    });
    setConsumptionLog([]);
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(CHECKINS_KEY);
      localStorage.removeItem(TAPER_PLAN_KEY);
      localStorage.removeItem(CONSUMPTION_LOG_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  }, []);

  const saveTaperPlan = useCallback((newPlan: TaperPlan) => {
    const sanitized = sanitizeTaperPlan(newPlan);
    setTaperPlan(sanitized);
    try {
      localStorage.setItem(TAPER_PLAN_KEY, JSON.stringify(sanitized));
    } catch (e) {
      console.error('Failed to save taper plan to localStorage', e);
    }
  }, []);

  const addConsumption = useCallback(
    (entry: {
      type: 'energy' | 'coffee' | 'tea' | 'other';
      title: string;
      volumeMl: number;
      caffeineMg: number;
      date?: string;
    }) => {
      const today = new Date().toISOString().split('T')[0];
      const newEntry: ConsumptionEntry = {
        id: Math.random().toString(36).slice(2, 10),
        timestamp: Date.now(),
        date: entry.date || today,
        type: entry.type,
        title: entry.title,
        volumeMl: entry.volumeMl,
        caffeineMg: entry.caffeineMg,
      };

      setConsumptionLog((prev) => {
        const updated = [newEntry, ...prev];
        try {
          localStorage.setItem(CONSUMPTION_LOG_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save consumption log to localStorage', e);
        }
        return updated;
      });
    },
    []
  );

  const deleteConsumption = useCallback((id: string) => {
    setConsumptionLog((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(CONSUMPTION_LOG_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update consumption log in localStorage', e);
      }
      return updated;
    });
  }, []);

  const importData = useCallback((backup: BackupDataV2) => {
    const sanitizedProfile = sanitizeUserProfile(backup.profile);
    const sanitizedCheckIns = sanitizeCheckIns(backup.checkIns);
    const sanitizedTaper = backup.taperPlan
      ? sanitizeTaperPlan(backup.taperPlan)
      : {
          isActive: false,
          startDate: new Date().toISOString(),
          durationDays: 14,
          startDailyMg: 300,
          targetDailyMg: 0,
        };
    const sanitizedLog = backup.consumptionLog ? sanitizeConsumptionLog(backup.consumptionLog) : [];

    if (!sanitizedProfile) {
      throw new Error('Не удалось восстановить профиль: данные невалидны.');
    }

    setProfile(sanitizedProfile);
    setCheckIns(sanitizedCheckIns);
    setTaperPlan(sanitizedTaper);
    setConsumptionLog(sanitizedLog);

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(sanitizedProfile));
      localStorage.setItem(CHECKINS_KEY, JSON.stringify(sanitizedCheckIns));
      localStorage.setItem(TAPER_PLAN_KEY, JSON.stringify(sanitizedTaper));
      localStorage.setItem(CONSUMPTION_LOG_KEY, JSON.stringify(sanitizedLog));
    } catch (e) {
      console.error('Failed to save imported data to localStorage', e);
      throw new Error('Ошибка записи в локальное хранилище браузера.', { cause: e });
    }
  }, []);

  const addCheckIn = useCallback((energy: number, sleep: number, craving: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: DailyCheckIn = {
      date: today,
      timestamp: Date.now(),
      energy,
      sleep,
      craving,
    };

    setCheckIns((prev) => {
      const existingIndex = prev.findIndex((item) => item.date === today);
      let updated: DailyCheckIn[];
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = newEntry;
      } else {
        updated = [...prev, newEntry];
      }
      try {
        localStorage.setItem(CHECKINS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save checkIns to localStorage', e);
      }
      return updated;
    });
  }, []);

  const recordRelapse = useCallback(
    (
      count: number,
      itemType: 'energy' | 'coffee' = 'energy',
      _isSugarFree?: boolean
    ): RelapsePenaltyResult | null => {
      if (!profile) return null;

      const currentQuit = new Date(profile.quitDate).getTime();
      const validQuit = isNaN(currentQuit) ? currentTime : currentQuit;

      const penalty = calculateRelapsePenalty(
        validQuit,
        currentTime,
        count,
        profile.cansPerDay,
        itemType,
        profile.coffeePerDay
      );

      const updatedProfile: UserProfile = {
        ...profile,
        quitDate: new Date(penalty.newQuitTimestamp).toISOString(),
      };

      saveProfile(updatedProfile);
      return penalty;
    },
    [profile, currentTime, saveProfile]
  );

  const quitTimestamp = useMemo(() => {
    if (!profile?.quitDate) return currentTime;
    const parsed = new Date(profile.quitDate).getTime();
    return isNaN(parsed) ? currentTime : parsed;
  }, [profile?.quitDate, currentTime]);

  const elapsedTime: ElapsedTime = useMemo(() => {
    return calculateElapsedTime(quitTimestamp, currentTime);
  }, [quitTimestamp, currentTime]);

  const stats: AppStats = useMemo(() => {
    if (!profile) {
      return {
        moneySaved: 0,
        cansAvoided: 0,
        cupsAvoided: 0,
        caffeineAvoidedMg: 0,
        sugarAvoidedGrams: 0,
        caloriesAvoidedKcal: 0,
      };
    }
    return calculateStats(profile, elapsedTime.totalSeconds);
  }, [profile, elapsedTime.totalSeconds]);

  const milestones: BioMilestone[] = useMemo(() => {
    return calculateBioProgress(elapsedTime.totalSeconds);
  }, [elapsedTime.totalSeconds]);

  const fallbackProfile: UserProfile = useMemo(
    () => ({
      quitDate: new Date().toISOString(),
      cansPerDay: 2,
      coffeePerDay: 1,
      isSugarFree: false,
      costPerPortion: 130,
      isOnboarded: false,
    }),
    []
  );

  const achievements: Achievement[] = useMemo(() => {
    return evaluateAchievements(
      profile || fallbackProfile,
      stats,
      profile ? elapsedTime.totalSeconds : 0
    );
  }, [profile, fallbackProfile, stats, elapsedTime.totalSeconds]);

  return {
    profile,
    stats,
    elapsedTime,
    milestones,
    achievements,
    checkIns,
    taperPlan,
    consumptionLog,
    saveProfile,
    resetAllData,
    addCheckIn,
    recordRelapse,
    saveTaperPlan,
    addConsumption,
    deleteConsumption,
    importData,
  };
}
