'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.oldPrice && parseFloat(String(product.oldPrice)) > parseFloat(String(product.price));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="card-medieval group overflow-hidden"
    >
      <Link href={`/catalogo/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-wood-800">
          {product.featured && (
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-gradient-to-r from-gold-500 to-gold-400 text-wood-900 text-xs font-medieval font-bold tracking-wider rounded-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              DESTAQUE
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-maple-500 text-parchment-50 text-xs font-medieval font-bold tracking-wider rounded-sm">
              PROMOÇÃO
            </div>
          )}
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wood-900 via-transparent to-transparent opacity-60" />
        </div>
        <div className="p-4">
          <span
            className="inline-block text-[10px] font-medieval tracking-widest uppercase mb-1.5 px-2 py-0.5 rounded-sm border"
            style={{
              color: product.category?.color || '#E6B84F',
              borderColor: (product.category?.color || '#E6B84F') + '60',
            }}
          >
            {product.category?.name}
          </span>
          <h3 className="font-medieval text-lg font-semibold text-parchment-50 group-hover:text-gold-300 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-parchment-200/70 mt-1 line-clamp-2 h-10">
            {product.description}
          </p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              {hasDiscount && (
                <div className="text-xs text-parchment-200/50 line-through">
                  {formatPrice(product.oldPrice!)}
                </div>
              )}
              <div className="font-medieval text-xl font-bold text-gold-300">
                {formatPrice(product.price)}
              </div>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="p-2.5 bg-gold-500/20 hover:bg-gold-500/40 border border-gold-500/50 rounded-sm text-gold-300 hover:text-gold-200 transition-colors"
              aria-label="Adicionar"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
