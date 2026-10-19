'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldAlert, KeyRound, ArrowRight, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function OwnerLoginModal() {
  const router = useRouter();
  const { isOwnerModalOpen, setIsOwnerModalOpen, loginAsOwner } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOwnerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = loginAsOwner(password);
    setLoading(false);

    if (result.success) {
      setPassword('');
      router.push('/admin');
    } else {
      setError(result.message || 'Senha incorreta.');
    }
  };

  const handleQuickDemoAccess = () => {
    loginAsOwner('gigante123');
    router.push('/admin');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsOwnerModalOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-md bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10 animate-in fade-in-0 zoom-in-95 duration-200">
        <button
          onClick={() => setIsOwnerModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <img
            src="/images/logo.png"
            alt="Gigante's Multimarcas"
            className="h-10 w-auto object-contain drop-shadow mb-1"
          />
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 shadow-lg shadow-brand-500/10">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-black uppercase tracking-tight text-white">
              Modo Dono & Gestão
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
              Área de acesso restrito ao proprietário da Gigante&apos;s Multimarcas para controle de estoque, vendas, caixa e financeiro.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Senha de Segurança do Proprietário
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite sua senha de acesso..."
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            {error && <p className="text-xs font-semibold text-red-400 mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.01]"
          >
            <span>{loading ? 'Verificando...' : 'Entrar no Modo Dono'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-dark-800 text-center">
          <p className="text-[11px] text-neutral-500 mb-2">
            Credenciais padrão para avaliação rápida:
          </p>
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            className="text-xs font-bold text-brand-400 hover:text-brand-300 bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-500/20 hover:bg-brand-500/20 transition-colors"
          >
            Entrar como Rodrigo Gigante (Proprietário)
          </button>
        </div>
      </div>
    </div>
  );
}
