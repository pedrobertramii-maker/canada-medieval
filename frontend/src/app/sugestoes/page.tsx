'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  discord: string;
  title: string;
  description: string;
}

export default function SugestoesPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await api.post('/suggestions', data);
      setSent(true);
      reset();
      toast.success('Sugestão enviada com sucesso!');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Erro ao enviar sugestão');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="relative py-20 banner-medieval border-b-4 border-gold-500/30">
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gold-400 text-2xl mb-3">💡</div>
          <h1 className="font-medieval text-5xl md:text-6xl font-bold text-gold-glow mb-3">
            Sugestões do Reino
          </h1>
          <p className="text-parchment-200/80 max-w-2xl mx-auto text-lg">
            Tem uma ideia para melhorar o reino? Envie sua sugestão. Os lordes analisam todas as mensagens.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-medieval p-12 text-center"
          >
            <CheckCircle2 className="w-20 h-20 mx-auto text-gold-400 mb-4" />
            <h2 className="font-medieval text-3xl text-gold-glow mb-3">Sugestão Enviada!</h2>
            <p className="text-parchment-200/80 mb-6">
              Obrigado por contribuir com o reino. Os lordes analisarão sua sugestão em breve.
            </p>
            <button onClick={() => setSent(false)} className="btn-medieval">
              Enviar Outra Sugestão
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="card-medieval p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medieval text-parchment-100 mb-2 tracking-wider">
                  Seu nome *
                </label>
                <input
                  {...register('name', { required: 'Nome obrigatório', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
                  className="input-medieval"
                  placeholder="João Silva"
                />
                {errors.name && <p className="text-maple-400 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medieval text-parchment-100 mb-2 tracking-wider">
                  Discord (opcional)
                </label>
                <input
                  {...register('discord')}
                  className="input-medieval"
                  placeholder="usuario#0000"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medieval text-parchment-100 mb-2 tracking-wider">
                Título da sugestão *
              </label>
              <input
                {...register('title', { required: 'Título obrigatório', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
                className="input-medieval"
                placeholder="Ex: Adicionar mais variedade de blocos"
              />
              {errors.title && <p className="text-maple-400 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medieval text-parchment-100 mb-2 tracking-wider">
                Descrição *
              </label>
              <textarea
                {...register('description', { required: 'Descrição obrigatória', minLength: { value: 5, message: 'Mínimo 5 caracteres' }, maxLength: { value: 2000, message: 'Máximo 2000 caracteres' } })}
                className="input-medieval min-h-[180px] resize-y"
                placeholder="Descreva sua sugestão com detalhes..."
              />
              {errors.description && <p className="text-maple-400 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-medieval w-full !py-4 !text-base disabled:opacity-60"
            >
              {submitting ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Enviar Sugestão
                </>
              )}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
