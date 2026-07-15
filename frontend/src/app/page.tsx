'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Crown, Swords, Sparkles, Shield, Hammer, Pickaxe, Apple, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Product, UpdatePost } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import UpdateCard from '@/components/UpdateCard';
import { formatDate } from '@/lib/utils';

const categoryIcons: Record<string, any> = {
  Blocos: Hammer, Ferramentas: Pickaxe, Armaduras: Shield,
  Comida: Apple, Decoração: Sparkles, Encantamentos: BookOpen, Especiais: Crown,
};

export default function Home() {
  const { data: productsData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => (await api.get('/products/featured')).data,
  });
  const { data: updatesData } = useQuery({
    queryKey: ['recent-updates'],
    queryFn: async () => (await api.get('/updates?limit=3')).data,
  });

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background medieval */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=1920')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-wood-900/80 via-wood-900/85 to-wood-900" />
          <div className="absolute inset-0 bg-noise opacity-30" />
        </div>

        {/* Tochas nas laterais */}
        <div className="absolute top-32 left-4 md:left-12 torch z-10" />
        <div className="absolute top-32 right-4 md:right-12 torch z-10" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-32 left-4 md:left-12 torch z-10" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 right-4 md:right-12 torch z-10" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          {/* Selo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-6 px-5 py-2 bg-wood-800/80 border border-gold-500/40 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="font-medieval text-sm tracking-[0.3em] text-gold-300 uppercase">Reino Oficial</span>
          </motion.div>

          {/* Brasão animado */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: 'spring' }}
            className="mx-auto mb-8 relative w-32 h-32 md:w-40 md:h-40"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-gold-500/40"
            />
            <div className="absolute inset-2 coat-of-arms rounded-full shadow-gold-glow flex items-center justify-center">
              <span className="text-6xl md:text-7xl drop-shadow-2xl">🍁</span>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-gold-400 text-2xl">♛</div>
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-medieval text-6xl md:text-8xl lg:text-9xl font-black tracking-wider mb-3 text-gold-glow"
          >
            CANADÁ
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-12 bg-gold-400" />
            <Swords className="w-5 h-5 text-gold-400" />
            <span className="font-medieval text-base md:text-lg tracking-[0.4em] text-parchment-200 uppercase">
              Loja Medieval
            </span>
            <Swords className="w-5 h-5 text-gold-400" />
            <span className="h-px w-12 bg-gold-400" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-parchment-200/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Bem-vindo, nobre viajante. Forjadas nas bigornas do antigo Canadá, nossas peças carregam a honra,
            a glória e o peso da história. Encontre aqui os melhores itens do reino.
          </motion.p>

          {/* Botões */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/catalogo" className="btn-medieval text-lg px-10 py-4">
              <Swords className="w-5 h-5" />
              Entrar na Loja
            </Link>
            <Link href="#catalogo" className="btn-medieval-secondary text-lg px-10 py-4">
              <Crown className="w-5 h-5" />
              Ver Catálogo
            </Link>
          </motion.div>

          {/* Indicador de scroll */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-gold-400/60 rounded-full flex items-start justify-center p-1">
              <div className="w-1.5 h-2 bg-gold-400 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 mb-3 text-gold-400">
              <span className="text-2xl">⚜</span>
              <span className="font-medieval text-sm tracking-[0.3em] uppercase">Categorias do Reino</span>
              <span className="text-2xl">⚜</span>
            </div>
            <h2 className="font-medieval text-4xl md:text-5xl font-bold text-gold-glow mb-3">
              Explore Nossos Arsenais
            </h2>
            <p className="text-parchment-200/70 max-w-2xl mx-auto">
              Cada categoria é cuidadosamente selecionada e guardada pelos mestres ferreiros do reino.
            </p>
          </motion.div>

          <CategoryGrid />
        </div>
      </section>

      {/* DESTAQUES */}
      <section id="catalogo" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 mb-3 text-gold-400">
              <Crown className="w-5 h-5" />
              <span className="font-medieval text-sm tracking-[0.3em] uppercase">Destaques</span>
              <Crown className="w-5 h-5" />
            </div>
            <h2 className="font-medieval text-4xl md:text-5xl font-bold text-gold-glow mb-3">
              Itens Lendários
            </h2>
            <p className="text-parchment-200/70 max-w-2xl mx-auto">
              Os tesouros mais cobiçados do reino, prontos para honrar os guerreiros mais bravos.
            </p>
          </motion.div>

          {productsData?.products?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsData.products.slice(0, 8).map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-parchment-200/50">
              <Crown className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medieval">Nenhum item em destaque ainda. Volte em breve!</p>
            </div>
          )}

          {productsData?.products?.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/catalogo" className="btn-medieval">
                Ver Catálogo Completo
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ATUALIZAÇÕES */}
      {updatesData?.items?.length > 0 && (
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 mb-3 text-gold-400">
                <span className="font-medieval text-sm tracking-[0.3em] uppercase">Últimas Notícias</span>
              </div>
              <h2 className="font-medieval text-4xl md:text-5xl font-bold text-gold-glow mb-3">
                Atualizações do Reino
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {updatesData.items.map((u: UpdatePost) => (
                <UpdateCard key={u.id} update={u} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/atualizacoes" className="btn-medieval-secondary">
                Ver Todas as Atualizações
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-4 relative banner-medieval">
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Crown className="w-16 h-16 mx-auto text-gold-400 mb-6 drop-shadow-2xl" />
            <h2 className="font-medieval text-4xl md:text-5xl font-bold text-gold-glow mb-4">
              Junte-se ao Reino
            </h2>
            <p className="text-parchment-200/80 text-lg mb-8 max-w-2xl mx-auto">
              Acumule moedas, conquiste patentes e escreva sua história nas crônicas do Canadá medieval.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/catalogo" className="btn-medieval">
                <Swords className="w-5 h-5" />
                Comece Sua Jornada
              </Link>
              <Link href="/equipe" className="btn-medieval-secondary">
                Conheça a Equipe
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function CategoryGrid() {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data,
  });
  const categories = data?.categories || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {categories.map((cat: any, i: number) => {
        const Icon = categoryIcons[cat.name] || Crown;
        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={`/catalogo?categoria=${cat.slug}`}
              className="group card-medieval block p-5 text-center"
            >
              <div
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center border-2 border-gold-500/40 group-hover:border-gold-400 group-hover:scale-110 transition-all"
                style={{ background: `linear-gradient(135deg, ${cat.color}40, ${cat.color}10)` }}
              >
                <Icon className="w-6 h-6" style={{ color: cat.color || '#E6B84F' }} />
              </div>
              <h3 className="font-medieval text-sm tracking-wider text-parchment-100 group-hover:text-gold-300 transition-colors">
                {cat.name}
              </h3>
              <span className="text-xs text-parchment-200/50 mt-1 block">
                {cat._count?.products || 0} itens
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
