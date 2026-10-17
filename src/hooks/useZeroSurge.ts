import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserProfile, DailyCheckIn, ElapsedTime, AppStats, BioMilestone, Achievement } from '../types';
import {
  calculateElapsedTime,
  calculateStats,
  calculateBioProgress,
  evaluateAchievements,
  calculateRelapsePenalty,
  RelapsePenaltyResult,
} from '../utils/calculations';
import { sanitizeUserProfile, sanitizeCheckIns } from '../utils/securityValidator';

const PROFILE_KEY = 'zerosurge_profile';
const CHECKINS_KEY = 'zerosurge_checkins';

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

  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  // 1-second live ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
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
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(CHECKINS_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage', e);
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

  const achievements: Achievement[] = useMemo(() => {
    if (!profile) return [];
    return evaluateAchievements(profile, stats, elapsedTime.totalSeconds);
  }, [profile, stats, elapsedTime.totalSeconds]);

  return {
    profile,
    stats,
    elapsedTime,
    milestones,
    achievements,
    checkIns,
    saveProfile,
    resetAllData,
    addCheckIn,
    recordRelapse,
  };
}
