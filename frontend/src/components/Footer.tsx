'use client';

import Link from 'next/link';
import { Crown, Swords, Mail, MessageCircle, Github, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data.settings)).catch(() => {});
  }, []);

  return (
    <footer className="relative mt-20 banner-medieval border-t-4 border-gold-500/40">
      {/* Decoração superior */}
      <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 coat-of-arms rounded-full shadow-gold-glow" />
                <div className="absolute inset-1 bg-wood-800 rounded-full flex items-center justify-center border border-gold-400/50">
                  <span className="text-2xl">🍁</span>
                </div>
              </div>
              <div>
                <div className="font-medieval text-2xl font-bold text-gold-glow tracking-widest">CANADÁ</div>
                <div className="text-[10px] text-parchment-200/60 tracking-[0.35em] uppercase font-medieval">Reino Medieval</div>
              </div>
            </div>
            <p className="text-parchment-200/80 leading-relaxed mb-4 max-w-md">
              {settings.site_description ||
                'A mais nobre loja medieval do servidor de Minecraft. Forjadas nas bigornas do reino, nossas peças carregam a honra e a glória do antigo Canadá.'}
            </p>
            <div className="flex items-center gap-3">
              {settings.discord_url && (
                <a href={settings.discord_url} target="_blank" rel="noopener" className="p-2.5 bg-wood-700/60 hover:bg-gold-500/30 border border-wood-400/40 rounded-sm transition-colors text-parchment-100 hover:text-gold-300">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings.contact_email && (
                <a href={`mailto:${settings.contact_email}`} className="p-2.5 bg-wood-700/60 hover:bg-gold-500/30 border border-wood-400/40 rounded-sm transition-colors text-parchment-100 hover:text-gold-300">
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medieval text-gold-300 tracking-widest mb-4 text-sm">NAVEGAÇÃO</h3>
            <ul className="space-y-2">
              <li><Link href="/catalogo" className="text-parchment-200/80 hover:text-gold-300 transition-colors flex items-center gap-2"><Crown className="w-3.5 h-3.5" />Catálogo</Link></li>
              <li><Link href="/atualizacoes" className="text-parchment-200/80 hover:text-gold-300 transition-colors flex items-center gap-2"><Crown className="w-3.5 h-3.5" />Atualizações</Link></li>
              <li><Link href="/equipe" className="text-parchment-200/80 hover:text-gold-300 transition-colors flex items-center gap-2"><Crown className="w-3.5 h-3.5" />Equipe</Link></li>
              <li><Link href="/sugestoes" className="text-parchment-200/80 hover:text-gold-300 transition-colors flex items-center gap-2"><Crown className="w-3.5 h-3.5" />Sugestões</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medieval text-gold-300 tracking-widest mb-4 text-sm">PAINEL</h3>
            <ul className="space-y-2">
              <li><Link href="/admin/login" className="text-parchment-200/80 hover:text-gold-300 transition-colors flex items-center gap-2"><Swords className="w-3.5 h-3.5" />Entrar no Painel</Link></li>
            </ul>
          </div>
        </div>

        <div className="divider-medieval mt-10 mb-6">
          <span className="text-gold-400 text-xl">⚜</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-parchment-200/60">
          <p>© {new Date().getFullYear()} Reino do Canadá. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            Feito com <Heart className="w-3.5 h-3.5 text-maple-500 fill-maple-500" /> pelos lordes do reino
          </p>
        </div>
      </div>
    </footer>
  );
}
