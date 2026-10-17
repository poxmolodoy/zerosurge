import { describe, it, expect } from 'vitest';
import {
  calculateElapsedTime,
  calculateStats,
  calculateBioProgress,
  evaluateAchievements,
  calculateRelapsePenalty,
} from '../calculations';
import { UserProfile } from '../../types';

describe('Domain Calculations (TDD)', () => {
  const baseProfile: UserProfile = {
    quitDate: '2026-10-15T00:00:00.000Z',
    cansPerDay: 2,
    coffeePerDay: 1,
    isSugarFree: false,
    costPerPortion: 130,
    isOnboarded: true,
  };

  describe('calculateElapsedTime', () => {
    it('calculates elapsed days, hours, minutes, seconds accurately', () => {
      const quit = 1000000;
      // Exactly 1 day, 2 hours, 3 minutes, 4 seconds = 86400 + 7200 + 180 + 4 = 93784 seconds
      const now = quit + 93784 * 1000;
      const result = calculateElapsedTime(quit, now);

      expect(result.days).toBe(1);
      expect(result.hours).toBe(2);
      expect(result.minutes).toBe(3);
      expect(result.seconds).toBe(4);
      expect(result.totalSeconds).toBe(93784);
    });

    it('clamps future quit timestamps to 0 to prevent negative values', () => {
      const quit = 2000000;
      const now = 1000000;
      const result = calculateElapsedTime(quit, now);

      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.totalSeconds).toBe(0);
    });
  });

  describe('calculateStats', () => {
    it('calculates money, avoided portions, caffeine, sugar and calories for standard profile', () => {
      // 2 days = 172800 seconds
      const totalSeconds = 172800;
      const stats = calculateStats(baseProfile, totalSeconds);

      // 2 days * 2 cans/day = 4 cans avoided
      expect(stats.cansAvoided).toBeCloseTo(4, 2);
      // 2 days * 1 coffee/day = 2 cups avoided
      expect(stats.cupsAvoided).toBeCloseTo(2, 2);
      // (4 cans + 2 cups) * 130 rub = 780 rub
      expect(stats.moneySaved).toBeCloseTo(780, 2);
      // 4 cans * 160mg + 2 cups * 120mg = 640 + 240 = 880mg
      expect(stats.caffeineAvoidedMg).toBeCloseTo(880, 2);
      // 4 cans * 55g = 220g sugar
      expect(stats.sugarAvoidedGrams).toBeCloseTo(220, 2);
      // 4 cans * 220 kcal = 880 kcal
      expect(stats.caloriesAvoidedKcal).toBeCloseTo(880, 2);
    });

    it('sets sugar and calories to 0 when isSugarFree is true', () => {
      const zeroProfile: UserProfile = { ...baseProfile, isSugarFree: true };
      const totalSeconds = 86400; // 1 day
      const stats = calculateStats(zeroProfile, totalSeconds);

      expect(stats.sugarAvoidedGrams).toBe(0);
      expect(stats.caloriesAvoidedKcal).toBe(0);
      expect(stats.cansAvoided).toBeCloseTo(2, 2);
    });
  });

  describe('calculateBioProgress', () => {
    it('computes percentage and completion status for all 5 milestones', () => {
      // Test at 12 hours (halfway through 24h milestone)
      const halfDaySeconds = 43200;
      const milestones12h = calculateBioProgress(halfDaySeconds);

      expect(milestones12h).toHaveLength(5);
      // Milestone 1 (24h) should be 50%
      expect(milestones12h[0].progressPercent).toBe(50);
      expect(milestones12h[0].isCompleted).toBe(false);

      // Test at 4 days (345,600s): Milestone 1 & 2 should be 100% completed
      const fourDaysSeconds = 345600;
      const milestones4d = calculateBioProgress(fourDaysSeconds);
      expect(milestones4d[0].progressPercent).toBe(100);
      expect(milestones4d[0].isCompleted).toBe(true);
      expect(milestones4d[1].progressPercent).toBe(100);
      expect(milestones4d[1].isCompleted).toBe(true);
      expect(milestones4d[2].progressPercent).toBeLessThan(100);
    });

    it('caps progress percentage at 100%', () => {
      const sixtyDaysSeconds = 60 * 86400;
      const milestones = calculateBioProgress(sixtyDaysSeconds);
      milestones.forEach((m) => {
        expect(m.progressPercent).toBe(100);
        expect(m.isCompleted).toBe(true);
      });
    });
  });

  describe('evaluateAchievements', () => {
    it('evaluates all 8 achievements based on time and consumption thresholds', () => {
      // 1 day clean
      const oneDaySeconds = 86400;
      const stats1d = calculateStats(baseProfile, oneDaySeconds);
      const achievements1d = evaluateAchievements(baseProfile, stats1d, oneDaySeconds);

      expect(achievements1d).toHaveLength(8);
      const ach24h = achievements1d.find((a) => a.id === 'ach-24h');
      expect(ach24h?.unlocked).toBe(true);

      const ach30d = achievements1d.find((a) => a.id === 'ach-30d');
      expect(ach30d?.unlocked).toBe(false);
    });

    it('unlocks 10 cans and 1000 RUB achievements when thresholds are exceeded', () => {
      // 6 days * 2 cans = 12 cans avoided; 6 days * 1 coffee = 6 cups; 18 portions * 130 = 2340 rub
      const sixDaysSeconds = 6 * 86400;
      const stats6d = calculateStats(baseProfile, sixDaysSeconds);
      const achievements = evaluateAchievements(baseProfile, stats6d, sixDaysSeconds);

      const ach10cans = achievements.find((a) => a.id === 'ach-10cans');
      expect(ach10cans?.unlocked).toBe(true);

      const achMoney = achievements.find((a) => a.id === 'ach-money1000');
      expect(achMoney?.unlocked).toBe(true);
    });
  });

  describe('calculateRelapsePenalty', () => {
    // cansPerDay = 2 -> 1 day = 86400s -> 1 can = 43200s (12 hours)
    it('applies partial penalty cleanly when cans relapsed < progress', () => {
      // 1.5 days = 36 hours = 3 cans avoided
      const now = 1000000000000;
      const thirtySixHoursMs = 36 * 3600 * 1000;
      const quit = now - thirtySixHoursMs;

      // Relapse 1 can -> penalty is 12 hours (43200s) -> remaining is 24 hours (2 cans avoided)
      const result = calculateRelapsePenalty(quit, now, 1, 2);

      expect(result.isTotalReset).toBe(false);
      expect(result.previousCansAvoided).toBeCloseTo(3, 2);
      expect(result.penaltySeconds).toBe(43200);
      expect(result.remainingCansAvoided).toBeCloseTo(2, 2);
      expect(result.newQuitTimestamp).toBe(quit + 43200 * 1000);
    });

    it('performs total reset when cans relapsed == progress', () => {
      const now = 1000000000000;
      const twelveHoursMs = 12 * 3600 * 1000; // 1 can at 2 cans/day
      const quit = now - twelveHoursMs;

      const result = calculateRelapsePenalty(quit, now, 1, 2);

      expect(result.isTotalReset).toBe(true);
      expect(result.remainingCansAvoided).toBe(0);
      expect(result.newQuitTimestamp).toBe(now);
    });

    it('performs total reset when cans relapsed > progress', () => {
      const now = 1000000000000;
      const sixHoursMs = 6 * 3600 * 1000; // 0.5 can at 2 cans/day
      const quit = now - sixHoursMs;

      // 2 cans relapsed when only 0.5 was avoided
      const result = calculateRelapsePenalty(quit, now, 2, 2);

      expect(result.isTotalReset).toBe(true);
      expect(result.remainingCansAvoided).toBe(0);
      expect(result.newQuitTimestamp).toBe(now);
    });

    it('returns no-op when cans relapsed is 0 or negative', () => {
      const now = 1000000000000;
      const quit = now - 24 * 3600 * 1000;

      const result = calculateRelapsePenalty(quit, now, 0, 2);

      expect(result.isTotalReset).toBe(false);
      expect(result.penaltySeconds).toBe(0);
      expect(result.newQuitTimestamp).toBe(quit);
    });

    it('handles fractional cans properly (e.g. 0.5 can)', () => {
      const now = 1000000000000;
      const twentyFourHoursMs = 24 * 3600 * 1000; // 2 cans avoided
      const quit = now - twentyFourHoursMs;

      const result = calculateRelapsePenalty(quit, now, 0.5, 2);

      // 0.5 can = 6 hours = 21600s
      expect(result.isTotalReset).toBe(false);
      expect(result.penaltySeconds).toBe(21600);
      expect(result.remainingCansAvoided).toBeCloseTo(1.5, 2);
    });

    it('handles invalid or zero cansPerDay gracefully without throwing or NaN', () => {
      const now = 1000000000000;
      const quit = now - 24 * 3600 * 1000;

      const result = calculateRelapsePenalty(quit, now, 1, 0);

      expect(result.isTotalReset).toBe(true);
      expect(result.newQuitTimestamp).toBe(now);
      expect(Number.isNaN(result.newQuitTimestamp)).toBe(false);
    });

    it('calculates coffee penalty based on coffeePerDay when itemType is coffee', () => {
      // 48 hours clean = 4 cans avoided (at 2 cans/day) or 2 cups avoided (at 1 coffee/day)
      const now = 1000000000000;
      const quit = now - 48 * 3600 * 1000;

      // 1 cup of coffee at 1 coffee/day = 24 hours penalty
      const result = calculateRelapsePenalty(quit, now, 1, 2, 'coffee', 1);

      expect(result.isTotalReset).toBe(false);
      expect(result.penaltySeconds).toBe(86400); // 24 hours
      expect(result.newQuitTimestamp).toBe(quit + 86400 * 1000);
      expect(result.remainingCansAvoided).toBeCloseTo(2, 2); // 4 - 2 = 2 cans remaining
    });

    it('calculates coffee penalty via caffeine ratio when coffeePerDay is 0', () => {
      const now = 1000000000000;
      const quit = now - 48 * 3600 * 1000;

      // 1 cup of coffee (120mg) vs 1 can (160mg) at 2 cans/day (1 can = 43200s)
      // 0.75 * 43200 = 32400 seconds (9 hours)
      const result = calculateRelapsePenalty(quit, now, 1, 2, 'coffee', 0);

      expect(result.isTotalReset).toBe(false);
      expect(result.penaltySeconds).toBe(32400);
      expect(result.newQuitTimestamp).toBe(quit + 32400 * 1000);
    });
  });
});
