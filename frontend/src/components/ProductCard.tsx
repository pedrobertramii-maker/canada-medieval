'use client';

import Image from 'next/image';
import { Product } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/catalogo/${product.slug}`} className="group block">
      <div className="card-base card-hover overflow-hidden">
        <div className="relative aspect-square bg-surface">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-muted mb-1">{product.category?.name}</p>
          <h3 className="font-medium text-text mb-2 truncate">{product.name}</h3>
          <p className="text-sm text-accent font-semibold">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}
