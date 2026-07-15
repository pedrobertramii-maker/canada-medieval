'use client';

import { useQuery } from '@tanstack/react-query';
import { api, Owner } from '@/lib/api';
import MinecraftSkin from '@/components/MinecraftSkin';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function EquipePage() {
  const { data } = useQuery({
    queryKey: ['owners'],
    queryFn: async () => (await api.get('/owners')).data,
  });

  const [view, setView] = useState<'3d' | 'avatar'>('3d');
  const owners: Owner[] = data?.owners || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-semibold mb-1">Equipe</h1>
        <p className="text-muted text-sm">Quem cuida da loja do Canadá.</p>
      </div>

      <div className="flex gap-1 mb-8 bg-card border border-border rounded-md p-1 w-fit">
        <button
          onClick={() => setView('3d')}
          className={cn('px-3 py-1.5 text-sm rounded transition-colors', view === '3d' ? 'bg-accent text-black' : 'text-muted hover:text-text')}
        >
          3D
        </button>
        <button
          onClick={() => setView('avatar')}
          className={cn('px-3 py-1.5 text-sm rounded transition-colors', view === 'avatar' ? 'bg-accent text-black' : 'text-muted hover:text-text')}
        >
          Avatar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {owners.map((owner) => (
          <div key={owner.id} className="card-base overflow-hidden">
            <div className="grid grid-cols-[160px_1fr]">
              <div className="bg-surface flex items-center justify-center p-4 border-r border-border">
                <MinecraftSkin
                  nick={owner.minecraftNick}
                  size={200}
                  type={view === '3d' ? 'body' : 'head'}
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-accent mb-1">{owner.role}</p>
                <h2 className="font-display text-xl font-semibold mb-1">{owner.name}</h2>
                <p className="text-xs text-muted mb-3 font-mono">@{owner.minecraftNick}</p>
                <p className="text-sm text-muted leading-relaxed">{owner.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
