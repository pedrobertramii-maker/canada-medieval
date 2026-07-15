'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Admin } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Plus, Pencil, Trash2, X, Loader2, Shield, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function AdminAdmins() {
  const qc = useQueryClient();
  const { admin: me } = useAuth();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);

  const { data } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/admins/users')).data,
  });

  const del = useMutation({
    mutationFn: async (id: string) => api.delete(`/admins/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Admin removido');
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-medieval text-3xl font-bold text-gold-glow">Administradores</h1>
          <p className="text-parchment-200/70 text-sm mt-1">Gerencie quem tem acesso ao painel</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-medieval">
          <Plus className="w-4 h-4" /> Novo Admin
        </button>
      </div>

      <div className="card-medieval overflow-hidden">
        <table className="w-full">
          <thead className="bg-wood-800/80 border-b-2 border-wood-400/30">
            <tr className="text-left">
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider">Nome</th>
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider">Usuário</th>
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider">Email</th>
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider">Cargo</th>
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider">Último login</th>
              <th className="px-4 py-3 font-medieval text-sm text-gold-300 tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.admins?.map((a: Admin) => (
              <tr key={a.id} className="border-b border-wood-400/20 hover:bg-wood-700/30">
                <td className="px-4 py-3 font-medieval text-parchment-100">{a.name}</td>
                <td className="px-4 py-3 text-parchment-200">{a.username}</td>
                <td className="px-4 py-3 text-parchment-200/70 text-sm">{a.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medieval px-2 py-0.5 rounded flex items-center gap-1 w-fit ${
                    a.role === 'OWNER' ? 'bg-gold-500/20 text-gold-300' :
                    a.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-iron-600/40 text-parchment-200/80'
                  }`}>
                    {a.role === 'OWNER' ? <ShieldCheck className="w-3 h-3" /> : a.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                    {a.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-parchment-200/70 text-sm">{a.lastLoginAt ? formatDate(a.lastLoginAt) : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(a)} className="p-2 hover:bg-gold-500/20 rounded text-gold-300 inline-block"><Pencil className="w-4 h-4" /></button>
                  {a.id !== me?.id && (
                    <button onClick={() => { if (confirm('Remover?')) del.mutate(a.id); }} className="p-2 hover:bg-maple-500/20 rounded text-maple-400 inline-block"><Trash2 className="w-4 h-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <AdminForm admin={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      )}
    </div>
  );
}

function AdminForm({ admin, onClose }: { admin: Admin | null; onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: admin ? { ...admin, password: '' } : { role: 'STAFF' },
  });
  const submit = useMutation({
    mutationFn: async (data: any) => {
      if (admin) {
        const payload: any = { name: data.name, email: data.email, role: data.role, isActive: data.isActive };
        if (data.password) payload.password = data.password;
        return api.put(`/admins/users/${admin.id}`, payload);
      }
      return api.post('/admins/users', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Salvo');
      onClose();
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Erro'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="card-medieval w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-medieval text-2xl text-gold-glow">{admin ? 'Editar' : 'Novo'} Admin</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-parchment-200" /></button>
        </div>
        <form onSubmit={handleSubmit((d) => submit.mutate(d))} className="space-y-3">
          {!admin && <>
            <div><label className="label">Usuário *</label><input {...register('username', { required: true })} className="input-medieval" /></div>
            <div><label className="label">Senha * (mín 8)</label><input type="password" {...register('password', { required: !admin, minLength: 8 })} className="input-medieval" /></div>
          </>}
          {admin && <div><label className="label">Nova senha (deixe vazio para manter)</label><input type="password" {...register('password', { minLength: 8 })} className="input-medieval" /></div>}
          <div><label className="label">Nome *</label><input {...register('name', { required: true })} className="input-medieval" /></div>
          <div><label className="label">Email *</label><input type="email" {...register('email', { required: true })} className="input-medieval" /></div>
          <div>
            <label className="label">Cargo</label>
            <select {...register('role')} className="input-medieval">
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
          {admin && <label className="flex items-center gap-2"><input type="checkbox" {...register('isActive')} className="w-5 h-5 accent-gold-500" /> <span className="text-parchment-100">Ativo</span></label>}
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="btn-medieval-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={submit.isPending} className="btn-medieval flex-1">
              {submit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
