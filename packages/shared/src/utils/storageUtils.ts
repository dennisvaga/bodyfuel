"use client";

/**
 * Load form data from localStorage
 * @param key
 * @returns
 */
export const loadFormDataFromLocalStorage = <T>(key: string): T | null => {
  const savedData = localStorage.getItem(key);

  if (!savedData) return null;

  try {
    return JSON.parse(savedData) as T;
  } catch (err) {
    console.error(`Failed to parse saved form data for key: ${key}`, err);
    return null;
  }
};

/**
 *  Save form data to localStorage
 * @param key
 * @param data
 */
export const saveFormDataToLocalStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Clear form data from localStorage
 * @param key
 */
export const clearFormDataFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};
