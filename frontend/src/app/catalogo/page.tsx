'use client';

import { Suspense, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { api, Product, Category } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';

const sorts = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'name', label: 'Nome' },
];

function CatalogoContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(searchParams.get('categoria') || '');
  const [sort, setSort] = useState('recent');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data,
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', search, category, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (sort) params.set('sort', sort);
      return (await api.get(`/products?${params}`)).data;
    },
  });

  useEffect(() => {
    const c = searchParams.get('categoria');
    if (c) setCategory(c);
  }, [searchParams]);

  const products: Product[] = productsData?.products || [];
  const categories: Category[] = categoriesData?.categories || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-semibold mb-1">Catálogo</h1>
        <p className="text-muted text-sm">Todos os itens do reino.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-base md:w-48"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setCategory('')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            !category ? 'bg-accent text-black' : 'bg-card text-muted hover:text-text border border-border'
          )}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              category === cat.id ? 'bg-accent text-black' : 'bg-card text-muted hover:text-text border border-border'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card-base aspect-square animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted">Nenhum item encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-muted">
        Carregando...
      </div>
    }>
      <CatalogoContent />
    </Suspense>
  );
}
