'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Crown, Swords, ScrollText, Users, MessageSquare, Home } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/catalogo', label: 'Catálogo', icon: Crown },
  { href: '/atualizacoes', label: 'Atualizações', icon: ScrollText },
  { href: '/equipe', label: 'Equipe', icon: Users },
  { href: '/sugestoes', label: 'Sugestões', icon: MessageSquare },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Esconde navbar no admin
  if (pathname?.startsWith('/admin') && !pathname.startsWith('/admin/login')) return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-wood-900/95 backdrop-blur-md border-b-2 border-gold-500/40 shadow-medieval'
          : 'bg-wood-900/60 backdrop-blur-sm'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 coat-of-arms rounded-full shadow-gold-glow group-hover:scale-110 transition-transform" />
              <div className="absolute inset-1 bg-wood-800 rounded-full flex items-center justify-center border border-gold-400/50">
                <span className="text-2xl">🍁</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="font-medieval text-2xl font-bold text-gold-glow tracking-widest leading-none">
                CANADÁ
              </div>
              <div className="text-[10px] text-parchment-200/60 tracking-[0.35em] uppercase font-medieval">
                Reino Medieval
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'group relative flex items-center gap-2 px-4 py-2 rounded-sm transition-all duration-200',
                      active
                        ? 'text-gold-300 bg-wood-700/60'
                        : 'text-parchment-100 hover:text-gold-300 hover:bg-wood-700/40'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medieval text-sm tracking-wider">{link.label}</span>
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2.5 text-parchment-200 hover:text-gold-300 hover:bg-wood-700/40 rounded-sm transition-colors"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              href="/catalogo"
              className="hidden md:inline-flex btn-medieval !py-2 !px-4 !text-sm"
            >
              <Swords className="w-4 h-4" />
              Entrar
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden p-2.5 text-parchment-200 hover:text-gold-300 hover:bg-wood-700/40 rounded-sm transition-colors"
              aria-label="Menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t-2 border-wood-400/40 bg-wood-900/95 backdrop-blur-md"
          >
            <ul className="px-4 py-4 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-sm transition-colors',
                        active ? 'bg-gold-500/20 text-gold-300' : 'text-parchment-100 hover:bg-wood-700/40'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medieval tracking-wider">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
