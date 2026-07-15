'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Lock, User, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      toast.success('Bem-vindo de volta!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900" />
      <div className="absolute inset-0 bg-noise opacity-30" />

      {/* Tochas */}
      <div className="absolute top-10 left-10 torch hidden md:block" />
      <div className="absolute top-10 right-10 torch hidden md:block" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-10 left-10 torch hidden md:block" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-10 right-10 torch hidden md:block" style={{ animationDelay: '1.5s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 card-medieval p-8 md:p-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative w-20 h-20 mx-auto mb-4"
          >
            <div className="absolute inset-0 coat-of-arms rounded-full shadow-gold-glow" />
            <div className="absolute inset-1.5 bg-wood-800 rounded-full flex items-center justify-center border-2 border-gold-400">
              <Shield className="w-9 h-9 text-gold-400" />
            </div>
          </motion.div>
          <h1 className="font-medieval text-3xl font-bold text-gold-glow tracking-widest">PAINEL</h1>
          <p className="text-parchment-200/70 mt-1 text-sm tracking-wider">CANADÁ MEDIEVAL</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medieval text-parchment-100 mb-2 tracking-wider">
              Usuário
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-parchment-200/50" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-medieval pl-11"
                placeholder="admin"
                required
                autoComplete="username"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medieval text-parchment-100 mb-2 tracking-wider">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-parchment-200/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-medieval pl-11"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-medieval w-full !py-4 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar no Reino'}
          </button>
        </form>

        <p className="text-center text-xs text-parchment-200/50 mt-6">
          Acesso restrito aos lordes do reino
        </p>
      </motion.div>
    </div>
  );
}
