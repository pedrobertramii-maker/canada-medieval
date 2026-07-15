'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface MinecraftSkinProps {
  nick: string;
  size?: number;
  className?: string;
  type?: 'avatar' | 'head' | 'body';
  rounded?: boolean;
}

const SKIN_PROVIDERS: Record<string, { avatar: (n: string, s: number) => string; head: (n: string, s: number) => string; body: (n: string, s: number) => string }> = {
  crafatar: {
    avatar: (n, s) => `https://crafatar.com/avatars/${n}?size=${s}&overlay`,
    head: (n, s) => `https://crafatar.com/renders/head/${n}?scale=10&overlay`,
    body: (n, s) => `https://crafatar.com/renders/body/${n}?scale=${Math.max(2, Math.floor(s / 40))}&overlay`,
  },
  mineatar: {
    avatar: (n, s) => `https://mineatar.io/armor/body/${n}/${s}`,
    head: (n, s) => `https://mineatar.io/armor/head/${n}/${s}`,
    body: (n, s) => `https://mineatar.io/armor/body/${n}/${s}`,
  },
  'mc-heads': {
    avatar: (n, s) => `https://mc-heads.net/avatar/${n}/${s}`,
    head: (n, s) => `https://mc-heads.net/head/${n}/${s}`,
    body: (n, s) => `https://mc-heads.net/body/${n}/${s}`,
  },
  minotar: {
    avatar: (n, s) => `https://minotar.net/helm/${n}/${s}.png`,
    head: (n, s) => `https://minotar.net/armor/head/${n}/${s}.png`,
    body: (n, s) => `https://minotar.net/armor/body/${n}/${s}.png`,
  },
};

export default function MinecraftSkin({ nick, size = 256, className, type = 'avatar', rounded = true }: MinecraftSkinProps) {
  const providerName = (process.env.NEXT_PUBLIC_SKIN_API as keyof typeof SKIN_PROVIDERS) || 'crafatar';
  const provider = SKIN_PROVIDERS[providerName] || SKIN_PROVIDERS.crafatar;
  const src = provider[type](nick, size);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', rounded && 'rounded-sm', className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-wood-700/50">
          <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
        </div>
      )}
      {errored ? (
        <div className="absolute inset-0 flex items-center justify-center bg-wood-700 text-parchment-200/60 text-xs font-mono">
          {nick.substring(0, 3)}
        </div>
      ) : (
        <Image
          src={src}
          alt={`Skin de ${nick}`}
          width={size}
          height={size}
          unoptimized
          className={cn('w-full h-full object-cover', rounded && 'rounded-sm')}
          onLoad={() => setLoading(false)}
          onError={() => { setErrored(true); setLoading(false); }}
        />
      )}
    </div>
  );
}
