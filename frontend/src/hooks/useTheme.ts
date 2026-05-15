import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

type ThemeListener = (dark: boolean) => void;
let listeners: ThemeListener[] = [];

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
}

function readInitial(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark') return true;
  if (saved === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useTheme(): [boolean, (dark: boolean) => void] {
  const [dark, setDark] = useState<boolean>(readInitial);

  useEffect(() => {
    const listener: ThemeListener = (value) => setDark(value);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const setTheme = (value: boolean) => {
    applyTheme(value);
    localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light');
    listeners.forEach((l) => l(value));
  };

  return [dark, setTheme];
}
