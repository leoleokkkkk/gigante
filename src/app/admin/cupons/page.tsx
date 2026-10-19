'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Check, Trash2, X } from 'lucide-react';
import { Coupon } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { initialCoupons } from '@/data/seed';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [code, setCode] = useState('');
  const [type, setType] = useState<Coupon['type']>('percentage');
  const [value, setValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(150);
  const [maxUses, setMaxUses] = useState(500);

  const loadCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) setCoupons(await res.json());
      else setCoupons(initialCoupons);
    } catch {
      setCoupons(initialCoupons);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `cp-${Date.now()}`,
          code: code.trim().toUpperCase(),
          type,
          value: Number(value),
          minOrderValue: Number(minOrderValue),
          maxUses: Number(maxUses),
          currentUses: 0,
          active: true
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setCode('');
        loadCoupons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-500">
            Campanhas & Descontos
          </span>
          <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
            Gestão de Cupons Promocionais
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Crie códigos promocionais de desconto em percentual, valor fixo ou frete grátis.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Cupom</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map(c => (
          <div
            key={c.id}
            className="p-6 rounded-3xl bg-dark-900 border border-dark-800 space-y-4 relative shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-black text-white bg-dark-950 px-3 py-1 rounded-xl border border-dark-700">
                {c.code}
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                {c.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-300">
              <p>
                <strong className="text-neutral-400">Benefício:</strong>{' '}
                <span className="text-brand-400 font-bold">
                  {c.type === 'percentage'
                    ? `${c.value}% de desconto`
                    : c.type === 'fixed'
                    ? `${formatCurrency(c.value)} de desconto`
                    : 'Frete Grátis'}
                </span>
              </p>
              <p>
                <strong className="text-neutral-400">Pedido Mínimo:</strong> {formatCurrency(c.minOrderValue)}
              </p>
              <p>
                <strong className="text-neutral-400">Usos:</strong> {c.currentUses} de {c.maxUses} disponíveis
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="font-bold text-lg">Criar Cupom de Desconto</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Código do Cupom *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="EX: PROMO15"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Tipo de Desconto</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-white"
                >
                  <option value="percentage">Percentual (%)</option>
                  <option value="fixed">Valor Fixo em Reais (R$)</option>
                  <option value="free_shipping">Frete Grátis</option>
                </select>
              </div>

              {type !== 'free_shipping' && (
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Valor do Desconto *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white font-bold"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Pedido Mínimo (R$)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={minOrderValue}
                    onChange={e => setMinOrderValue(Number(e.target.value))}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Limite Máximo de Usos</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={maxUses}
                    onChange={e => setMaxUses(Number(e.target.value))}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black uppercase text-xs"
              >
                Salvar e Ativar Cupom
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
