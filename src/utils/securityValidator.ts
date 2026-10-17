import { UserProfile, DailyCheckIn } from '../types';

/**
 * Validates and sanitizes a raw user profile against tampering, NaN values,
 * prototype pollution, and out-of-bounds numeric inputs.
 */
export function sanitizeUserProfile(data: unknown): UserProfile | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null;
  }

  const raw = data as Record<string, unknown>;

  // Prevent prototype pollution
  if (
    Object.prototype.hasOwnProperty.call(raw, '__proto__') ||
    Object.prototype.hasOwnProperty.call(raw, 'constructor') ||
    Object.prototype.hasOwnProperty.call(raw, 'prototype')
  ) {
    // Treat as tainted, strip or ignore prototype keys
  }

  // 1. Validate & sanitize quitDate
  let quitDate: string;
  if (typeof raw.quitDate === 'string') {
    const parsed = new Date(raw.quitDate).getTime();
    quitDate = isNaN(parsed) ? new Date().toISOString() : new Date(raw.quitDate).toISOString();
  } else {
    quitDate = new Date().toISOString();
  }

  // 2. Validate & sanitize cansPerDay (bounded 0 to 50)
  let cansPerDay = Number(raw.cansPerDay);
  if (isNaN(cansPerDay) || !isFinite(cansPerDay)) {
    cansPerDay = 2; // Default
  } else {
    cansPerDay = Math.max(0, Math.min(50, Math.round(cansPerDay)));
  }

  // 3. Validate & sanitize coffeePerDay (bounded 0 to 50)
  let coffeePerDay = Number(raw.coffeePerDay);
  if (isNaN(coffeePerDay) || !isFinite(coffeePerDay)) {
    coffeePerDay = 1;
  } else {
    coffeePerDay = Math.max(0, Math.min(50, Math.round(coffeePerDay)));
  }

  // 4. Validate & sanitize isSugarFree (boolean)
  const isSugarFree = Boolean(raw.isSugarFree);

  // 5. Validate & sanitize costPerPortion (bounded 1 to 10,000)
  let costPerPortion = Number(raw.costPerPortion);
  if (isNaN(costPerPortion) || !isFinite(costPerPortion) || costPerPortion <= 0) {
    costPerPortion = 130; // Default
  } else {
    costPerPortion = Math.max(1, Math.min(10000, Math.round(costPerPortion)));
  }

  // 6. isOnboarded flag
  const isOnboarded = Boolean(raw.isOnboarded);

  // Return a clean plain object
  return {
    quitDate,
    cansPerDay,
    coffeePerDay,
    isSugarFree,
    costPerPortion,
    isOnboarded,
  };
}

/**
 * Validates and sanitizes daily check-in entries from storage.
 */
export function sanitizeCheckIns(data: unknown): DailyCheckIn[] {
  if (!Array.isArray(data)) {
    return [];
  }

  const sanitized: DailyCheckIn[] = [];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  for (const item of data) {
    if (!item || typeof item !== 'object') continue;

    const raw = item as Record<string, unknown>;

    // Must have a valid YYYY-MM-DD date
    if (typeof raw.date !== 'string' || !dateRegex.test(raw.date)) {
      continue;
    }

    // Timestamp
    let timestamp = Number(raw.timestamp);
    if (isNaN(timestamp) || !isFinite(timestamp)) {
      timestamp = Date.now();
    }

    // Clamp ratings strictly between 1 and 5
    const clampRating = (val: unknown, fallback: number): number => {
      const num = Number(val);
      if (isNaN(num) || !isFinite(num)) return fallback;
      return Math.max(1, Math.min(5, Math.round(num)));
    };

    const energy = clampRating(raw.energy, 3);
    const sleep = clampRating(raw.sleep, 3);
    const craving = clampRating(raw.craving, 3);

    sanitized.push({
      date: raw.date,
      timestamp,
      energy,
      sleep,
      craving,
    });
  }

  return sanitized;
}
