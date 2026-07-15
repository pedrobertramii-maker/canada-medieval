'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, UpdatePost } from '@/lib/api';
import { Plus, Pencil, Trash2, X, Loader2, Pin, ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function AdminAtualizacoes() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<UpdatePost | null>(null);
  const [creating, setCreating] = useState(false);

  const { data } = useQuery({
    queryKey: ['admin-updates'],
    queryFn: async () => (await api.get('/updates?limit=100')).data,
  });

  const del = useMutation({
    mutationFn: async (id: string) => api.delete(`/updates/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-updates'] });
      qc.invalidateQueries({ queryKey: ['updates'] });
      qc.invalidateQueries({ queryKey: ['recent-updates'] });
      toast.success('Atualização removida');
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-medieval text-3xl font-bold text-gold-glow">Atualizações</h1>
          <p className="text-parchment-200/70 text-sm mt-1">Publique notícias no reino</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-medieval">
          <Plus className="w-4 h-4" /> Nova Atualização
        </button>
      </div>

      <div className="space-y-3">
        {data?.items?.map((u: UpdatePost) => (
          <div key={u.id} className="card-medieval p-4 flex gap-4">
            <div className="relative w-24 h-24 rounded overflow-hidden bg-wood-800 flex-shrink-0">
              <Image src={u.imageUrl} alt={u.title} fill unoptimized className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medieval text-lg text-parchment-50 truncate">{u.title}</h3>
                {u.pinned && <Pin className="w-4 h-4 text-gold-400" />}
              </div>
              <p className="text-sm text-parchment-200/60 line-clamp-1">{u.excerpt}</p>
              <p className="text-xs text-parchment-200/50 mt-1">
                {u.author.name} • {formatDate(u.publishedAt)}
              </p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEditing(u)} className="p-2 hover:bg-gold-500/20 rounded text-gold-300 self-center"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm('Remover?')) del.mutate(u.id); }} className="p-2 hover:bg-maple-500/20 rounded text-maple-400 self-center"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <UpdateForm update={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      )}
    </div>
  );
}

function UpdateForm({ update, onClose }: { update: UpdatePost | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit } = useForm({
    defaultValues: update ? {
      title: update.title, excerpt: update.excerpt, content: update.content,
      pinned: update.pinned, published: update.published,
    } : { pinned: false, published: true },
  });
  const submit = useMutation({
    mutationFn: async (data: any) => {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]: any) => {
        if (v !== '' && v !== null && v !== undefined) form.append(k, v);
      });
      if (file) form.append('image', file);
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (update) return api.put(`/updates/${update.id}`, form, config);
      return api.post('/updates', form, config);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-updates'] });
      qc.invalidateQueries({ queryKey: ['updates'] });
      qc.invalidateQueries({ queryKey: ['recent-updates'] });
      toast.success('Salvo');
      onClose();
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
      <div className="card-medieval w-full max-w-3xl p-6 my-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-medieval text-2xl text-gold-glow">{update ? 'Editar' : 'Nova'} Atualização</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-parchment-200" /></button>
        </div>
        <form onSubmit={handleSubmit((d) => submit.mutate(d))} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div><label className="label">Título *</label><input {...register('title', { required: true })} className="input-medieval" /></div>
          <div><label className="label">Resumo *</label><input {...register('excerpt', { required: true })} className="input-medieval" /></div>
          <div><label className="label">Conteúdo *</label><textarea {...register('content', { required: true })} className="input-medieval min-h-[200px]" /></div>
          <div>
            <label className="label">Imagem {!update && '*'}</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="input-medieval file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-gold-500 file:text-wood-900 file:font-medieval file:rounded-sm file:cursor-pointer" />
            {update && !file && <p className="text-xs text-parchment-200/50 mt-1">Vazio = mantém atual</p>}
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" {...register('published')} className="w-5 h-5 accent-gold-500" /> <span className="text-parchment-100">Publicar</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" {...register('pinned')} className="w-5 h-5 accent-gold-500" /> <span className="text-parchment-100">Fixar no topo</span></label>
          </div>
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="btn-medieval-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={submit.isPending} className="btn-medieval flex-1">
              {submit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
