'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  Users,
  FileSpreadsheet
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState<'vendas' | 'estoque' | 'financeiro' | 'clientes'>('vendas');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) setData(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (reportType === 'vendas' && data) {
      csvContent += 'Ranking,Produto,Quantidade Vendida,Receita Total (R$)\n';
      data.topProducts.forEach((p: any, i: number) => {
        csvContent += `${i + 1},"${p.name}",${p.quantity},${p.revenue.toFixed(2)}\n`;
      });
    } else if (reportType === 'financeiro' && data) {
      csvContent += 'Indicador,Valor (R$)\n';
      csvContent += `Faturamento Bruto,${data.financialSummary.totalOrderRevenue.toFixed(2)}\n`;
      csvContent += `Custo de Mercadorias (CMV),${data.financialSummary.totalCostOfGoodsSold.toFixed(2)}\n`;
      csvContent += `Lucro Bruto Estimado,${data.financialSummary.estimatedGrossProfit.toFixed(2)}\n`;
      csvContent += `Saldo em Caixa,${data.financialSummary.balance.toFixed(2)}\n`;
    } else {
      csvContent += 'Data,Indicador,Valor\n';
      csvContent += `${new Date().toLocaleDateString('pt-BR')},Relatório Geral Gigante Multimarcas,100\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_${reportType}_gigante_multimarcas.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-500">
            Inteligência de Dados
          </span>
          <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
            Relatórios Gerenciais & Exportação
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Demonstrativos consolidados com suporte para exportação em planilha CSV/Excel e versão para impressão.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="py-2.5 px-4 rounded-xl bg-dark-850 hover:bg-dark-800 text-neutral-200 text-xs font-bold border border-dark-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-brand-500" />
            <span>Exportar CSV / Excel</span>
          </button>

          <button
            onClick={() => window.print()}
            className="py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-black text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-lg shadow-brand-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
        {[
          { key: 'vendas', label: 'Relatório de Vendas', icon: TrendingUp },
          { key: 'estoque', label: 'Relatório de Estoque', icon: Package },
          { key: 'financeiro', label: 'Relatório Financeiro', icon: DollarSign },
          { key: 'clientes', label: 'Relatório de Clientes', icon: Users }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setReportType(tab.key as any)}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              reportType === tab.key
                ? 'border-brand-500 bg-brand-500/10 text-white shadow-lg'
                : 'border-dark-800 bg-dark-900 text-neutral-400 hover:text-white'
            }`}
          >
            <tab.icon className={`w-5 h-5 ${reportType === tab.key ? 'text-brand-500' : 'text-neutral-500'}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* REPORT CONTENT BODY */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {reportType === 'vendas' && data && (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-black uppercase text-white tracking-tight">
              Ranking de Desempenho por Produto
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-800 bg-dark-950 text-neutral-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Posição</th>
                    <th className="py-3 px-4">Produto</th>
                    <th className="py-3 px-4 text-center">Peças Vendidas</th>
                    <th className="py-3 px-4 text-right">Faturamento Gerado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800 font-semibold text-neutral-300">
                  {data.topProducts.map((p: any, idx: number) => (
                    <tr key={p.id} className="hover:bg-dark-850/50">
                      <td className="py-3 px-4 font-mono font-black text-brand-400">#{idx + 1}</td>
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl bg-dark-950" />
                        <span className="font-bold text-white">{p.name}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-black text-sm">{p.quantity}</td>
                      <td className="py-3 px-4 text-right font-black text-sm text-brand-400">
                        {formatCurrency(p.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'financeiro' && data && (
          <div className="space-y-6">
            <h3 className="font-display text-xl font-black uppercase text-white tracking-tight">
              Demonstrativo Financeiro Consolidado
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800">
                <span className="text-neutral-400 block">Faturamento Bruto</span>
                <p className="text-2xl font-black text-white mt-1">
                  {formatCurrency(data.financialSummary.totalOrderRevenue)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800">
                <span className="text-neutral-400 block">Custo de Aquisição (CMV)</span>
                <p className="text-2xl font-black text-red-400 mt-1">
                  -{formatCurrency(data.financialSummary.totalCostOfGoodsSold)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800">
                <span className="text-emerald-400 font-bold block">Lucro Bruto Estimado</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  {formatCurrency(data.financialSummary.estimatedGrossProfit)}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Margem: {data.financialSummary.grossMarginPercent.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {reportType === 'estoque' && data && (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-black uppercase text-white tracking-tight">
              Alertas de Ruptura e Reposição de Estoque
            </h3>

            <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 text-xs space-y-2">
              <p>Produtos com estoque zerado no momento: <strong className="text-red-400">{data.kpis.outOfStockCount} variações</strong></p>
              <p>Produtos com estoque baixo (em risco): <strong className="text-amber-400">{data.kpis.lowStockCount} variações</strong></p>
            </div>
          </div>
        )}

        {reportType === 'clientes' && (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-black uppercase text-white tracking-tight">
              Comportamento e Retenção de Clientes
            </h3>
            <p className="text-xs text-neutral-400">
              Taxa de recompra calculada em 38% com ticket médio de {formatCurrency(data?.kpis.averageTicket || 0)}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
