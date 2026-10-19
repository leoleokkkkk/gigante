'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Clock,
  User,
  History,
  ArrowRight,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { CashRegister, CashMovement } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { initialCashRegister } from '@/data/seed';

export default function AdminCashRegisterPage() {
  const [currentRegister, setCurrentRegister] = useState<CashRegister | null>(null);
  const [history, setHistory] = useState<CashRegister[]>([]);
  const [loading, setLoading] = useState(true);

  // Open Modal
  const [isOpenModalActive, setIsOpenModalActive] = useState(false);
  const [operatorName, setOperatorName] = useState('Rodrigo Gigante');
  const [openingBalance, setOpeningBalance] = useState(250);

  // Close Modal
  const [isCloseModalActive, setIsCloseModalActive] = useState(false);
  const [countedBalance, setCountedBalance] = useState<number>(0);
  const [discrepancyNote, setDiscrepancyNote] = useState('');
  const [closeError, setCloseError] = useState('');

  // Movement Modal
  const [isMovementModalActive, setIsMovementModalActive] = useState(false);
  const [movType, setMovType] = useState<'in' | 'out'>('in');
  const [movCategory, setMovCategory] = useState<CashMovement['category']>('supply');
  const [movAmount, setMovAmount] = useState(50);
  const [movDescription, setMovDescription] = useState('');
  const [movPaymentMethod, setMovPaymentMethod] = useState<'cash' | 'pix' | 'credit_card'>('cash');

  const loadRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cash-register');
      if (res.ok) {
        const data = await res.json();
        setCurrentRegister(data.current);
        setHistory(data.history || []);
        if (data.current) {
          setCountedBalance(data.current.expectedBalance);
        }
      }
    } catch {
      setCurrentRegister(initialCashRegister);
      setHistory([initialCashRegister]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegister();
  }, []);

  const handleOpenRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cash-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'open',
          operatorName,
          openingBalance: Number(openingBalance)
        })
      });
      if (res.ok) {
        setIsOpenModalActive(false);
        loadRegister();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch {
      alert('Erro de conexão ao abrir caixa.');
    }
  };

  const handleCloseRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setCloseError('');

    try {
      const res = await fetch('/api/cash-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'close',
          countedBalance: Number(countedBalance),
          discrepancyNote
        })
      });

      if (res.ok) {
        setIsCloseModalActive(false);
        loadRegister();
      } else {
        const data = await res.json();
        setCloseError(data.error || 'Erro ao fechar caixa.');
      }
    } catch {
      setCloseError('Erro de conexão ao fechar caixa.');
    }
  };

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movDescription.trim()) return;

    try {
      const res = await fetch('/api/cash-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'movement',
          type: movType,
          category: movCategory,
          paymentMethod: movPaymentMethod,
          amount: Number(movAmount),
          description: movDescription
        })
      });

      if (res.ok) {
        setIsMovementModalActive(false);
        setMovDescription('');
        loadRegister();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch {
      alert('Erro de conexão ao salvar movimentação.');
    }
  };

  const isCashOpen = currentRegister?.status === 'open';
  const expected = currentRegister ? currentRegister.expectedBalance : 0;
  const diff = countedBalance - expected;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-500">
            Tesouraria & Caixa
          </span>
          <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
            Fechamento & Controle de Caixa
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Acompanhe o saldo diário, sangrias, suprimentos e conferência obrigatória de divergências.
          </p>
        </div>

        {isCashOpen ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMovementModalActive(true)}
              className="py-2.5 px-4 rounded-xl bg-dark-850 hover:bg-dark-800 text-white font-bold text-xs uppercase border border-dark-700 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-brand-500" />
              <span>Sangria / Suprimento</span>
            </button>

            <button
              onClick={() => {
                setCountedBalance(expected);
                setIsCloseModalActive(true);
              }}
              className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Fechar Caixa</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsOpenModalActive(true)}
            className="py-2.5 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
          >
            <Wallet className="w-4 h-4" />
            <span>Abrir Caixa do Dia</span>
          </button>
        )}
      </div>

      {/* CURRENT CASH REGISTER STATUS CARD */}
      {isCashOpen && currentRegister ? (
        <div className="bg-dark-900 border border-brand-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-dark-800 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-black px-2.5 py-0.5 rounded-full uppercase">
                  Caixa Aberto
                </span>
                <p className="text-xs text-neutral-400 mt-1">
                  Aberto por <strong className="text-white">{currentRegister.operatorName}</strong> em {formatDate(currentRegister.openedAt)}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-neutral-400 block">Saldo Esperado em Gaveta</span>
              <span className="text-3xl font-black text-brand-400">
                {formatCurrency(currentRegister.expectedBalance)}
              </span>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800">
              <span className="text-neutral-400 block">Fundo Inicial (Troco)</span>
              <p className="text-lg font-black text-white mt-1">
                {formatCurrency(currentRegister.openingBalance)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800">
              <span className="text-neutral-400 block">Total de Entradas</span>
              <p className="text-lg font-black text-emerald-400 mt-1">
                +{formatCurrency(currentRegister.totalInflow)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800">
              <span className="text-neutral-400 block">Total de Saídas / Sangrias</span>
              <p className="text-lg font-black text-red-400 mt-1">
                -{formatCurrency(currentRegister.totalOutflow)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800">
              <span className="text-neutral-400 block">Total de Lançamentos</span>
              <p className="text-lg font-black text-white mt-1">
                {currentRegister.movements.length} operações
              </p>
            </div>
          </div>

          {/* Movements list of this register */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-300">
              Movimentações do Caixa Atual
            </h4>

            <div className="divide-y divide-dark-800 border border-dark-800 rounded-2xl overflow-hidden bg-dark-950/60 max-h-72 overflow-y-auto">
              {currentRegister.movements.map(m => {
                const isEntry = m.type === 'in';
                return (
                  <div key={m.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{m.description}</p>
                      <p className="text-[11px] text-neutral-500">
                        {formatDate(m.timestamp)} • Meio: {m.paymentMethod.toUpperCase()}
                      </p>
                    </div>

                    <span className={`font-black text-sm ${isEntry ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isEntry ? `+${formatCurrency(m.amount)}` : `-${formatCurrency(m.amount)}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-dark-900 border border-dark-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-dark-950 border border-dark-800 flex items-center justify-center text-neutral-500 mx-auto">
            <Wallet className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-white">Nenhum caixa está aberto no momento</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Para realizar vendas presenciais no balcão e registrar movimentações de gaveta, realize a abertura do caixa informando o valor inicial.
          </p>
          <button
            onClick={() => setIsOpenModalActive(true)}
            className="py-3 px-6 rounded-xl bg-brand-500 text-black font-black text-xs uppercase"
          >
            Abrir Caixa Agora
          </button>
        </div>
      )}

      {/* HISTÓRICO DE FECHAMENTOS ANTERIORES */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-dark-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-500" />
            <h3 className="font-display text-xl font-black uppercase text-white tracking-tight">
              Histórico de Fechamentos de Caixa
            </h3>
          </div>
          <span className="text-xs text-neutral-400">{history.length} fechamentos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-950 text-neutral-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Data Abertura</th>
                <th className="py-3 px-4">Operador</th>
                <th className="py-3 px-4">Fundo Inicial</th>
                <th className="py-3 px-4">Valor Esperado</th>
                <th className="py-3 px-4">Valor Contado</th>
                <th className="py-3 px-4">Diferença</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Observação / Justificativa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 font-semibold text-neutral-300">
              {history.map(reg => (
                <tr key={reg.id} className="hover:bg-dark-850/50">
                  <td className="py-3 px-4 text-neutral-400">{formatDate(reg.openedAt)}</td>
                  <td className="py-3 px-4 font-bold text-white">{reg.operatorName}</td>
                  <td className="py-3 px-4">{formatCurrency(reg.openingBalance)}</td>
                  <td className="py-3 px-4 font-black text-white">{formatCurrency(reg.expectedBalance)}</td>
                  <td className="py-3 px-4">
                    {reg.countedBalance !== undefined ? formatCurrency(reg.countedBalance) : '—'}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {reg.difference !== undefined ? (
                      <span className={reg.difference < 0 ? 'text-red-400' : reg.difference > 0 ? 'text-emerald-400' : 'text-neutral-400'}>
                        {formatCurrency(reg.difference)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      reg.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-dark-800 text-neutral-400'
                    }`}>
                      {reg.status === 'open' ? 'Aberto' : 'Fechado'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-400 text-[11px] truncate max-w-xs">
                    {reg.discrepancyNote || 'Sem divergências'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OPEN REGISTER MODAL */}
      {isOpenModalActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="font-bold text-lg">Abertura de Caixa Diário</h3>
              <button onClick={() => setIsOpenModalActive(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleOpenRegister} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Nome do Operador / Caixa *</label>
                <input
                  type="text"
                  required
                  value={operatorName}
                  onChange={e => setOperatorName(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Valor Inicial de Fundo (Troco) R$ *</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  required
                  value={openingBalance}
                  onChange={e => setOpeningBalance(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white font-bold text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black uppercase text-xs tracking-wider"
              >
                Confirmar Abertura do Caixa
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CLOSE REGISTER MODAL (COM CÁLCULO DE DIVERGÊNCIA E NOTA OBRIGATÓRIA) */}
      {isCloseModalActive && currentRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="font-bold text-lg">Fechamento do Caixa</h3>
              <button onClick={() => setIsCloseModalActive(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs bg-dark-950 p-4 rounded-2xl border border-dark-800">
              <div className="flex justify-between">
                <span className="text-neutral-400">Valor Inicial:</span>
                <span className="font-bold text-white">{formatCurrency(currentRegister.openingBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Entradas:</span>
                <span className="font-bold text-emerald-400">+{formatCurrency(currentRegister.totalInflow)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Saídas / Despesas:</span>
                <span className="font-bold text-red-400">-{formatCurrency(currentRegister.totalOutflow)}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-dark-800">
                <span>Valor Esperado pelo Sistema:</span>
                <span className="text-brand-400">{formatCurrency(expected)}</span>
              </div>
            </div>

            <form onSubmit={handleCloseRegister} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  Valor Contado Fisicamente (Gaveta / Espécie) R$ *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={countedBalance}
                  onChange={e => setCountedBalance(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white font-black text-lg"
                />
              </div>

              {/* Difference feedback */}
              <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 flex justify-between items-center">
                <span className="font-bold text-neutral-300">Diferença Apurada:</span>
                <span className={`font-black text-base ${diff < 0 ? 'text-red-400' : diff > 0 ? 'text-emerald-400' : 'text-neutral-400'}`}>
                  {formatCurrency(diff)}
                </span>
              </div>

              {Math.abs(diff) > 0.01 && (
                <div className="space-y-1">
                  <label className="block text-amber-400 font-bold uppercase">
                    Justificativa Obrigatória da Diferença *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={discrepancyNote}
                    onChange={e => setDiscrepancyNote(e.target.value)}
                    placeholder="Ex: Diferença de R$ 10 decorrente de troco ou arredondamento..."
                    className="w-full bg-dark-950 border border-amber-500/40 rounded-xl p-3 text-white"
                  />
                </div>
              )}

              {closeError && <p className="text-xs text-red-400 font-bold">{closeError}</p>}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase text-xs tracking-wider shadow-lg"
              >
                Confirmar Fechamento de Caixa
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SANGRIAS E SUPRIMENTOS MODAL */}
      {isMovementModalActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="font-bold text-lg">Sangria / Suprimento de Caixa</h3>
              <button onClick={() => setIsMovementModalActive(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddMovement} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setMovType('in'); setMovCategory('supply'); }}
                  className={`p-2.5 rounded-xl border font-bold text-center ${
                    movType === 'in' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-dark-700 bg-dark-950 text-neutral-400'
                  }`}
                >
                  Suprimento (+ Entrada)
                </button>
                <button
                  type="button"
                  onClick={() => { setMovType('out'); setMovCategory('bleeding'); }}
                  className={`p-2.5 rounded-xl border font-bold text-center ${
                    movType === 'out' ? 'border-red-500 bg-red-500/20 text-red-400' : 'border-dark-700 bg-dark-950 text-neutral-400'
                  }`}
                >
                  Sangria (- Saída)
                </button>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={movAmount}
                  onChange={e => setMovAmount(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Descrição / Motivo *</label>
                <input
                  type="text"
                  required
                  value={movDescription}
                  onChange={e => setMovDescription(e.target.value)}
                  placeholder="Ex: Retirada para pagamento motoboy ou troco adicional"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black uppercase text-xs"
              >
                Salvar Movimentação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
