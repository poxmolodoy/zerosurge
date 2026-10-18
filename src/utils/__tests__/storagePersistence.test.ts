import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enablePersistentStorage } from '../storagePersistence';

describe('storagePersistence utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when storage is already persisted', async () => {
    const persistedMock = vi.fn().mockResolvedValue(true);
    const persistMock = vi.fn().mockResolvedValue(true);

    Object.defineProperty(navigator, 'storage', {
      value: { persisted: persistedMock, persist: persistMock },
      configurable: true,
      writable: true,
    });

    const result = await enablePersistentStorage();
    expect(result).toBe(true);
    expect(persistedMock).toHaveBeenCalledTimes(1);
    expect(persistMock).not.toHaveBeenCalled();
  });

  it('requests persist when not already persisted and returns result', async () => {
    const persistedMock = vi.fn().mockResolvedValue(false);
    const persistMock = vi.fn().mockResolvedValue(true);

    Object.defineProperty(navigator, 'storage', {
      value: { persisted: persistedMock, persist: persistMock },
      configurable: true,
      writable: true,
    });

    const result = await enablePersistentStorage();
    expect(result).toBe(true);
    expect(persistedMock).toHaveBeenCalledTimes(1);
    expect(persistMock).toHaveBeenCalledTimes(1);
  });

  it('returns false safely when navigator.storage is undefined or throws', async () => {
    const persistedMock = vi.fn().mockRejectedValue(new Error('Storage access denied'));

    Object.defineProperty(navigator, 'storage', {
      value: { persisted: persistedMock, persist: vi.fn() },
      configurable: true,
      writable: true,
    });

    const result = await enablePersistentStorage();
    expect(result).toBe(false);
  });
});
