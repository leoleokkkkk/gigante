'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, Phone, Mail, MapPin } from 'lucide-react';
import { Customer } from '@/types';
import { formatCurrency, formatCPF } from '@/lib/utils';
import { initialCustomers } from '@/data/seed';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch('/api/customers');
        if (res.ok) setCustomers(await res.json());
        else setCustomers(initialCustomers);
      } catch {
        setCustomers(initialCustomers);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const filtered = customers.filter(c => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(term) || c.cpf.includes(term) || c.email.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-brand-500">
          Relacionamento & CRM
        </span>
        <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
          Gestão de Clientes
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Histórico consolidado de compras, valores gastos e dados de contato dos clientes da loja.
        </p>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar cliente por nome, CPF ou e-mail..."
          className="w-full bg-dark-900 border border-dark-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
        />
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-950 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">CPF</th>
                <th className="py-3 px-4">Contatos</th>
                <th className="py-3 px-4">Total de Pedidos</th>
                <th className="py-3 px-4">Total Gasto (LTV)</th>
                <th className="py-3 px-4">Última Compra</th>
                <th className="py-3 px-4">Endereço Principal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 font-semibold text-neutral-300">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-dark-850/50">
                  <td className="py-3 px-4">
                    <p className="font-bold text-white text-sm">{c.name}</p>
                    <span className="text-[10px] text-brand-400 uppercase">Cliente Verificado</span>
                  </td>
                  <td className="py-3 px-4 font-mono">{c.cpf}</td>
                  <td className="py-3 px-4">
                    <p className="flex items-center gap-1 text-neutral-300"><Mail className="w-3 h-3 text-neutral-500" /> {c.email}</p>
                    <p className="flex items-center gap-1 text-neutral-400 mt-0.5"><Phone className="w-3 h-3 text-neutral-500" /> {c.phone}</p>
                  </td>
                  <td className="py-3 px-4 font-black text-sm text-white">
                    {c.totalOrders} pedidos
                  </td>
                  <td className="py-3 px-4 font-black text-sm text-brand-400">
                    {formatCurrency(c.totalSpent)}
                  </td>
                  <td className="py-3 px-4 text-neutral-400">{c.lastOrderDate || '—'}</td>
                  <td className="py-3 px-4 text-[11px] text-neutral-400 max-w-xs truncate">
                    {c.addresses[0] ? `${c.addresses[0].street}, ${c.addresses[0].number} - ${c.addresses[0].city}` : 'Não cadastrado'}
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
