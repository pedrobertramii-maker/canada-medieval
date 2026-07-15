'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Owner } from '@/lib/api';
import { Plus, Pencil, Trash2, X, Loader2, Crown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import MinecraftSkin from '@/components/MinecraftSkin';
import toast from 'react-hot-toast';

export default function AdminDonos() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Owner | null>(null);
  const [creating, setCreating] = useState(false);

  const { data } = useQuery({
    queryKey: ['admin-owners'],
    queryFn: async () => (await api.get('/owners/admin/all')).data,
  });

  const del = useMutation({
    mutationFn: async (id: string) => api.delete(`/owners/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-owners'] });
      qc.invalidateQueries({ queryKey: ['owners'] });
      toast.success('Dono removido');
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-medieval text-3xl font-bold text-gold-glow">Donos da Loja</h1>
          <p className="text-parchment-200/70 text-sm mt-1">Os lordes do reino. A skin é carregada automaticamente pelo nick do Minecraft.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-medieval">
          <Plus className="w-4 h-4" /> Novo Dono
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.owners?.map((o: Owner) => (
          <div key={o.id} className="card-medieval p-5 flex gap-4">
            <div className="w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden">
              <MinecraftSkin nick={o.minecraftNick} size={120} type="head" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-medieval text-gold-300 tracking-widest uppercase">{o.role}</span>
              </div>
              <h3 className="font-medieval text-xl text-parchment-50">{o.name}</h3>
              <p className="text-xs text-parchment-200/60 font-mono">@{o.minecraftNick} • #{o.order}</p>
              <p className="text-sm text-parchment-200/80 mt-2 line-clamp-2">{o.description}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => setEditing(o)} className="p-2 hover:bg-gold-500/20 rounded text-gold-300"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm('Remover?')) del.mutate(o.id); }} className="p-2 hover:bg-maple-500/20 rounded text-maple-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <OwnerForm owner={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      )}
    </div>
  );
}

function OwnerForm({ owner, onClose }: { owner: Owner | null; onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: owner ? {
      name: owner.name, minecraftNick: owner.minecraftNick, role: owner.role,
      description: owner.description, order: owner.order, isActive: owner.isActive,
    } : { order: 99, isActive: true },
  });
  const watchedNick = watch('minecraftNick');

  const submit = useMutation({
    mutationFn: async (data: any) => {
      if (owner) return api.put(`/owners/${owner.id}`, data);
      return api.post('/owners', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-owners'] });
      qc.invalidateQueries({ queryKey: ['owners'] });
      toast.success('Salvo');
      onClose();
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
      <div className="card-medieval w-full max-w-2xl p-6 my-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-medieval text-2xl text-gold-glow">{owner ? 'Editar' : 'Novo'} Dono</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-parchment-200" /></button>
        </div>
        <div className="grid md:grid-cols-[140px_1fr] gap-5">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-sm overflow-hidden border-2 border-gold-500/40 mb-2">
              <MinecraftSkin nick={watchedNick || 'Steve'} size={150} type="head" />
            </div>
            <p className="text-xs text-parchment-200/60 font-medieval">Preview da Skin</p>
          </div>
          <form onSubmit={handleSubmit((d) => submit.mutate(d))} className="space-y-3">
            <div><label className="label">Nome *</label><input {...register('name', { required: true })} className="input-medieval" placeholder="Ketelez" /></div>
            <div><label className="label">Nick do Minecraft *</label><input {...register('minecraftNick', { required: true })} className="input-medieval" placeholder="Ketelez" /></div>
            <div><label className="label">Cargo *</label><input {...register('role', { required: true })} className="input-medieval" placeholder="Fundador & Rei" /></div>
            <div><label className="label">Descrição *</label><textarea {...register('description', { required: true })} className="input-medieval min-h-[100px]" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Ordem</label><input type="number" {...register('order')} className="input-medieval" /></div>
              <label className="flex items-center gap-2 mt-7"><input type="checkbox" {...register('isActive')} className="w-5 h-5 accent-gold-500" /> <span className="text-parchment-100">Ativo</span></label>
            </div>
            <div className="flex gap-3 pt-3">
              <button type="button" onClick={onClose} className="btn-medieval-secondary flex-1">Cancelar</button>
              <button type="submit" disabled={submit.isPending} className="btn-medieval flex-1">
                {submit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
