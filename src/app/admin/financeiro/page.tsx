'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Calendar,
  PieChart,
  HelpCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { FinancialTransaction } from '@/types';
import { formatCurrency, formatShortDate } from '@/lib/utils';
import { initialFinancialTransactions } from '@/data/seed';

export default function AdminFinancialPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  // New Transaction Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<'in' | 'out'>('out');
  const [category, setCategory] = useState<any>('aluguel');
  const [amount, setAmount] = useState<number>(100);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [observation, setObservation] = useState('');

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      const [txRes, dashRes] = await Promise.all([
        fetch('/api/financial'),
        fetch('/api/dashboard')
      ]);
      if (txRes.ok) setTransactions(await txRes.json());
      else setTransactions(initialFinancialTransactions);

      if (dashRes.ok) {
        const d = await dashRes.json();
        setMetrics(d.financialSummary);
      }
    } catch {
      setTransactions(initialFinancialTransactions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, []);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) return;

    try {
      const res = await fetch('/api/financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          category,
          amount: Number(amount),
          paymentMethod,
          date,
          description,
          observation
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setDescription('');
        setObservation('');
        loadFinancialData();
      } else {
        alert('Erro ao registrar lançamento financeiro.');
      }
    } catch {
      alert('Erro de conexão ao salvar lançamento.');
    }
  };

  const totalInflow = transactions.filter(t => t.type === 'in').reduce((a, b) => a + b.amount, 0);
  const totalOutflow = transactions.filter(t => t.type === 'out').reduce((a, b) => a + b.amount, 0);
  const balance = totalInflow - totalOutflow;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-500">
            Controladoria & DRE
          </span>
          <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
            Fluxo de Caixa & Lucro Estimado
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Diferenciação clara entre Faturamento Bruto e Margem Bruta Real com base nos custos de mercadoria (CMV).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Lançamento Financeiro</span>
        </button>
      </div>

      {/* DRE / LUCRO ESTIMADO HERO CARD (ITEM 35) */}
      <div className="bg-gradient-to-r from-dark-900 via-dark-900 to-dark-950 border border-brand-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-dark-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
              DEMONSTRATIVO DE RESULTADO (DRE SIMPLIFICADO)
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
            Cálculo baseado em Custo Real dos Produtos Vendidos (CMV)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {/* Faturamento Bruto */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              1. Faturamento Total
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {formatCurrency(metrics?.totalOrderRevenue || totalInflow)}
            </p>
            <p className="text-[11px] text-neutral-500">Receita total com vendas</p>
          </div>

          {/* CMV Custo de Produtos */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              2. Custo das Mercadorias (CMV)
            </span>
            <p className="text-2xl sm:text-3xl font-black text-neutral-300">
              -{formatCurrency(metrics?.totalCostOfGoodsSold || 0)}
            </p>
            <p className="text-[11px] text-neutral-500">Custo de aquisição junto a fornecedores</p>
          </div>

          {/* Lucro Bruto Estimado */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              3. Lucro Bruto Estimado
            </span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatCurrency(metrics?.estimatedGrossProfit || 0)}
            </p>
            <p className="text-[11px] text-emerald-500 font-bold">
              Margem de {metrics?.grossMarginPercent?.toFixed(1) || 0}% sobre vendas
            </p>
          </div>

          {/* Saldo Líquido do Caixa */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">
              4. Saldo em Livro Caixa
            </span>
            <p className={`text-2xl sm:text-3xl font-black ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
              {formatCurrency(balance)}
            </p>
            <p className="text-[11px] text-neutral-500">Entradas gerais (-) Despesas pagas</p>
          </div>
        </div>
      </div>

      {/* INFLOWS VS OUTFLOWS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Entradas</span>
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-1">+{formatCurrency(totalInflow)}</p>
          <p className="text-[11px] text-neutral-500">Vendas online, balcão e créditos</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Saídas / Despesas</span>
            <ArrowDownRight className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-black text-red-400 mt-1">-{formatCurrency(totalOutflow)}</p>
          <p className="text-[11px] text-neutral-500">Aluguel, fornecedores, contas e folha</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Resultado Operacional</span>
            <DollarSign className="w-5 h-5 text-brand-500" />
          </div>
          <p className={`text-2xl font-black mt-1 ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-[11px] text-neutral-500">Saldo consolidado do período</p>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-dark-800 bg-dark-950 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">
            Movimentações do Livro Caixa ({transactions.length} registros)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-950 text-neutral-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Meio</th>
                <th className="py-3 px-4 text-right">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 font-semibold text-neutral-300">
              {transactions.map(t => {
                const isEntry = t.type === 'in';
                return (
                  <tr key={t.id} className="hover:bg-dark-850/50">
                    <td className="py-3 px-4 text-neutral-400">{t.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isEntry ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {isEntry ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold uppercase text-[11px] text-brand-400">
                      {t.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-white">
                      <p>{t.description}</p>
                      {t.observation && <p className="text-[10px] text-neutral-500">{t.observation}</p>}
                    </td>
                    <td className="py-3 px-4 text-neutral-400 uppercase text-[11px]">
                      {t.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-sm">
                      <span className={isEntry ? 'text-emerald-400' : 'text-red-400'}>
                        {isEntry ? `+${formatCurrency(t.amount)}` : `-${formatCurrency(t.amount)}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW TRANSACTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="font-bold text-lg">Novo Lançamento Financeiro</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('in')}
                  className={`p-2.5 rounded-xl border font-bold text-center ${
                    type === 'in' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-dark-700 bg-dark-950 text-neutral-400'
                  }`}
                >
                  Entrada (Receita)
                </button>
                <button
                  type="button"
                  onClick={() => setType('out')}
                  className={`p-2.5 rounded-xl border font-bold text-center ${
                    type === 'out' ? 'border-red-500 bg-red-500/20 text-red-400' : 'border-dark-700 bg-dark-950 text-neutral-400'
                  }`}
                >
                  Saída (Despesa)
                </button>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Categoria *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-white capitalize font-semibold"
                >
                  <option value="venda">Venda</option>
                  <option value="fornecedor">Fornecedor / Mercadorias</option>
                  <option value="aluguel">Aluguel do Ponto</option>
                  <option value="energia">Energia Elétrica</option>
                  <option value="internet">Internet / Telefonia</option>
                  <option value="funcionario">Folha de Pagamento</option>
                  <option value="compra_estoque">Compra de Estoque</option>
                  <option value="transporte">Fretes / Motoboy</option>
                  <option value="marketing">Marketing & Anúncios</option>
                  <option value="taxas">Taxas Bancárias / Cartão</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Descrição do Lançamento *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Pagamento conta Enel ou fornecedor Nike"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black uppercase text-xs tracking-wider"
              >
                Salvar no Livro Caixa
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
