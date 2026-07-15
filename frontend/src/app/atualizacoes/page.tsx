'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { api, UpdatePost } from '@/lib/api';
import UpdateCard from '@/components/UpdateCard';
import { motion } from 'framer-motion';

export default function AtualizacoesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['updates', search, page],
    queryFn: async () => (await api.get(`/updates?search=${search}&page=${page}&limit=9`)).data,
  });

  const items: UpdatePost[] = data?.items || [];
  const pinned = items.filter((u) => u.pinned);
  const others = items.filter((u) => !u.pinned);

  return (
    <div>
      <section className="relative py-20 banner-medieval border-b-4 border-gold-500/30">
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gold-400 text-2xl mb-3">📜</div>
          <h1 className="font-medieval text-5xl md:text-6xl font-bold text-gold-glow mb-3">
            Crônicas do Reino
          </h1>
          <p className="text-parchment-200/80 max-w-2xl mx-auto text-lg">
            Acompanhe as novidades, eventos e decisões importantes do reino do Canadá.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative max-w-xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-parchment-200/50" />
          <input
            type="text"
            placeholder="Buscar atualizações..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-medieval pl-12"
          />
        </div>

        {pinned.length > 0 && (
          <div className="mb-12">
            <h2 className="font-medieval text-2xl text-gold-300 mb-6 flex items-center gap-2">
              <span>📌</span> Fixados
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pinned.map((u) => (
                <UpdateCard key={u.id} update={u} large />
              ))}
            </div>
          </div>
        )}

        <h2 className="font-medieval text-2xl text-gold-300 mb-6">Todas as Notícias</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-medieval animate-pulse h-96" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card-medieval p-16 text-center">
            <Search className="w-16 h-16 mx-auto text-parchment-200/30 mb-4" />
            <h3 className="font-medieval text-2xl text-parchment-100 mb-2">Nenhuma atualização encontrada</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((u) => (
              <UpdateCard key={u.id} update={u} />
            ))}
          </div>
        )}

        {data && data.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-medieval-secondary !py-2 !px-4 !text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="font-medieval text-parchment-200 px-4">
              {page} / {data.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={page === data.pages}
              className="btn-medieval-secondary !py-2 !px-4 !text-sm disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
