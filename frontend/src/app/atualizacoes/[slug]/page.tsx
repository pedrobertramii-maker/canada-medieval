'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Eye, Pin } from 'lucide-react';
import { api, UpdatePost } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function UpdatePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['update', slug],
    queryFn: async () => (await api.get(`/updates/${slug}`)).data,
  });

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
      <div className="h-8 bg-wood-700/50 rounded mb-4 w-3/4" />
      <div className="aspect-[16/9] bg-wood-700/50 rounded mb-6" />
      <div className="space-y-2">
        <div className="h-4 bg-wood-700/50 rounded" />
        <div className="h-4 bg-wood-700/50 rounded" />
        <div className="h-4 bg-wood-700/50 rounded w-2/3" />
      </div>
    </div>;
  }

  const update: UpdatePost = data?.update;
  if (!update) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-medieval text-3xl text-gold-glow mb-4">Atualização não encontrada</h2>
        <Link href="/atualizacoes" className="btn-medieval inline-flex">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-parchment-200/70 hover:text-gold-300 mb-6 font-medieval tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      {update.pinned && (
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-gold-500 text-wood-900 text-xs font-medieval font-bold tracking-wider rounded-sm mb-3">
          <Pin className="w-3 h-3" /> FIXADO
        </div>
      )}

      <h1 className="font-medieval text-4xl md:text-5xl font-bold text-gold-glow mb-4 leading-tight">
        {update.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-parchment-200/60 mb-6">
        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(update.publishedAt)}</span>
        <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{update.author.name}</span>
        <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{update.views} visualizações</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative aspect-[16/9] mb-8 overflow-hidden rounded border-2 border-gold-500/40"
      >
        <Image src={update.imageUrl} alt={update.title} fill unoptimized className="object-cover" />
      </motion.div>

      <div className="prose prose-invert prose-lg max-w-none font-body">
        <p className="text-xl text-parchment-100 italic border-l-4 border-gold-500/60 pl-4 mb-6">
          {update.excerpt}
        </p>
        <div className="text-parchment-200/90 leading-relaxed whitespace-pre-wrap">
          {update.content}
        </div>
      </div>
    </article>
  );
}
