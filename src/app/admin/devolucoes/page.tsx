'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, Check, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ReturnRequest } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { initialReturnRequests } from '@/data/seed';

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReturns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/returns');
      if (res.ok) setReturns(await res.json());
      else setReturns(initialReturnRequests);
    } catch {
      setReturns(initialReturnRequests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReturns();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ReturnRequest['status'], restock = false) => {
    try {
      const res = await fetch('/api/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, restock })
      });
      if (res.ok) {
        loadReturns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-brand-500">
          Logística Reversa
        </span>
        <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
          Gestão de Devoluções & Trocas
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Inspeção física de produtos devolvidos, conferência de condição e reintegração automática ao estoque.
        </p>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-950 text-neutral-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Pedido #</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Produto Devolvido</th>
                <th className="py-3 px-4">Motivo Informado</th>
                <th className="py-3 px-4">Condição</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações do Dono</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 font-semibold text-neutral-300">
              {returns.map(ret => (
                <tr key={ret.id} className="hover:bg-dark-850/50">
                  <td className="py-3 px-4 font-mono font-black text-white">#{ret.orderNumber}</td>
                  <td className="py-3 px-4 text-white font-bold">{ret.customerName}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{ret.productName}</p>
                    <p className="text-[11px] text-neutral-500">{ret.variantDesc} • {ret.quantity} un</p>
                  </td>
                  <td className="py-3 px-4 text-neutral-300 max-w-xs">{ret.reason}</td>
                  <td className="py-3 px-4">
                    <span className="bg-dark-800 px-2 py-0.5 rounded text-[11px] font-mono text-neutral-300 capitalize">
                      {ret.condition.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-brand-400">{formatCurrency(ret.refundAmount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      ret.status === 'solicitada'
                        ? 'bg-amber-500/20 text-amber-400'
                        : ret.status === 'aprovada' || ret.status === 'recebida'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {ret.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {ret.status === 'solicitada' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(ret.id, 'aprovada', true)}
                          className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                          title="Aprovar e Devolver ao Estoque"
                        >
                          Aprovar (+Estoque)
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ret.id, 'recusada', false)}
                          className="py-1 px-2.5 rounded-lg bg-dark-800 hover:bg-red-500 text-neutral-400 hover:text-white text-[11px]"
                          title="Recusar Devolução"
                        >
                          Recusar
                        </button>
                      </div>
                    ) : (
                      <span className="text-neutral-500 text-[11px]">Finalizado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
