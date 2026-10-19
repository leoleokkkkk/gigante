'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  Truck,
  RotateCcw,
  CheckCircle2,
  Wallet,
  Sparkles,
  Store,
  ChevronRight,
  Flame
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState<'7days' | 'month'>('7days');

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Carregando métricas gerenciais...</p>
        </div>
      </div>
    );
  }

  const { kpis, actionCenter, topProducts, last7Days, financialSummary } = data;

  // Max value for SVG bar chart scaling
  const maxDayRevenue = Math.max(...last7Days.map((d: any) => d.revenue), 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-500">
            Painel Gerencial
          </span>
          <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
            Visão Geral da Loja
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Dados operacionais em tempo real derivados diretamente do banco de dados relacional.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pos"
            className="py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
          >
            <Store className="w-4 h-4" />
            <span>Venda no Balcão (PDV)</span>
          </Link>
          <Link
            href="/admin/produtos"
            className="py-2.5 px-4 rounded-xl bg-dark-850 hover:bg-dark-800 text-white font-bold text-xs uppercase border border-dark-700"
          >
            + Novo Produto
          </Link>
        </div>
      </div>

      {/* 8 ESSENTIAL KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Faturamento Hoje */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Faturamento Hoje</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{formatCurrency(kpis.revenueToday)}</p>
          <p className="text-[11px] text-neutral-500">{kpis.salesCountToday} vendas confirmadas hoje</p>
        </div>

        {/* Faturamento do Mês */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Faturamento do Mês</span>
            <TrendingUp className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-black text-white">{formatCurrency(kpis.revenueMonth)}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">Margem Bruta Est.: {financialSummary.grossMarginPercent.toFixed(1)}%</p>
        </div>

        {/* Vendas Hoje */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Vendas Hoje</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{kpis.salesCountToday}</p>
          <p className="text-[11px] text-neutral-500">Unidades vendidas: {kpis.unitsSoldTotal}</p>
        </div>

        {/* Pedidos Pendentes */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pedidos Pendentes</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{kpis.pendingOrdersCount}</p>
          <p className="text-[11px] text-neutral-500">Aguardando separação / envio</p>
        </div>

        {/* Produtos Vendidos */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Produtos Vendidos</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{kpis.unitsSoldTotal}</p>
          <p className="text-[11px] text-neutral-500">Histórico total consolidado</p>
        </div>

        {/* Ticket Médio */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Ticket Médio</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-black text-white">{formatCurrency(kpis.averageTicket)}</p>
          <p className="text-[11px] text-neutral-500">Média por pedido fechado</p>
        </div>

        {/* Estoque Baixo */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Estoque Baixo</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-400">{kpis.lowStockCount}</p>
          <p className="text-[11px] text-neutral-500">Variações abaixo do mínimo</p>
        </div>

        {/* Produtos Esgotados */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Produtos Esgotados</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-black text-red-400">{kpis.outOfStockCount}</p>
          <p className="text-[11px] text-neutral-500">Variações com estoque zero</p>
        </div>
      </div>

      {/* CENTRAL DE OPERAÇÕES: "ATENÇÃO NECESSÁRIA" (ITEM 51 DO EDITAL) */}
      <section id="atencao" className="bg-dark-900 border border-brand-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-dark-800 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <h2 className="font-display text-xl font-black uppercase text-white tracking-tight">
                Atenção Necessária — Central de Operações
              </h2>
              <p className="text-xs text-neutral-400">
                Itens prioritários que demandam ação imediata do proprietário para manter o fluxo operacional.
              </p>
            </div>
          </div>
          <span className="text-xs bg-brand-500/10 text-brand-400 border border-brand-500/30 px-3 py-1 rounded-full font-bold self-start sm:self-auto">
            Central Ativa
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Action 1: Pedidos em Separação / Envio */}
          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Aguardando Separação ({actionCenter.pendingOrders.length})
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            </div>
            <p className="text-xs text-neutral-400">
              Pedidos pagos prontos para empacotamento e expedição aos Correios.
            </p>
            <div className="space-y-1.5">
              {actionCenter.pendingOrders.slice(0, 2).map((o: any) => (
                <div key={o.id} className="flex justify-between items-center text-xs bg-dark-900 p-2 rounded-lg">
                  <span className="font-mono font-bold text-white">#{o.orderNumber}</span>
                  <span className="text-neutral-400">{formatCurrency(o.total)}</span>
                  <Link href={`/admin/pedidos`} className="text-brand-400 font-bold hover:underline">
                    Separar →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Action 2: Pedidos sem código de rastreamento */}
          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Sem Código de Rastreio ({actionCenter.missingTrackingOrders.length})
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Pedidos para envio via Correios/Jadlog que ainda não possuem código cadastrado.
            </p>
            <Link
              href="/admin/pedidos"
              className="w-full py-2 px-3 rounded-xl bg-dark-900 hover:bg-dark-850 text-xs font-bold text-white border border-dark-700 block text-center"
            >
              Cadastrar Rastreamento Correios
            </Link>
          </div>

          {/* Action 3: Estoque Crítico ou Zerado */}
          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Estoque Crítico ({actionCenter.criticalVariants.length} Variações)
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Tamanhos esgotados ou abaixo do estoque mínimo de segurança.
            </p>
            <div className="space-y-1">
              {actionCenter.criticalVariants.slice(0, 2).map((cv: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-[11px] bg-dark-900 p-1.5 rounded-lg">
                  <span className="text-neutral-200 truncate max-w-[140px]">{cv.productName} ({cv.size})</span>
                  <span className={`font-bold ${cv.stock === 0 ? 'text-red-400' : 'text-amber-400'}`}>
                    {cv.stock === 0 ? 'Esgotado' : `${cv.stock} un`}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/admin/estoque"
              className="w-full py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold block text-center"
            >
              Repor Estoque
            </Link>
          </div>

          {/* Action 4: Caixa Aberto / Fechado */}
          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                Status do Caixa Físico
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${actionCenter.isCashOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {actionCenter.isCashOpen ? 'ABERTO' : 'FECHADO'}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Saldo em gaveta esperado: <strong className="text-white">{formatCurrency(kpis.cashRegisterBalance)}</strong>
            </p>
            <Link
              href="/admin/caixa"
              className="w-full py-2 px-3 rounded-xl bg-dark-900 hover:bg-dark-850 text-xs font-bold text-white border border-dark-700 block text-center"
            >
              {actionCenter.isCashOpen ? 'Conferir / Fechar Caixa' : 'Abrir Caixa do Dia'}
            </Link>
          </div>

          {/* Action 5: Devoluções Pendentes */}
          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                Devoluções Solicitadas ({actionCenter.pendingReturns.length})
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Solicitações de troca ou devolução aguardando inspeção do produto.
            </p>
            <Link
              href="/admin/devolucoes"
              className="w-full py-2 px-3 rounded-xl bg-dark-900 hover:bg-dark-850 text-xs font-bold text-white border border-dark-700 block text-center"
            >
              Analisar Devoluções
            </Link>
          </div>
        </div>
      </section>

      {/* CHARTS SECTION & RANKING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dynamic Interactive Revenue Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-dark-800">
            <div>
              <h3 className="font-display text-xl font-black uppercase text-white tracking-tight">
                Faturamento dos Últimos 7 Dias
              </h3>
              <p className="text-xs text-neutral-400">Evolução de receitas brutas confirmadas</p>
            </div>
            <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full">
              Última Semana
            </span>
          </div>

          {/* Pure SVG Animated Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-4">
            {last7Days.map((day: any, idx: number) => {
              const heightPercent = Math.max(12, Math.round((day.revenue / maxDayRevenue) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip value */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] font-bold py-1 px-2 rounded-lg border border-dark-700 whitespace-nowrap pointer-events-none mb-1 shadow-xl">
                    {formatCurrency(day.revenue)} ({day.sales} vendas)
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full max-w-[44px] bg-dark-950 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-xl transition-all duration-700 group-hover:from-brand-500 group-hover:to-brand-300"
                    />
                  </div>

                  {/* Day Label */}
                  <span className="text-[11px] font-bold text-neutral-400 group-hover:text-white transition-colors">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-dark-800 flex justify-between text-xs text-neutral-400">
            <span>Menor dia: R$ 0,00</span>
            <span className="font-bold text-brand-400">Pico do período: {formatCurrency(maxDayRevenue)}</span>
          </div>
        </div>

        {/* TOP PRODUCTS RANKING (5 Cols) */}
        <div className="lg:col-span-5 bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-dark-800">
            <div>
              <h3 className="font-display text-xl font-black uppercase text-white tracking-tight">
                Produtos Mais Vendidos
              </h3>
              <p className="text-xs text-neutral-400">Ranking derivado do banco de vendas</p>
            </div>
            <Flame className="w-5 h-5 text-brand-500 fill-brand-500" />
          </div>

          <div className="divide-y divide-dark-800 space-y-3">
            {topProducts.map((p: any, idx: number) => (
              <div key={p.id} className="pt-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${
                    idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-neutral-300 text-black' : 'bg-dark-800 text-neutral-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-11 h-11 object-cover rounded-xl bg-dark-950 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate max-w-[180px]">{p.name}</p>
                    <p className="text-[11px] text-neutral-400">{p.quantity} unidades vendidas</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-brand-400 block">{formatCurrency(p.revenue)}</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/relatorios"
            className="w-full py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-neutral-300 text-xs font-bold block text-center border border-dark-700 transition-colors"
          >
            Ver Relatório Completo de Vendas
          </Link>
        </div>
      </div>
    </div>
  );
}
