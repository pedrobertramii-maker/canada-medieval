'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin } from './api';
import { api } from './api';

interface AuthState {
  admin: Admin | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      loading: false,
      login: async (username, password) => {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/login', { username, password });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          set({ admin: data.admin, loading: false });
        } catch (e) {
          set({ loading: false });
          throw e;
        }
      },
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ admin: null });
      },
      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ admin: data.admin });
        } catch {
          set({ admin: null });
        }
      },
    }),
    {
      name: 'canada-auth',
      partialize: (s) => ({ admin: s.admin }),
    }
  )
);
