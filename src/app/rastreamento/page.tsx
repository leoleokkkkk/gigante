'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, ArrowRight, Truck } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function RastreamentoLookupPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const clean = query.replace('#', '').trim();
    router.push(`/pedido/${clean}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-950">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 flex flex-col justify-center">
        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-500 flex items-center justify-center mx-auto shadow-xl">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Rastrear Meu Pedido
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Digite o número do seu pedido (ex: GM-000101) para acompanhar o status da separação, despacho e entrega em tempo real.
          </p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Número do Pedido
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={query}
                  onChange={e => setQuery(e.target.value.toUpperCase())}
                  placeholder="Ex: GM-000101"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3.5 pl-11 text-white text-sm uppercase placeholder-neutral-500 focus:outline-none focus:border-brand-500 font-mono font-bold"
                  autoFocus
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-500/20"
            >
              <span>Consultar Rastreamento</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-500" />
              <span>Integração com rastreamento Correios e Jadlog</span>
            </div>
            <p>Dúvidas? Chame no WhatsApp: (11) 98765-4321</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
