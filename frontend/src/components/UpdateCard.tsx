'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UpdatePost } from '@/lib/api';
import { formatDate, relativeTime } from '@/lib/utils';
import { Pin, Calendar, User } from 'lucide-react';

export default function UpdateCard({ update, large = false }: { update: UpdatePost; large?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="card-medieval group overflow-hidden"
    >
      <Link href={`/atualizacoes/${update.slug}`} className="block">
        <div className={`relative ${large ? 'aspect-[16/9]' : 'aspect-[16/10]'} overflow-hidden bg-wood-800`}>
          <Image
            src={update.imageUrl}
            alt={update.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wood-900 via-wood-900/40 to-transparent" />
          {update.pinned && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-gold-500 text-wood-900 text-xs font-medieval font-bold tracking-wider rounded-sm flex items-center gap-1">
              <Pin className="w-3 h-3" />
              FIXADO
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-parchment-200/60 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(update.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {update.author.name}
            </span>
          </div>
          <h3 className={`font-medieval font-bold text-parchment-50 group-hover:text-gold-300 transition-colors line-clamp-2 ${large ? 'text-2xl' : 'text-lg'}`}>
            {update.title}
          </h3>
          <p className="text-sm text-parchment-200/70 mt-2 line-clamp-3">
            {update.excerpt}
          </p>
          <div className="mt-4 text-gold-400 font-medieval text-sm tracking-wider group-hover:text-gold-300">
            Ler mais →
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
