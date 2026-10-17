import { UserProfile, DailyCheckIn } from '../types';
import { TaperPlan, ConsumptionEntry } from './taper';

export const CURRENT_SCHEMA_VERSION = 2;

export interface BackupDataV2 {
  profile: UserProfile;
  checkIns: DailyCheckIn[];
  taperPlan?: TaperPlan;
  consumptionLog?: ConsumptionEntry[];
}

export type BackupData = BackupDataV2;

export interface BackupPayloadV2 {
  schemaVersion: number;
  exportedAt: string;
  data: BackupDataV2;
}

export type ValidationResult =
  | {
      success: true;
      data: BackupDataV2;
      preview: {
        checkInsCount: number;
        quitDate: string;
        cansPerDay: number;
        exportedAt: string;
        hasTaperPlan: boolean;
        consumptionEntriesCount: number;
      };
    }
  | {
      success: false;
      error: string;
    };

/**
 * Checks for prototype pollution keys in an object hierarchy.
 */
export function hasPrototypePollution(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false;

  const raw = obj as Record<string, unknown>;

  if (
    Object.prototype.hasOwnProperty.call(raw, '__proto__') ||
    Object.prototype.hasOwnProperty.call(raw, 'constructor') ||
    Object.prototype.hasOwnProperty.call(raw, 'prototype')
  ) {
    return true;
  }

  for (const key of Object.keys(raw)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return true;
    }
    const val = raw[key];
    if (typeof val === 'object' && val !== null) {
      if (hasPrototypePollution(val)) {
        return true;
      }
    }
  }

  return false;
}

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

/**
 * Validates and sanitizes caffeine consumption log entries.
 */
export function sanitizeConsumptionLog(data: unknown): ConsumptionEntry[] {
  if (!Array.isArray(data)) return [];
  const sanitized: ConsumptionEntry[] = [];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const validTypes = ['energy', 'coffee', 'tea', 'other'];

  for (const item of data) {
    if (!item || typeof item !== 'object') continue;
    const raw = item as Record<string, unknown>;

    if (typeof raw.date !== 'string' || !dateRegex.test(raw.date)) continue;

    const id =
      typeof raw.id === 'string' && raw.id.trim()
        ? raw.id.trim()
        : Math.random().toString(36).slice(2);
    const timestamp =
      Number(raw.timestamp) && isFinite(Number(raw.timestamp)) ? Number(raw.timestamp) : Date.now();
    const type =
      typeof raw.type === 'string' && validTypes.includes(raw.type)
        ? (raw.type as 'energy' | 'coffee' | 'tea' | 'other')
        : 'other';
    const title =
      typeof raw.title === 'string' && raw.title.trim()
        ? raw.title.trim().slice(0, 80)
        : 'Напиток';
    const volumeMl = Math.max(1, Math.min(5000, Math.round(Number(raw.volumeMl) || 250)));
    const caffeineMg = Math.max(0, Math.min(2000, Math.round(Number(raw.caffeineMg) || 80)));

    sanitized.push({
      id,
      timestamp,
      date: raw.date,
      type,
      title,
      volumeMl,
      caffeineMg,
    });
  }
  return sanitized;
}

/**
 * Validates and sanitizes a tapering plan object.
 */
export function sanitizeTaperPlan(data: unknown): TaperPlan {
  const fallback: TaperPlan = {
    isActive: false,
    startDate: new Date().toISOString(),
    durationDays: 14,
    startDailyMg: 300,
    targetDailyMg: 0,
  };

  if (!data || typeof data !== 'object' || Array.isArray(data)) return fallback;
  const raw = data as Record<string, unknown>;

  const isActive = Boolean(raw.isActive);
  let startDate: string;
  if (typeof raw.startDate === 'string') {
    const parsed = new Date(raw.startDate).getTime();
    startDate = isNaN(parsed) ? new Date().toISOString() : new Date(raw.startDate).toISOString();
  } else {
    startDate = new Date().toISOString();
  }

  const durationDays = Math.max(3, Math.min(90, Math.round(Number(raw.durationDays) || 14)));
  const startDailyMg = Math.max(50, Math.min(2000, Math.round(Number(raw.startDailyMg) || 300)));
  const targetDailyMg = Math.max(0, Math.min(startDailyMg, Math.round(Number(raw.targetDailyMg) || 0)));

  return {
    isActive,
    startDate,
    durationDays,
    startDailyMg,
    targetDailyMg,
  };
}

