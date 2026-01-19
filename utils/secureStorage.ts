// utils/secureStorage.ts
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Get a value from secure storage (cross-platform)
 * @param key string
 * @returns string | null
 */
export const storeGetItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
};

/**
 * Set a value in secure storage (cross-platform)
 * @param key string
 * @param value string
 */
export const storeSetItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

/**
 * Delete a value from secure storage (cross-platform)
 * @param key string
 */
export const storeDeleteItem = async (key: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};