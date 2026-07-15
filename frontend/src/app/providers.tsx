'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import LoadingScreen from '@/components/LoadingScreen';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 } },
  }));
  const { theme } = useTheme();
  const { fetchMe } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('canada-auth');
      if (stored) fetchMe();
    }
  }, [fetchMe]);

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2A1A0D',
            color: '#F5EBD3',
            border: '2px solid #8B5A2B',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.95rem',
            borderRadius: '4px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          },
          success: { iconTheme: { primary: '#E6B84F', secondary: '#1B1108' } },
          error: { iconTheme: { primary: '#B3392C', secondary: '#F5EBD3' } },
        }}
      />
    </QueryClientProvider>
  );
}
