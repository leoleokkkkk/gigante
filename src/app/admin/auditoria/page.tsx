'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, Shield, Search, Clock, User } from 'lucide-react';
import { AuditLog } from '@/types';
import { formatDate } from '@/lib/utils';
import { initialAuditLogs } from '@/data/seed';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch('/api/audit');
        if (res.ok) setLogs(await res.json());
        else setLogs(initialAuditLogs);
      } catch {
        setLogs(initialAuditLogs);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filtered = logs.filter(l => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      l.action.toLowerCase().includes(term) ||
      l.details.toLowerCase().includes(term) ||
      l.userName.toLowerCase().includes(term) ||
      l.entity.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-brand-500">
          Governança & Segurança
        </span>
        <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
          Trilha de Auditoria do Sistema
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Registro imutável de todas as ações operacionais, alterações de estoque, caixas e pedidos executados no Modo Dono.
        </p>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar nos logs por ação, usuário ou detalhe..."
          className="w-full bg-dark-900 border border-dark-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
        />
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-950 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Usuário</th>
                <th className="py-3 px-4">Papel</th>
                <th className="py-3 px-4">Ação</th>
                <th className="py-3 px-4">Entidade</th>
                <th className="py-3 px-4">Detalhes da Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 font-semibold text-neutral-300">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-dark-850/50">
                  <td className="py-3 px-4 text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                    {formatDate(l.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-500" />
                    <span>{l.userName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                      {l.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold uppercase text-[11px] text-white">
                    {l.action.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                    {l.entity}
                  </td>
                  <td className="py-3 px-4 text-neutral-300 text-xs max-w-md">
                    {l.details}
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
