'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Crown, Users, Swords } from 'lucide-react';
import { api, Owner } from '@/lib/api';
import MinecraftSkin from '@/components/MinecraftSkin';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function EquipePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['owners'],
    queryFn: async () => (await api.get('/owners')).data,
  });

  const [view, setView] = useState<'3d' | 'avatar'>('3d');

  return (
    <div>
      <section className="relative py-20 banner-medieval border-b-4 border-gold-500/30">
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gold-400 text-2xl mb-3">👑</div>
          <h1 className="font-medieval text-5xl md:text-6xl font-bold text-gold-glow mb-3">
            Os Lordes do Canadá
          </h1>
          <p className="text-parchment-200/80 max-w-2xl mx-auto text-lg">
            Conheça os mestres que conduzem o reino com honra, glória e dedicação inabalável.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-wood-800/80 border-2 border-wood-400/50 rounded-sm p-1">
            <button
              onClick={() => setView('3d')}
              className={cn('px-5 py-2 font-medieval text-sm tracking-wider rounded-sm transition-colors', view === '3d' ? 'bg-gold-500 text-wood-900' : 'text-parchment-200 hover:text-gold-300')}
            >
              <Swords className="w-4 h-4 inline mr-1" /> Modelo 3D
            </button>
            <button
              onClick={() => setView('avatar')}
              className={cn('px-5 py-2 font-medieval text-sm tracking-wider rounded-sm transition-colors', view === 'avatar' ? 'bg-gold-500 text-wood-900' : 'text-parchment-200 hover:text-gold-300')}
            >
              <Users className="w-4 h-4 inline mr-1" /> Avatar
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="card-medieval p-6 animate-pulse h-96" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(data?.owners || []).map((owner: Owner, i: number) => (
              <motion.div
                key={owner.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-medieval overflow-hidden group"
              >
                <div className="grid grid-cols-[200px_1fr] md:grid-cols-[240px_1fr]">
                  {/* Skin do Minecraft */}
                  <div className="relative bg-gradient-to-br from-wood-700 via-wood-800 to-wood-900 flex items-center justify-center p-4 border-r-2 border-gold-500/30">
                    <div className="absolute inset-0 bg-noise opacity-30" />
                    <div className="relative z-10 w-full">
                      <MinecraftSkin
                        nick={owner.minecraftNick}
                        size={300}
                        type={view === '3d' ? 'body' : 'head'}
                        className="drop-shadow-2xl"
                      />
                    </div>
                    {/* Badge de cargo */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className="px-2.5 py-1 bg-wood-900/90 border border-gold-500/50 rounded-sm backdrop-blur-sm">
                        <span className="text-xs font-medieval text-gold-300 tracking-widest">#{owner.order}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-gold-400" />
                      <span className="text-xs font-medieval text-gold-300 tracking-[0.3em] uppercase">
                        {owner.role}
                      </span>
                    </div>
                    <h2 className="font-medieval text-3xl font-bold text-gold-glow mb-1">
                      {owner.name}
                    </h2>
                    <p className="text-parchment-200/60 text-sm font-mono mb-4">
                      {owner.minecraftNick}
                    </p>
                    <p className="text-parchment-100/90 leading-relaxed text-base">
                      {owner.description}
                    </p>

                    <div className="mt-5 pt-5 border-t border-wood-400/30 flex items-center justify-between">
                      <div className="text-xs text-parchment-200/50 font-medieval tracking-wider">
                        SKIN OFICIAL
                      </div>
                      <MinecraftSkin
                        nick={owner.minecraftNick}
                        size={64}
                        type="head"
                        className="border-2 border-gold-500/40 hover:border-gold-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {data?.owners?.length === 0 && (
          <div className="card-medieval p-16 text-center">
            <Users className="w-16 h-16 mx-auto text-parchment-200/30 mb-4" />
            <h3 className="font-medieval text-2xl text-parchment-100">Equipe em breve</h3>
          </div>
        )}
      </div>
    </div>
  );
}
