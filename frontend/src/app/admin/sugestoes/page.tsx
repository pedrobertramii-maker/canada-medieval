'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Suggestion } from '@/lib/api';
import { Trash2, Check, CheckCheck, X, Loader2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate, relativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

const STATUS = [
  { value: '', label: 'Todas' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'READ', label: 'Lidas' },
  { value: 'APPROVED', label: 'Aprovadas' },
  { value: 'IMPLEMENTED', label: 'Implementadas' },
  { value: 'REJECTED', label: 'Rejeitadas' },
];

export default function AdminSugestoes() {
  const qc = useQueryClient();
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<Suggestion | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-suggestions', status],
    queryFn: async () => (await api.get(`/suggestions/admin/all?status=${status}`)).data,
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: any) => api.patch(`/suggestions/admin/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-suggestions'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Status atualizado');
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => api.delete(`/suggestions/admin/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-suggestions'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Sugestão removida');
      setSelected(null);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-medieval text-3xl font-bold text-gold-glow">Sugestões</h1>
        <p className="text-parchment-200/70 text-sm mt-1">Caixa de entrada do reino</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUS.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={cn(
              'px-4 py-2 font-medieval text-sm tracking-wider rounded-sm transition-colors',
              status === s.value ? 'bg-gold-500 text-wood-900' : 'bg-wood-800/60 text-parchment-200 hover:bg-wood-700/60'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-parchment-200/50">Carregando...</div>
        ) : data?.items?.length === 0 ? (
          <div className="card-medieval p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-parchment-200/30 mb-3" />
            <p className="text-parchment-200/60 font-medieval">Nenhuma sugestão</p>
          </div>
        ) : (
          data?.items?.map((s: Suggestion) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className={cn(
                'w-full text-left card-medieval p-4 hover:border-gold-400 transition-colors',
                s.status === 'PENDING' && 'border-gold-500/40'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medieval text-base text-parchment-50">{s.title}</h3>
                    {s.status === 'PENDING' && <span className="w-2 h-2 bg-gold-400 rounded-full" />}
                  </div>
                  <p className="text-sm text-parchment-200/70 line-clamp-2">{s.description}</p>
                  <p className="text-xs text-parchment-200/50 mt-1">
                    por {s.name} • {relativeTime(s.createdAt)} • {formatDate(s.createdAt)}
                  </p>
                </div>
                <span className={cn(
                  'text-[10px] font-medieval px-2 py-0.5 rounded flex-shrink-0',
                  s.status === 'PENDING' && 'bg-gold-500/20 text-gold-300',
                  s.status === 'READ' && 'bg-blue-500/20 text-blue-300',
                  s.status === 'APPROVED' && 'bg-forest-500/20 text-forest-400',
                  s.status === 'REJECTED' && 'bg-maple-500/20 text-maple-400',
                  s.status === 'IMPLEMENTED' && 'bg-purple-500/20 text-purple-300',
                )}>
                  {s.status}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto" onClick={() => setSelected(null)}>
          <div className="card-medieval w-full max-w-2xl p-6 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-medieval text-2xl text-gold-glow">{selected.title}</h2>
                <p className="text-sm text-parchment-200/60 mt-1">
                  {selected.name} {selected.discord && `• ${selected.discord}`} • {formatDate(selected.createdAt)}
                </p>
              </div>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-parchment-200" /></button>
            </div>
            <div className="bg-wood-800/60 p-4 rounded-sm border border-wood-400/30 mb-4 max-h-80 overflow-y-auto">
              <p className="text-parchment-100 whitespace-pre-wrap">{selected.description}</p>
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              {selected.status === 'PENDING' && (
                <button onClick={() => { update.mutate({ id: selected.id, status: 'READ' }); setSelected({...selected, status: 'READ'}); }} className="btn-medieval-secondary !py-2 !text-xs !px-3">
                  <Check className="w-3.5 h-3.5" /> Marcar como lida
                </button>
              )}
              <button onClick={() => { update.mutate({ id: selected.id, status: 'APPROVED' }); setSelected({...selected, status: 'APPROVED'}); }} className="btn-medieval !py-2 !text-xs !px-3 !bg-gradient-to-b !from-forest-400 !to-forest-500 !border-forest-300 !text-parchment-50">
                <CheckCheck className="w-3.5 h-3.5" /> Aprovar
              </button>
              <button onClick={() => { update.mutate({ id: selected.id, status: 'IMPLEMENTED' }); setSelected({...selected, status: 'IMPLEMENTED'}); }} className="btn-medieval !py-2 !text-xs !px-3 !bg-gradient-to-b !from-purple-500 !to-purple-600 !border-purple-300 !text-parchment-50">
                Implementada
              </button>
              <button onClick={() => { update.mutate({ id: selected.id, status: 'REJECTED' }); setSelected({...selected, status: 'REJECTED'}); }} className="btn-medieval !py-2 !text-xs !px-3 !bg-gradient-to-b !from-maple-400 !to-maple-500 !border-maple-300 !text-parchment-50">
                Rejeitar
              </button>
              <button onClick={() => { if (confirm('Excluir?')) del.mutate(selected.id); }} className="btn-medieval !py-2 !text-xs !px-3 !bg-gradient-to-b !from-wood-600 !to-wood-700 !border-wood-400 !text-parchment-100">
                <Trash2 className="w-3.5 h-3.5" /> Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
