'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Product, Category } from '@/lib/api';
import { Plus, Pencil, Trash2, X, Loader2, ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

export default function AdminProdutos() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const { data } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => (await api.get('/products/admin/all')).data,
  });
  const { data: cats } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data,
  });

  const del = useMutation({
    mutationFn: async (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Produto removido');
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-medieval text-3xl font-bold text-gold-glow">Produtos</h1>
          <p className="text-parchment-200/70 text-sm mt-1">Gerencie os itens do catálogo</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-medieval">
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.products?.map((p: Product) => (
          <div key={p.id} className="card-medieval overflow-hidden group">
            <div className="relative aspect-square bg-wood-800">
              <Image src={p.imageUrl} alt={p.name} fill unoptimized className="object-cover" />
            </div>
            <div className="p-4">
              <span className="text-[10px] font-medieval tracking-widest uppercase text-gold-300">
                {p.category?.name}
              </span>
              <h3 className="font-medieval text-lg text-parchment-50 mt-1 line-clamp-1">{p.name}</h3>
              <p className="text-xs text-parchment-200/60 line-clamp-2 mt-1 h-8">{p.description}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="font-medieval text-xl text-gold-300">{formatPrice(p.price)}</div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(p)} className="p-2 hover:bg-gold-500/20 rounded text-gold-300" title="Editar">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (confirm('Remover produto?')) del.mutate(p.id); }} className="p-2 hover:bg-maple-500/20 rounded text-maple-400" title="Excluir">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data?.products?.length === 0 && (
        <div className="card-medieval p-12 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-parchment-200/30 mb-3" />
          <p className="text-parchment-200/60 font-medieval">Nenhum produto. Crie o primeiro!</p>
        </div>
      )}

      {(creating || editing) && (
        <ProductForm
          product={editing}
          categories={cats?.categories || []}
          onClose={() => { setCreating(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, categories, onClose }: { product: Product | null; categories: Category[]; onClose: () => void }) {
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product ? {
      name: product.name, description: product.description,
      price: product.price, oldPrice: product.oldPrice || '',
      categoryId: product.categoryId, stock: product.stock || '',
      featured: product.featured, status: product.status,
    } : { status: 'ACTIVE', featured: false },
  });

  const submit = useMutation({
    mutationFn: async (data: any) => {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]: any) => {
        if (v !== '' && v !== null && v !== undefined) form.append(k, v);
      });
      if (file) form.append('image', file);
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (product) return api.put(`/products/${product.id}`, form, config);
      return api.post('/products', form, config);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success(product ? 'Produto atualizado' : 'Produto criado');
      onClose();
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
      <div className="card-medieval w-full max-w-2xl p-6 my-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-medieval text-2xl text-gold-glow">{product ? 'Editar' : 'Novo'} Produto</h2>
          <button onClick={onClose} className="p-2 text-parchment-200 hover:text-gold-300"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit((d) => submit.mutate(d))} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="label">Nome *</label>
            <input {...register('name', { required: true })} className="input-medieval" />
          </div>
          <div>
            <label className="label">Descrição *</label>
            <textarea {...register('description', { required: true })} className="input-medieval min-h-[100px]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Preço *</label>
              <input type="number" step="0.01" {...register('price', { required: true })} className="input-medieval" />
            </div>
            <div>
              <label className="label">Preço antigo</label>
              <input type="number" step="0.01" {...register('oldPrice')} className="input-medieval" />
            </div>
            <div>
              <label className="label">Categoria *</label>
              <select {...register('categoryId', { required: true })} className="input-medieval">
                <option value="">Selecione...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Estoque</label>
              <input type="number" {...register('stock')} className="input-medieval" placeholder="Ilimitado" />
            </div>
          </div>
          <div>
            <label className="label">Imagem {!product && '*'}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="input-medieval file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-gold-500 file:text-wood-900 file:font-medieval file:rounded-sm file:cursor-pointer"
            />
            {product && !file && <p className="text-xs text-parchment-200/50 mt-1">Deixe vazio para manter a imagem atual</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input-medieval">
                <option value="ACTIVE">Ativo</option>
                <option value="INACTIVE">Inativo</option>
                <option value="OUT_OF_STOCK">Sem estoque</option>
              </select>
            </div>
            <label className="flex items-center gap-2 mt-7">
              <input type="checkbox" {...register('featured')} className="w-5 h-5 accent-gold-500" />
              <span className="text-parchment-100">Em destaque</span>
            </label>
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
  );
}