/**
 * Serializes current user profile, check-ins, taper plan, and consumption log into JSON backup.
 */
export function serializeExportData(
  profile: UserProfile | null,
  checkIns: DailyCheckIn[],
  taperPlan?: TaperPlan,
  consumptionLog?: ConsumptionEntry[]
): string {
  const payload: BackupPayloadV2 = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      profile: profile || {
        quitDate: new Date().toISOString(),
        cansPerDay: 2,
        coffeePerDay: 1,
        isSugarFree: false,
        costPerPortion: 130,
        isOnboarded: false,
      },
      checkIns: checkIns || [],
      taperPlan: taperPlan ? sanitizeTaperPlan(taperPlan) : undefined,
      consumptionLog: consumptionLog ? sanitizeConsumptionLog(consumptionLog) : undefined,
    },
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Validates raw import input (JSON string or parsed object).
 * Sanitizes against prototype pollution and clamps all numeric values.
 * Supports backward-compatible migration from schemaVersion 1 to 2.
 */
export function validateImportPayload(rawInput: unknown): ValidationResult {
  let parsed: unknown;

  if (typeof rawInput === 'string') {
    try {
      parsed = JSON.parse(rawInput);
    } catch {
      return {
        success: false,
        error: 'Некорректный формат JSON файла. Проверьте целостность файла.',
      };
    }
  } else {
    parsed = rawInput;
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      success: false,
      error: 'Файл не содержит валидного объекта резервной копии.',
    };
  }

  // Check prototype pollution before reading deeper
  if (hasPrototypePollution(parsed)) {
    return {
      success: false,
      error: 'Обнаружена попытка внедрения недопустимых системных свойств (Prototype Pollution). Импорт отклонён в целях безопасности.',
    };
  }

  const root = parsed as Record<string, unknown>;

  // Check schemaVersion
  const schemaVersion = Number(root.schemaVersion);
  if (!root.schemaVersion || isNaN(schemaVersion) || !isFinite(schemaVersion) || schemaVersion <= 0) {
    return {
      success: false,
      error: 'Отсутствует или повреждена версия схемы (schemaVersion).',
    };
  }

  if (schemaVersion > CURRENT_SCHEMA_VERSION) {
    return {
      success: false,
      error: `Версия схемы резервной копии (${schemaVersion}) новее поддерживаемой текущей версией приложения (${CURRENT_SCHEMA_VERSION}). Пожалуйста, обновите ZeroSurge.`,
    };
  }

  // Check data section
  if (!root.data || typeof root.data !== 'object' || Array.isArray(root.data)) {
    return {
      success: false,
      error: 'В файле отсутствуют корректные данные резервной копии (секция data).',
    };
  }

  const dataObj = root.data as Record<string, unknown>;

  // Sanitize profile
  const sanitizedProfile = sanitizeUserProfile(dataObj.profile);
  if (!sanitizedProfile) {
    return {
      success: false,
      error: 'В резервной копии не найден валидный профиль пользователя.',
    };
  }

  // Sanitize check-ins
  const sanitizedCheckIns = sanitizeCheckIns(dataObj.checkIns);

  // Sanitize taperPlan & consumptionLog (backward compatible migration for schemaVersion 1)
  const sanitizedTaperPlan = dataObj.taperPlan ? sanitizeTaperPlan(dataObj.taperPlan) : undefined;
  const sanitizedConsumptionLog = dataObj.consumptionLog ? sanitizeConsumptionLog(dataObj.consumptionLog) : [];

  const exportedAt =
    typeof root.exportedAt === 'string' && !isNaN(new Date(root.exportedAt).getTime())
      ? root.exportedAt
      : new Date().toISOString();

  return {
    success: true,
    data: {
      profile: sanitizedProfile,
      checkIns: sanitizedCheckIns,
      taperPlan: sanitizedTaperPlan,
      consumptionLog: sanitizedConsumptionLog,
    },
    preview: {
      checkInsCount: sanitizedCheckIns.length,
      quitDate: sanitizedProfile.quitDate,
      cansPerDay: sanitizedProfile.cansPerDay,
      exportedAt,
      hasTaperPlan: Boolean(sanitizedTaperPlan?.isActive),
      consumptionEntriesCount: sanitizedConsumptionLog.length,
    },
  };
}

/**
 * Initiates client-side file download via standard DOM Blob URL.
 */
export function triggerFileDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
