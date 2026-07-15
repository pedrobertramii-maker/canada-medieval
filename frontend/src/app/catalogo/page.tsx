'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api, Product, Category } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const sorts = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Mais baratos' },
  { value: 'price_desc', label: 'Mais caros' },
  { value: 'name', label: 'Nome (A-Z)' },
];

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(searchParams.get('categoria') || '');
  const [sort, setSort] = useState('recent');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data,
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', search, category, sort, minPrice, maxPrice],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (sort) params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      return (await api.get(`/products?${params}`)).data;
    },
  });

  useEffect(() => {
    const c = searchParams.get('categoria');
    if (c) setCategory(c);
  }, [searchParams]);

  const products: Product[] = productsData?.products || [];
  const categories: Category[] = categoriesData?.categories || [];
  const hasFilters = !!(search || category || minPrice || maxPrice);

  return (
    <div className="relative">
      {/* Hero do catálogo */}
      <section className="relative py-20 banner-medieval border-b-4 border-gold-500/30">
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gold-400 text-2xl mb-3">⚜</div>
          <h1 className="font-medieval text-5xl md:text-6xl font-bold text-gold-glow mb-3">
            Catálogo do Reino
          </h1>
          <p className="text-parchment-200/80 max-w-2xl mx-auto text-lg">
            Tesouros forjados para os aventureiros mais corajosos. Encontre o item perfeito para sua jornada.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Barra de busca + filtros */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-parchment-200/50" />
            <input
              type="text"
              placeholder="Buscar por nome, categoria, descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-medieval pl-12"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment-200/60 hover:text-gold-300">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-medieval md:w-56"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value} className="bg-wood-800">
                {s.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="btn-medieval-secondary md:hidden !py-3"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar de filtros */}
          <aside className={cn('lg:block', filtersOpen ? 'block' : 'hidden')}>
            <div className="card-medieval p-5 sticky top-24">
              <h3 className="font-medieval text-gold-300 tracking-widest mb-4">Filtros</h3>

              <div className="mb-6">
                <h4 className="text-sm font-medieval text-parchment-100 mb-3 tracking-wider">Categoria</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setCategory('')}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-sm text-sm transition-colors',
                      !category ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-parchment-200/80 hover:bg-wood-700/40'
                    )}
                  >
                    Todas
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-sm text-sm transition-colors flex items-center justify-between',
                        category === cat.id ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-parchment-200/80 hover:bg-wood-700/40'
                      )}
                    >
                      <span>{cat.name}</span>
                      {cat._count && <span className="text-xs opacity-60">{cat._count.products}</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medieval text-parchment-100 mb-3 tracking-wider">Preço</h4>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="input-medieval !py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="input-medieval !py-2 text-sm"
                  />
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={() => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); }}
                  className="w-full text-sm text-maple-400 hover:text-maple-300 font-medieval tracking-wider"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </aside>

          {/* Resultados */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-parchment-200/70 text-sm">
                {isLoading ? 'Carregando...' : `${products.length} ${products.length === 1 ? 'item encontrado' : 'itens encontrados'}`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card-medieval p-4 animate-pulse">
                    <div className="aspect-square bg-wood-700/50 rounded mb-4" />
                    <div className="h-4 bg-wood-700/50 rounded mb-2" />
                    <div className="h-3 bg-wood-700/50 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="card-medieval p-16 text-center">
                <Search className="w-16 h-16 mx-auto text-parchment-200/30 mb-4" />
                <h3 className="font-medieval text-2xl text-parchment-100 mb-2">Nenhum item encontrado</h3>
                <p className="text-parchment-200/60">Tente ajustar os filtros ou use outras palavras-chave.</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
