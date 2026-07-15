'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api, Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const { data } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => (await api.get('/products/featured')).data,
  });

  const products: Product[] = data?.products || [];

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-sm text-accent font-medium mb-4">Loja do servidor</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Os melhores itens<br />
            <span className="text-accent">do Canadá.</span>
          </h1>
          <p className="text-lg text-muted max-w-xl mb-10">
            Blocos, ferramentas, armaduras e tudo que você precisa pra mandar bem no servidor.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/catalogo" className="btn-primary">
              Ver catálogo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/equipe" className="btn-secondary">
              Equipe
            </Link>
          </div>
        </motion.div>
      </section>

      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-2xl font-semibold">Em destaque</h2>
            <Link href="/catalogo" className="text-sm text-muted hover:text-text transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 8).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
