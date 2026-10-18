/**
 * Requests persistent storage from the browser.
 * On mobile WebKit/Safari, non-persistent storage may be pruned after 7 days of inactivity.
 * Persistent storage prevents automated eviction of user check-ins and recovery logs.
 */
export async function enablePersistentStorage(): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.storage?.persist) {
    return false;
  }
  try {
    const isPersisted = await navigator.storage.persisted();
    return isPersisted ? true : await navigator.storage.persist();
  } catch {
    return false;
  }
}
