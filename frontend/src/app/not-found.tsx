'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Swords } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-9xl mb-6"
        >
          ⚔️
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-medieval text-7xl md:text-8xl font-black text-gold-glow mb-4"
        >
          404
        </motion.h1>
        <h2 className="font-medieval text-2xl md:text-3xl text-parchment-100 mb-4">
          Página Perdida nas Crônicas
        </h2>
        <p className="text-parchment-200/70 text-lg mb-8">
          A página que você procura foi engolida pelas sombras do reino.
          Volte ao salão principal antes que a noite chegue.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-medieval">
            <Home className="w-4 h-4" /> Voltar ao Lar
          </Link>
          <Link href="/catalogo" className="btn-medieval-secondary">
            <Swords className="w-4 h-4" /> Explorar Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
