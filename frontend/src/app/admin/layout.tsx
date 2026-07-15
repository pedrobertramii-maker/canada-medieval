'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, Tag, FileText, MessageSquare,
  Users, LogOut, Shield, Menu, X, ChevronRight, Settings, Sun, Moon,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/categorias', label: 'Categorias', icon: Tag },
  { href: '/admin/atualizacoes', label: 'Atualizações', icon: FileText },
  { href: '/admin/sugestoes', label: 'Sugestões', icon: MessageSquare },
  { href: '/admin/donos', label: 'Donos da Loja', icon: Users, ownerOnly: true },
  { href: '/admin/admins', label: 'Administradores', icon: Shield, ownerOnly: true },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, loading, fetchMe, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (!isLogin && !admin) {
      fetchMe().then(() => {
        if (!useAuth.getState().admin) router.push('/admin/login');
      });
    }
  }, [isLogin, admin, fetchMe, router]);

  if (isLogin) return <>{children}</>;

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-parchment-200/50 font-medieval">Carregando...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('Sessão encerrada');
    router.push('/admin/login');
  };

  const visibleLinks = links.filter(l => !l.ownerOnly || admin.role === 'OWNER');

  return (
    <div className="min-h-screen flex bg-wood-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen w-72 bg-wood-800/95 backdrop-blur-md border-r-2 border-gold-500/30 z-40 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b-2 border-wood-400/30">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 coat-of-arms rounded-full" />
                <div className="absolute inset-1 bg-wood-900 rounded-full flex items-center justify-center border border-gold-400/50">
                  <span className="text-2xl">🍁</span>
                </div>
              </div>
              <div>
                <div className="font-medieval text-lg font-bold text-gold-glow tracking-widest">PAINEL</div>
                <div className="text-[10px] text-parchment-200/60 tracking-widest uppercase">Canadá</div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || (link.href !== '/admin' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-sm transition-all group',
                    active
                      ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400'
                      : 'text-parchment-100 hover:bg-wood-700/40 border-l-4 border-transparent'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medieval text-sm tracking-wider">{link.label}</span>
                  </span>
                  <ChevronRight className={cn('w-4 h-4 transition-transform', active ? 'text-gold-400 translate-x-1' : 'text-parchment-200/30')} />
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t-2 border-wood-400/30 space-y-2">
            <div className="card-medieval p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-300 font-medieval font-bold">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-parchment-100 font-medieval truncate">{admin.name}</div>
                <div className="text-xs text-parchment-200/60 truncate">{admin.role}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-maple-400 hover:text-maple-300 hover:bg-maple-500/10 rounded-sm transition-colors font-medieval text-sm tracking-wider"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-0 min-w-0">
        <header className="sticky top-0 z-20 bg-wood-900/95 backdrop-blur-md border-b-2 border-wood-400/30">
          <div className="flex items-center justify-between px-4 md:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-parchment-200 hover:text-gold-300"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-medieval text-lg text-gold-300 tracking-widest truncate">
              {visibleLinks.find(l => pathname === l.href || (l.href !== '/admin' && pathname?.startsWith(l.href)))?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className="p-2 text-parchment-200 hover:text-gold-300"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link href="/" target="_blank" className="hidden md:inline-flex text-xs text-parchment-200/60 hover:text-gold-300 font-medieval tracking-wider">
                Ver site →
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
