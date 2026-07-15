'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display font-bold tracking-tight">CANADÁ</div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/catalogo" className="hover:text-text transition-colors">Catálogo</Link>
            <Link href="/equipe" className="hover:text-text transition-colors">Equipe</Link>
            <Link href="/admin/login" className="hover:text-text transition-colors">Admin</Link>
          </div>
          <p className="text-xs text-muted">© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
