'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, MessageSquare, FileText, Shield, TrendingUp, AlertCircle, Crown, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate, relativeTime } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => (await api.get('/admins/dashboard')).data,
  });

  const stats = [
    { label: 'Produtos', value: data?.stats?.products ?? 0, icon: Package, color: 'from-gold-500 to-gold-600', href: '/admin/produtos' },
    { label: 'Sugestões', value: data?.stats?.suggestions ?? 0, icon: MessageSquare, color: 'from-blue-500 to-blue-600', href: '/admin/sugestoes', badge: data?.extra?.pendingSuggestions },
    { label: 'Atualizações', value: data?.stats?.updates ?? 0, icon: FileText, color: 'from-purple-500 to-purple-600', href: '/admin/atualizacoes' },
    { label: 'Administradores', value: data?.stats?.admins ?? 0, icon: Shield, color: 'from-maple-500 to-maple-600', href: '/admin/admins' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-medieval text-3xl md:text-4xl font-bold text-gold-glow">Salão do Trono</h1>
        <p className="text-parchment-200/70 mt-1">Visão geral do reino</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={s.href} className="card-medieval p-5 block relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-sm bg-gradient-to-br ${s.color} shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {s.badge ? (
                      <span className="px-2 py-0.5 bg-maple-500 text-parchment-50 text-xs font-medieval font-bold rounded-sm">
                        {s.badge} pendente{s.badge !== 1 ? 's' : ''}
                      </span>
                    ) : null}
                  </div>
                  <div className="font-medieval text-3xl font-bold text-gold-glow">{s.value}</div>
                  <div className="text-sm text-parchment-200/70 mt-1 font-medieval tracking-wider">{s.label}</div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sugestões recentes */}
        <div className="card-medieval p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medieval text-xl text-gold-300 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Sugestões Recentes
            </h2>
            <Link href="/admin/sugestoes" className="text-sm text-gold-400 hover:text-gold-300">Ver todas →</Link>
          </div>
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-parchment-200/50 text-sm">Carregando...</div>
            ) : data?.recent?.suggestions?.length === 0 ? (
              <div className="text-parchment-200/50 text-sm py-6 text-center">Nenhuma sugestão ainda</div>
            ) : (
              data?.recent?.suggestions?.map((s: any) => (
                <div key={s.id} className="p-3 bg-wood-800/50 border border-wood-400/30 rounded-sm hover:border-gold-500/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medieval text-sm text-parchment-100 truncate">{s.title}</h3>
                      <p className="text-xs text-parchment-200/60 mt-0.5">por {s.name} • {relativeTime(s.createdAt)}</p>
                    </div>
                    <span className={`text-[10px] font-medieval px-2 py-0.5 rounded-sm ${
                      s.status === 'PENDING' ? 'bg-gold-500/20 text-gold-300' :
                      s.status === 'APPROVED' ? 'bg-forest-500/20 text-forest-400' :
                      s.status === 'REJECTED' ? 'bg-maple-500/20 text-maple-400' :
                      'bg-iron-600/40 text-parchment-200'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Atualizações recentes */}
        <div className="card-medieval p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medieval text-xl text-gold-300 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Atualizações Recentes
            </h2>
            <Link href="/admin/atualizacoes" className="text-sm text-gold-400 hover:text-gold-300">Ver todas →</Link>
          </div>
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-parchment-200/50 text-sm">Carregando...</div>
            ) : data?.recent?.updates?.length === 0 ? (
              <div className="text-parchment-200/50 text-sm py-6 text-center">Nenhuma atualização ainda</div>
            ) : (
              data?.recent?.updates?.map((u: any) => (
                <div key={u.id} className="p-3 bg-wood-800/50 border border-wood-400/30 rounded-sm hover:border-gold-500/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medieval text-sm text-parchment-100 truncate">{u.title}</h3>
                      <p className="text-xs text-parchment-200/60 mt-0.5">{u.author?.name} • {relativeTime(u.createdAt)}</p>
                    </div>
                    {u.pinned && <Crown className="w-4 h-4 text-gold-400" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-medieval p-5">
          <Users className="w-6 h-6 text-gold-400 mb-2" />
          <div className="font-medieval text-2xl text-parchment-100">{data?.extra?.owners ?? 0}</div>
          <div className="text-sm text-parchment-200/60">Donos da Loja</div>
        </div>
        <div className="card-medieval p-5">
          <TrendingUp className="w-6 h-6 text-gold-400 mb-2" />
          <div className="font-medieval text-2xl text-parchment-100">{data?.extra?.categories ?? 0}</div>
          <div className="text-sm text-parchment-200/60">Categorias Ativas</div>
        </div>
        <div className="card-medieval p-5">
          <AlertCircle className="w-6 h-6 text-gold-400 mb-2" />
          <div className="font-medieval text-2xl text-parchment-100">{data?.extra?.pendingSuggestions ?? 0}</div>
          <div className="text-sm text-parchment-200/60">Aguardando Análise</div>
        </div>
      </div>
    </div>
  );
}
