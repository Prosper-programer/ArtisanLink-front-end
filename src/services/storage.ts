import { Platform } from 'react-native';

// In-memory fallback
const memoryStorage = new Map<string, string>();

let asyncStorage: any = null;
try {
  asyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // async-storage will be available once install finishes
}

export const Storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (asyncStorage) {
        return await asyncStorage.getItem(key);
      }
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage.get(key) || null;
    } catch (e) {
      console.warn('Storage.getItem error:', e);
      return memoryStorage.get(key) || null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (asyncStorage) {
        await asyncStorage.setItem(key, value);
        return;
      }
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      memoryStorage.set(key, value);
    } catch (e) {
      console.warn('Storage.setItem error:', e);
      memoryStorage.set(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (asyncStorage) {
        await asyncStorage.removeItem(key);
        return;
      }
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      memoryStorage.delete(key);
    } catch (e) {
      console.warn('Storage.removeItem error:', e);
      memoryStorage.delete(key);
    }
  },
};

export const AUTH_TOKEN_KEY = 'artisanlink_auth_token';
export const AUTH_USER_KEY = 'artisanlink_auth_user';
