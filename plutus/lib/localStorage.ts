

// Type for storage operations
type StorageType = 'session' | 'local';

// Check if code is running on client side
const isBrowser = (): boolean => typeof window !== 'undefined';

// Get item from storage
export function getStorageItem<T>(key: string, storageType: StorageType = 'local'): T | null {
  if (!isBrowser()) return null;
  
  try {
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting ${storageType} storage item:`, error);
    return null;
  }
}

// Set item in storage
export function setStorageItem<T>(key: string, value: T, storageType: StorageType = 'local'): void {
  if (!isBrowser()) return;
  
  try {
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${storageType} storage item:`, error);
  }
}

// Remove item from storage
export function removeStorageItem(key: string, storageType: StorageType = 'local'): void {
  if (!isBrowser()) return;
  
  try {
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${storageType} storage item:`, error);
  }
}