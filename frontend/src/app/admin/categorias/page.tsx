'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Category } from '@/lib/api';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function AdminCategorias() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  const { data } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => (await api.get('/categories/admin/all')).data,
  });

  const del = useMutation({
    mutationFn: async (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoria removida');
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-medieval text-3xl font-bold text-gold-glow">Categorias</h1>
          <p className="text-parchment-200/70 text-sm mt-1">Organize o catálogo</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-medieval">
          <Plus className="w-4 h-4" /> Nova Categoria
        </button>
      </div>

      <div className="card-medieval overflow-hidden">
        <table className="w-full">
          <thead className="bg-wood-800/80 border-b-2 border-wood-400/30">
            <tr className="text-left">
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider">Ordem</th>
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider">Nome</th>
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider">Slug</th>
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider">Produtos</th>
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider">Status</th>
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.categories?.map((c: Category) => (
              <tr key={c.id} className="border-b border-wood-400/20 hover:bg-wood-700/30">
                <td className="px-4 py-3 text-parchment-200">{c.order}</td>
                <td className="px-4 py-3 font-medieval text-parchment-100">{c.name}</td>
                <td className="px-4 py-3 text-parchment-200/70 text-sm font-mono">{c.slug}</td>
                <td className="px-4 py-3 text-parchment-200">{c._count?.products || 0}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medieval px-2 py-0.5 rounded ${c.isActive ? 'bg-forest-500/20 text-forest-400' : 'bg-iron-600/40 text-parchment-200/60'}`}>
                    {c.isActive ? 'ATIVA' : 'INATIVA'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(c)} className="p-2 hover:bg-gold-500/20 rounded text-gold-300 inline-block"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm('Remover?')) del.mutate(c.id); }} className="p-2 hover:bg-maple-500/20 rounded text-maple-400 inline-block"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <CategoryForm
          category={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function CategoryForm({ category, onClose }: { category: Category | null; onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: category ? { ...category } : { order: 0, isActive: true },
  });
  const submit = useMutation({
    mutationFn: async (data: any) => {
      if (category) return api.put(`/categories/${category.id}`, data);
      return api.post('/categories', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Salvo');
      onClose();
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="card-medieval w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-medieval text-2xl text-gold-glow">{category ? 'Editar' : 'Nova'} Categoria</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-parchment-200" /></button>
        </div>
        <form onSubmit={handleSubmit((d) => submit.mutate(d))} className="space-y-3">
          <div><label className="label">Nome *</label><input {...register('name', { required: true })} className="input-medieval" /></div>
          <div><label className="label">Descrição</label><input {...register('description')} className="input-medieval" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Cor (hex)</label><input {...register('color')} className="input-medieval" placeholder="#E6B84F" /></div>
            <div><label className="label">Ícone</label><input {...register('icon')} className="input-medieval" placeholder="Crown" /></div>
            <div><label className="label">Ordem</label><input type="number" {...register('order')} className="input-medieval" /></div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('isActive')} className="w-5 h-5 accent-gold-500" />
            <span className="text-parchment-100">Ativa</span>
          </label>
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="btn-medieval-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={submit.isPending} className="btn-medieval flex-1">
              {submit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
