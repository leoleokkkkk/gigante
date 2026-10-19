'use client';

import React, { useState, useEffect } from 'react';
import {
  Archive,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  Filter,
  History,
  X
} from 'lucide-react';
import { Product, ProductVariant, InventoryMovement } from '@/types';
import { formatDate } from '@/lib/utils';
import { initialProducts, initialInventoryMovements } from '@/data/seed';

export default function AdminStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAlert, setFilterAlert] = useState<'all' | 'low' | 'zero'>('all');

  // Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [adjustType, setAdjustType] = useState<InventoryMovement['type']>('restock');
  const [quantityDelta, setQuantityDelta] = useState(10);
  const [adjustReason, setAdjustReason] = useState('Reposição de Lote');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, movRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/inventory/adjust')
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      else setProducts(initialProducts);

      if (movRes.ok) setMovements(await movRes.json());
      else setMovements(initialInventoryMovements);
    } catch {
      setProducts(initialProducts);
      setMovements(initialInventoryMovements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Flatten all variants with their product info
  const flattenedVariants = products.flatMap(p =>
    p.variants.map(v => ({
      ...v,
      productId: p.id,
      productName: p.name,
      productImage: p.images[0]?.url || '',
      brand: p.brandId.replace('b-', '').toUpperCase()
    }))
  );

  const filteredVariants = flattenedVariants.filter(v => {
    if (filterAlert === 'zero' && v.stock > 0) return false;
    if (filterAlert === 'low' && (v.stock > v.minStock || v.stock === 0)) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchP = v.productName.toLowerCase().includes(term);
      const matchSku = v.sku.toLowerCase().includes(term);
      const matchSz = v.size.toLowerCase().includes(term);
      if (!matchP && !matchSku && !matchSz) return false;
    }
    return true;
  });

  const handleOpenAdjustModal = (variantId?: string) => {
    setSelectedVariantId(variantId || flattenedVariants[0]?.id || '');
    setAdjustType('restock');
    setQuantityDelta(10);
    setAdjustReason('Reposição de lote com nota fiscal');
    setIsAdjustModalOpen(true);
  };

  const handleConfirmAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) return;

    setIsSubmitting(true);
    try {
      const delta = adjustType === 'sale' ? -Math.abs(quantityDelta) : Math.abs(quantityDelta);

      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedVariantId,
          quantityChange: delta,
          type: adjustType,
          reason: adjustReason,
          userName: 'Rodrigo Gigante (Dono)'
        })
      });

      if (res.ok) {
        setIsAdjustModalOpen(false);
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao realizar movimentação.');
      }
    } catch {
      alert('Erro de conexão ao movimentar estoque.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-500">
            Logística & Almoxarifado
          </span>
          <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
            Controle de Estoque & Movimentações
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Gestão física de estoque por numeração com rastreabilidade de todas as entradas, saídas e vendas.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdjustModal()}
          className="py-2.5 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Ajustar / Entrada de Estoque</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilterAlert('all')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            filterAlert === 'all' ? 'border-brand-500 bg-brand-500/10' : 'border-dark-800 bg-dark-900'
          }`}
        >
          <span className="text-xs font-bold text-neutral-400 uppercase">Total de Variações Cadastradas</span>
          <p className="text-2xl font-black text-white mt-1">{flattenedVariants.length}</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Combinações de tamanhos ativas</p>
        </div>

        <div
          onClick={() => setFilterAlert('low')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            filterAlert === 'low' ? 'border-amber-500 bg-amber-500/10' : 'border-dark-800 bg-dark-900'
          }`}
        >
          <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Estoque Baixo
          </span>
          <p className="text-2xl font-black text-amber-400 mt-1">
            {flattenedVariants.filter(v => v.stock > 0 && v.stock <= v.minStock).length}
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Variações abaixo do estoque de segurança</p>
        </div>

        <div
          onClick={() => setFilterAlert('zero')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            filterAlert === 'zero' ? 'border-red-500 bg-red-500/10' : 'border-dark-800 bg-dark-900'
          }`}
        >
          <span className="text-xs font-bold text-red-400 uppercase flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Produtos / Variações Esgotadas
          </span>
          <p className="text-2xl font-black text-red-400 mt-1">
            {flattenedVariants.filter(v => v.stock === 0).length}
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Necessidade imediata de reposição</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Filtrar variações por modelo, tamanho ou SKU..."
          className="w-full bg-dark-900 border border-dark-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
        />
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Stock Matrix Table */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-dark-800 bg-dark-950 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">
            Posição Atual de Estoque por Variação ({filteredVariants.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-950 text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">Tamanho</th>
                <th className="py-3 px-4">Cor</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Estoque Atual</th>
                <th className="py-3 px-4">Estoque Mín.</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 font-semibold text-neutral-300">
              {filteredVariants.map(v => (
                <tr key={v.id} className="hover:bg-dark-850/50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={v.productImage}
                      alt={v.productName}
                      className="w-10 h-10 object-cover rounded-xl bg-dark-950 flex-shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white truncate max-w-xs">{v.productName}</p>
                      <span className="text-[10px] text-brand-500 font-black">{v.brand}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-black text-sm text-white">{v.size}</td>
                  <td className="py-3 px-4 text-neutral-300">{v.color}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">{v.sku}</td>
                  <td className="py-3 px-4 font-black text-sm text-white">{v.stock} un</td>
                  <td className="py-3 px-4 text-neutral-400">{v.minStock} un</td>
                  <td className="py-3 px-4">
                    {v.stock === 0 ? (
                      <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                        Esgotado
                      </span>
                    ) : v.stock <= v.minStock ? (
                      <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                        Estoque Baixo
                      </span>
                    ) : (
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenAdjustModal(v.id)}
                      className="py-1.5 px-3 rounded-lg bg-dark-800 hover:bg-brand-500 hover:text-black text-neutral-200 text-xs font-bold transition-colors"
                    >
                      Ajustar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECENT INVENTORY MOVEMENTS AUDIT TABLE */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-dark-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-500" />
            <h3 className="font-display text-xl font-black uppercase text-white tracking-tight">
              Histórico de Movimentações Automáticas e Manuais
            </h3>
          </div>
          <span className="text-xs text-neutral-400">{movements.length} registros</span>
        </div>

        <div className="divide-y divide-dark-800 max-h-96 overflow-y-auto pr-1">
          {movements.map(m => {
            const isEntry = m.quantity > 0;
            return (
              <div key={m.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    isEntry ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {isEntry ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">
                      {isEntry ? `+${m.quantity}` : m.quantity} — {m.reason}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      {m.productName} ({m.variantDesc}) • De: {m.previousStock} un → Para: <strong className="text-white">{m.newStock} un</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-neutral-500 font-mono">
                  {formatDate(m.createdAt)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADJUSTMENT MODAL */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="font-bold text-lg">Ajuste de Estoque Manual</h3>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Selecione a Variação</label>
                <select
                  value={selectedVariantId}
                  onChange={e => setSelectedVariantId(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-white"
                >
                  {flattenedVariants.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.productName} — Tam: {v.size} (Estoque atual: {v.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Tipo de Movimento</label>
                  <select
                    value={adjustType}
                    onChange={e => setAdjustType(e.target.value as any)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-white font-bold"
                  >
                    <option value="restock">Entrada / Reposição (+)</option>
                    <option value="purchase">Compra de Lote (+)</option>
                    <option value="adjustment">Ajuste de Contagem (+/-)</option>
                    <option value="return">Devolução Reintegrada (+)</option>
                    <option value="sale">Saída / Baixa (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Quantidade de Peças</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantityDelta}
                    onChange={e => setQuantityDelta(Number(e.target.value))}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-white font-black text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Motivo / Justificativa *</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  placeholder="Ex: Compra de lote fornecedor oficial NF 4910"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-dark-700 text-neutral-400 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black uppercase"
                >
                  {isSubmitting ? 'Salvando...' : 'Confirmar Ajuste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
