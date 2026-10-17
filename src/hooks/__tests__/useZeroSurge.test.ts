import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useZeroSurge } from '../useZeroSurge';
import { UserProfile } from '../../types';

describe('useZeroSurge hook (TDD)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  const testProfile: UserProfile = {
    quitDate: '2026-10-16T12:00:00.000Z',
    cansPerDay: 2,
    coffeePerDay: 1,
    isSugarFree: false,
    costPerPortion: 130,
    isOnboarded: true,
  };

  it('starts with profile as null when localStorage is empty', () => {
    const { result } = renderHook(() => useZeroSurge());
    expect(result.current.profile).toBeNull();
  });

  it('provides all 8 achievements even before profile onboarding is completed', () => {
    const { result } = renderHook(() => useZeroSurge());
    expect(result.current.achievements).toHaveLength(8);
    expect(result.current.achievements.every((a) => a.id && a.title)).toBe(true);
  });

  it('loads profile from localStorage and saves profile updates', () => {
    const { result } = renderHook(() => useZeroSurge());

    act(() => {
      result.current.saveProfile(testProfile);
    });

    expect(result.current.profile).toEqual(testProfile);
    const stored = JSON.parse(localStorage.getItem('zerosurge_profile') || '{}');
    expect(stored.cansPerDay).toBe(2);
  });

  it('adds a daily check-in and updates existing check-in for the same day', () => {
    const { result } = renderHook(() => useZeroSurge());

    act(() => {
      result.current.addCheckIn(4, 5, 2);
    });

    expect(result.current.checkIns.length).toBe(1);
    expect(result.current.checkIns[0].energy).toBe(4);
    expect(result.current.checkIns[0].sleep).toBe(5);
    expect(result.current.checkIns[0].craving).toBe(2);

    // Updating check-in on the same date should not create a duplicate
    act(() => {
      result.current.addCheckIn(5, 5, 1);
    });

    expect(result.current.checkIns.length).toBe(1);
    expect(result.current.checkIns[0].energy).toBe(5);
    expect(result.current.checkIns[0].craving).toBe(1);
  });

  it('resets all data cleanly on resetAllData', () => {
    const { result } = renderHook(() => useZeroSurge());

    act(() => {
      result.current.saveProfile(testProfile);
      result.current.addCheckIn(3, 3, 3);
    });

    expect(result.current.profile).not.toBeNull();
    expect(result.current.checkIns.length).toBe(1);

    act(() => {
      result.current.resetAllData();
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.checkIns.length).toBe(0);
    expect(localStorage.getItem('zerosurge_profile')).toBeNull();
    expect(localStorage.getItem('zerosurge_checkins')).toBeNull();
  });

  it('records relapse penalty and shifts quitDate forward when penalty < progress', () => {
    const { result } = renderHook(() => useZeroSurge());
    const thirtySixHoursAgo = new Date(Date.now() - 36 * 3600 * 1000).toISOString();

    act(() => {
      result.current.saveProfile({
        ...testProfile,
        quitDate: thirtySixHoursAgo,
        cansPerDay: 2,
      });
    });

    let penaltyResult: any;
    act(() => {
      penaltyResult = result.current.recordRelapse(1);
    });

    expect(penaltyResult).not.toBeNull();
    expect(penaltyResult.isTotalReset).toBe(false);
    expect(penaltyResult.remainingCansAvoided).toBeCloseTo(2, 1);
    expect(result.current.stats.cansAvoided).toBeCloseTo(2, 1);

    const stored = JSON.parse(localStorage.getItem('zerosurge_profile') || '{}');
    expect(new Date(stored.quitDate).getTime()).toBe(penaltyResult.newQuitTimestamp);
  });

  it('performs total reset on recordRelapse when penalty >= progress', () => {
    const { result } = renderHook(() => useZeroSurge());
    const twelveHoursAgo = new Date(Date.now() - 12 * 3600 * 1000).toISOString(); // 1 can avoided

    act(() => {
      result.current.saveProfile({
        ...testProfile,
        quitDate: twelveHoursAgo,
        cansPerDay: 2,
      });
    });

    let penaltyResult: any;
    act(() => {
      penaltyResult = result.current.recordRelapse(2); // 2 cans > 1 can avoided
    });

    expect(penaltyResult).not.toBeNull();
    expect(penaltyResult.isTotalReset).toBe(true);
    expect(penaltyResult.remainingCansAvoided).toBe(0);
    expect(result.current.stats.cansAvoided).toBeCloseTo(0, 1);
  });
});
