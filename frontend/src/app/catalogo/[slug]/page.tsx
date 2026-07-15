'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Package, Tag, Star } from 'lucide-react';
import { api, Product } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import MinecraftSkin from '@/components/MinecraftSkin';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => (await api.get(`/products/${slug}`)).data,
  });
  const { data: related } = useQuery({
    queryKey: ['related', data?.product?.categoryId],
    queryFn: async () => (await api.get(`/products?category=${data?.product?.categoryId}&sort=recent`)).data,
    enabled: !!data?.product?.categoryId,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="animate-pulse grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-wood-700/50 rounded" />
          <div>
            <div className="h-8 bg-wood-700/50 rounded mb-4 w-3/4" />
            <div className="h-4 bg-wood-700/50 rounded mb-2" />
            <div className="h-4 bg-wood-700/50 rounded mb-2 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 mx-auto text-parchment-200/30 mb-4" />
        <h2 className="font-medieval text-3xl text-gold-glow mb-2">Produto não encontrado</h2>
        <Link href="/catalogo" className="btn-medieval mt-4 inline-flex">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const p: Product = data.product;
  const hasDiscount = p.oldPrice && parseFloat(String(p.oldPrice)) > parseFloat(String(p.price));
  const relatedProducts = (related?.products || []).filter((x: Product) => x.id !== p.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-parchment-200/70 hover:text-gold-300 mb-6 font-medieval tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-medieval p-4"
        >
          <div className="relative aspect-square overflow-hidden rounded">
            <Image src={p.imageUrl} alt={p.name} fill unoptimized className="object-cover" />
            {hasDiscount && (
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-maple-500 text-parchment-50 font-medieval text-sm tracking-wider rounded-sm">
                PROMOÇÃO
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span
            className="inline-block text-xs font-medieval tracking-widest uppercase mb-2 px-3 py-1 rounded-sm border w-fit"
            style={{ color: p.category?.color || '#E6B84F', borderColor: (p.category?.color || '#E6B84F') + '60' }}
          >
            <Tag className="w-3 h-3 inline mr-1" />
            {p.category?.name}
          </span>
          {p.featured && (
            <div className="flex items-center gap-1 text-gold-400 mb-2 text-sm">
              <Star className="w-4 h-4 fill-gold-400" />
              <span className="font-medieval tracking-wider">DESTAQUE</span>
            </div>
          )}
          <h1 className="font-medieval text-4xl md:text-5xl font-bold text-gold-glow mb-4">{p.name}</h1>
          <p className="text-parchment-200/80 text-lg leading-relaxed mb-6">{p.description}</p>

          <div className="card-medieval p-5 mb-6">
            <div className="flex items-end justify-between">
              <div>
                {hasDiscount && (
                  <div className="text-sm text-parchment-200/50 line-through mb-1">
                    {formatPrice(p.oldPrice!)}
                  </div>
                )}
                <div className="font-medieval text-4xl font-bold text-gold-300">
                  {formatPrice(p.price)}
                </div>
              </div>
              {p.stock != null && (
                <div className="text-right">
                  <div className="text-xs text-parchment-200/60 font-medieval tracking-wider">EM ESTOQUE</div>
                  <div className="font-medieval text-2xl text-parchment-100">{p.stock}</div>
                </div>
              )}
            </div>
          </div>

          <button className="btn-medieval text-lg w-full">
            <ShoppingCart className="w-5 h-5" />
            Comprar (em breve)
          </button>
        </motion.div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-medieval text-3xl text-gold-glow mb-6 text-center">Itens Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rp: Product) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
