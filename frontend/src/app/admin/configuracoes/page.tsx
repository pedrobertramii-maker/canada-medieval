'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Loader2, Save, Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminConfiguracoes() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => (await api.get('/settings/admin/all')).data,
  });
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data?.settings) setForm(data.settings);
  }, [data]);

  const save = useMutation({
    mutationFn: async (payload: any) => api.put('/settings/admin/all', payload),
    onSuccess: () => toast.success('Configurações salvas'),
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro'),
  });

  if (isLoading) return <div className="text-parchment-200/50">Carregando...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-medieval text-3xl font-bold text-gold-glow flex items-center gap-2">
          <SettingsIcon className="w-7 h-7" /> Configurações
        </h1>
        <p className="text-parchment-200/70 text-sm mt-1">Personalize o site</p>
      </div>

      <div className="card-medieval p-6 space-y-4">
        <h2 className="font-medieval text-xl text-gold-300 border-b border-wood-400/30 pb-2">Identidade</h2>
        <div><label className="label">Nome do Site</label><input className="input-medieval" value={form.site_name || ''} onChange={(e) => setForm({ ...form, site_name: e.target.value })} /></div>
        <div><label className="label">Slogan</label><input className="input-medieval" value={form.site_tagline || ''} onChange={(e) => setForm({ ...form, site_tagline: e.target.value })} /></div>
        <div><label className="label">Descrição</label><textarea className="input-medieval min-h-[100px]" value={form.site_description || ''} onChange={(e) => setForm({ ...form, site_description: e.target.value })} /></div>
      </div>

      <div className="card-medieval p-6 space-y-4">
        <h2 className="font-medieval text-xl text-gold-300 border-b border-wood-400/30 pb-2">Contato & Social</h2>
        <div><label className="label">Discord URL</label><input className="input-medieval" value={form.discord_url || ''} onChange={(e) => setForm({ ...form, discord_url: e.target.value })} placeholder="https://discord.gg/..." /></div>
        <div><label className="label">Email de Contato</label><input className="input-medieval" value={form.contact_email || ''} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
      </div>

      <button onClick={() => save.mutate(form)} disabled={save.isPending} className="btn-medieval w-full !py-4">
        {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Salvar Configurações</>}
      </button>
    </div>
  );
}
