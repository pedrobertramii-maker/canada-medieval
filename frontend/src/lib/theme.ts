'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  set: (t: Theme) => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggle: () =>
        set((state) => {
          const next = state.theme === 'dark' ? 'light' : 'dark';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('light', next === 'light');
          }
          return { theme: next };
        }),
      set: (t) =>
        set(() => {
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('light', t === 'light');
          }
          return { theme: t };
        }),
    }),
    { name: 'canada-theme' }
  )
);
