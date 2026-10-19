'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Truck,
  Printer,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Package
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatCurrency, formatDate, formatCPF, formatPhone } from '@/lib/utils';
import { initialOrders } from '@/data/seed';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Order for Modal View
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Shipment Edit State
  const [carrierInput, setCarrierInput] = useState('Correios');
  const [serviceInput, setServiceInput] = useState('SEDEX');
  const [trackingInput, setTrackingInput] = useState('');
  const [weightInput, setWeightInput] = useState(0.8);
  const [heightInput, setHeightInput] = useState(12);
  const [widthInput, setWidthInput] = useState(20);
  const [lengthInput, setLengthInput] = useState(32);

  // Printable Shipping Declaration State
  const [printDeclarationOrder, setPrintDeclarationOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        setOrders(await res.json());
      } else {
        setOrders(initialOrders);
      }
    } catch {
      setOrders(initialOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOpenOrder = (order: Order) => {
    setActiveOrder(order);
    setCarrierInput(order.shipment?.carrier || 'Correios');
    setServiceInput(order.shipment?.serviceName || 'SEDEX');
    setTrackingInput(order.shipment?.trackingCode || '');
    setWeightInput(order.shipment?.weightKg || 0.8);
    setHeightInput(order.shipment?.heightCm || 12);
    setWidthInput(order.shipment?.widthCm || 20);
    setLengthInput(order.shipment?.lengthCm || 32);
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!activeOrder) return;
    try {
      const res = await fetch(`/api/orders/${activeOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          actor: 'Rodrigo Gigante (Dono)'
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setActiveOrder(updated);
        loadOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    try {
      const res = await fetch(`/api/orders/${activeOrder.id}/shipment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier: carrierInput,
          serviceName: serviceInput,
          trackingCode: trackingInput.trim().toUpperCase(),
          weightKg: Number(weightInput),
          heightCm: Number(heightInput),
          widthCm: Number(widthInput),
          lengthCm: Number(lengthInput)
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setActiveOrder(updated);
        loadOrders();
        alert('Dados de envio e rastreamento atualizados com sucesso!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (selectedStatus !== 'todos' && o.orderStatus !== selectedStatus) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(term);
      const matchName = o.customerName.toLowerCase().includes(term);
      const matchCpf = o.customerCpf.toLowerCase().includes(term);
      const matchTrack = o.shipment?.trackingCode?.toLowerCase().includes(term);
      if (!matchNum && !matchName && !matchCpf && !matchTrack) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-500">
            Controle de Vendas
          </span>
          <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
            Gestão de Pedidos & Expedição
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Acompanhe pedidos, atualize status, cadastre códigos dos Correios e imprima declarações de conteúdo.
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-dark-800 text-xs font-bold scrollbar-none">
        {[
          { key: 'todos', label: 'Todos os Pedidos' },
          { key: 'em_separacao', label: 'Em Separação' },
          { key: 'pronto_envio', label: 'Pronto para Envio' },
          { key: 'enviado', label: 'Enviados' },
          { key: 'em_transito', label: 'Em Trânsito' },
          { key: 'entregue', label: 'Entregues' },
          { key: 'pronto_retirada', label: 'Retirada na Loja' },
          { key: 'cancelado', label: 'Cancelados' },
          { key: 'devolvido', label: 'Devolvidos' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedStatus(tab.key)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              selectedStatus === tab.key
                ? 'bg-brand-500 text-black shadow-md'
                : 'bg-dark-900 text-neutral-400 hover:text-white border border-dark-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar por #GM, cliente, CPF ou rastreio..."
          className="w-full bg-dark-900 border border-dark-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
        />
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Orders Table */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-950 text-neutral-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Pedido #</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Data</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Rastreio</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 font-semibold text-neutral-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    Nenhum pedido encontrado nesta categoria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-dark-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-white">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white truncate max-w-[140px]">{order.customerName}</p>
                      <p className="text-[11px] text-neutral-500">{order.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-neutral-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.deliveryType === 'pickup'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {order.deliveryType === 'pickup' ? 'Retirada' : 'Correios'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-dark-800 text-brand-400 px-2.5 py-1 rounded-full text-[11px] font-black uppercase">
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {order.shipment?.trackingCode ? (
                        <span className="text-white font-bold">{order.shipment.trackingCode}</span>
                      ) : (
                        <span className="text-neutral-500">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenOrder(order)}
                        className="p-2 rounded-xl bg-dark-800 hover:bg-brand-500 hover:text-black text-neutral-200 transition-colors"
                        title="Ver e Gerenciar Pedido"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS & EXPEDITION MODAL */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setActiveOrder(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-4xl max-h-[90vh] bg-dark-900 border border-dark-700 rounded-3xl text-white shadow-2xl z-10 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-dark-800 flex items-center justify-between bg-dark-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                  📦
                </div>
                <div>
                  <h3 className="font-display text-2xl font-black uppercase text-white">
                    Pedido #{activeOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Criado em {formatDate(activeOrder.createdAt)} • Status atual:{' '}
                    <span className="font-bold text-brand-400 uppercase">
                      {activeOrder.orderStatus.replace('_', ' ')}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Print Shipping Statement Button */}
                {activeOrder.deliveryType === 'shipping' && (
                  <button
                    onClick={() => setPrintDeclarationOrder(activeOrder)}
                    className="py-2 px-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-dark-700"
                    title="Imprimir Declaração dos Correios"
                  >
                    <Printer className="w-4 h-4 text-brand-500" />
                    <span>Declaração Correios</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveOrder(null)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* STATUS CHANGER BUTTONS */}
              <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-2">
                <span className="font-bold uppercase tracking-wider text-neutral-400 block text-[11px]">
                  Alterar Status do Pedido
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'pago',
                    'em_separacao',
                    'pronto_envio',
                    'enviado',
                    'em_transito',
                    'entregue',
                    'pronto_retirada',
                    'retirado',
                    'cancelado'
                  ].map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(st as OrderStatus)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold uppercase transition-all ${
                        activeOrder.orderStatus === st
                          ? 'bg-brand-500 text-black shadow-md'
                          : 'bg-dark-900 border border-dark-700 text-neutral-300 hover:border-dark-600'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Customer Data + Delivery Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-2">
                  <span className="font-bold text-white uppercase text-[11px] block text-brand-400">
                    Dados do Cliente
                  </span>
                  <p><strong className="text-neutral-400">Nome:</strong> {activeOrder.customerName}</p>
                  <p><strong className="text-neutral-400">CPF:</strong> {activeOrder.customerCpf}</p>
                  <p><strong className="text-neutral-400">E-mail:</strong> {activeOrder.customerEmail}</p>
                  <p><strong className="text-neutral-400">Telefone:</strong> {activeOrder.customerPhone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-2">
                  <span className="font-bold text-white uppercase text-[11px] block text-brand-400">
                    Dados de Entrega / Destinatário
                  </span>
                  {activeOrder.deliveryType === 'pickup' ? (
                    <p className="text-emerald-400 font-bold">Retirada na Loja Física (Av. Paulista, 1578)</p>
                  ) : activeOrder.shippingAddress ? (
                    <div className="space-y-1 text-neutral-300">
                      <p>{activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.number} {activeOrder.shippingAddress.complement || ''}</p>
                      <p>{activeOrder.shippingAddress.neighborhood} — {activeOrder.shippingAddress.city}/{activeOrder.shippingAddress.state}</p>
                      <p>CEP: {activeOrder.shippingAddress.cep}</p>
                    </div>
                  ) : (
                    <p className="text-neutral-500">Endereço não informado.</p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
                <span className="font-bold text-white uppercase text-[11px] block text-brand-400">
                  Itens Comprados ({activeOrder.items.length})
                </span>
                <div className="divide-y divide-dark-800">
                  {activeOrder.items.map(item => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded-xl bg-dark-900 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white">{item.productName}</p>
                          <p className="text-[11px] text-neutral-400">
                            Tam: <strong className="text-white">{item.size}</strong> • Cor: {item.color} • SKU: {item.sku}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-white">{item.quantity}x {formatCurrency(item.unitPrice)}</p>
                        <p className="text-[11px] text-brand-400 font-black">{formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-dark-800 flex justify-between font-bold text-sm text-white">
                  <span>Total do Pedido:</span>
                  <span className="text-brand-400">{formatCurrency(activeOrder.total)}</span>
                </div>
              </div>

              {/* EXPEDITION & CORREIOS MANAGEMENT FORM (ITEM 15 & 27) */}
              {activeOrder.deliveryType === 'shipping' && (
                <div className="p-5 rounded-2xl bg-dark-950 border border-brand-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-brand-500" />
                      <h4 className="font-bold text-sm text-white uppercase">
                        Gestão de Envio & Rastreamento (Correios / Transportadora)
                      </h4>
                    </div>
                    <span className="text-[10px] bg-dark-800 px-2 py-0.5 rounded text-neutral-400 font-mono">
                      Logística Oficial
                    </span>
                  </div>

                  <form onSubmit={handleSaveShipment} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-neutral-400 font-bold mb-1">Transportadora</label>
                        <input
                          type="text"
                          value={carrierInput}
                          onChange={e => setCarrierInput(e.target.value)}
                          placeholder="Correios"
                          className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-bold mb-1">Serviço / Modalidade</label>
                        <input
                          type="text"
                          value={serviceInput}
                          onChange={e => setServiceInput(e.target.value)}
                          placeholder="SEDEX"
                          className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-bold mb-1">Código de Rastreamento</label>
                        <input
                          type="text"
                          value={trackingInput}
                          onChange={e => setTrackingInput(e.target.value.toUpperCase())}
                          placeholder="AA123456789BR"
                          className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className="block text-neutral-400 font-bold mb-1">Peso (kg)</label>
                        <input
                          type="number"
                          step="0.05"
                          value={weightInput}
                          onChange={e => setWeightInput(Number(e.target.value))}
                          className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-bold mb-1">Altura (cm)</label>
                        <input
                          type="number"
                          value={heightInput}
                          onChange={e => setHeightInput(Number(e.target.value))}
                          className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-bold mb-1">Largura (cm)</label>
                        <input
                          type="number"
                          value={widthInput}
                          onChange={e => setWidthInput(Number(e.target.value))}
                          className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-bold mb-1">Comprimento (cm)</label>
                        <input
                          type="number"
                          value={lengthInput}
                          onChange={e => setLengthInput(Number(e.target.value))}
                          className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase"
                    >
                      Salvar Dados de Envio & Atualizar Timeline
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE CORREIOS SHIPPING STATEMENT (DECLARAÇÃO DE CONTEÚDO) MODAL */}
      {printDeclarationOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/90">
          <div className="bg-white text-black p-8 rounded-2xl max-w-3xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-300">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg">DECLARAÇÃO DE CONTEÚDO (PADRÃO CORREIOS)</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="py-2 px-4 rounded-xl bg-black text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Salvar PDF</span>
                </button>
                <button
                  onClick={() => setPrintDeclarationOrder(null)}
                  className="py-2 px-3 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Sender and Recipient Boxes */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-gray-300 p-4 rounded-xl">
              <div>
                <span className="font-bold uppercase text-gray-700 block border-b border-gray-200 pb-1 mb-2">
                  REMETENTE:
                </span>
                <p className="font-bold">GIGANTE MULTIMARCAS LTDA</p>
                <p>CNPJ: 45.892.103/0001-88</p>
                <p>Avenida Paulista, 1578 — Loja 12</p>
                <p>Bela Vista — São Paulo / SP</p>
                <p>CEP: 01310-200</p>
              </div>

              <div>
                <span className="font-bold uppercase text-gray-700 block border-b border-gray-200 pb-1 mb-2">
                  DESTINATÁRIO:
                </span>
                <p className="font-bold">{printDeclarationOrder.customerName}</p>
                <p>CPF: {printDeclarationOrder.customerCpf}</p>
                {printDeclarationOrder.shippingAddress && (
                  <>
                    <p>{printDeclarationOrder.shippingAddress.street}, {printDeclarationOrder.shippingAddress.number} {printDeclarationOrder.shippingAddress.complement || ''}</p>
                    <p>{printDeclarationOrder.shippingAddress.neighborhood} — {printDeclarationOrder.shippingAddress.city}/{printDeclarationOrder.shippingAddress.state}</p>
                    <p>CEP: {printDeclarationOrder.shippingAddress.cep}</p>
                  </>
                )}
              </div>
            </div>

            {/* Package Specifications & Tracking Code Barcode */}
            <div className="border border-gray-300 p-4 rounded-xl text-xs flex justify-between items-center">
              <div>
                <span className="font-bold block">Código de Rastreamento Correios:</span>
                <span className="font-mono text-base font-black tracking-widest">
                  {printDeclarationOrder.shipment?.trackingCode || 'AGUARDANDO GERAÇÃO'}
                </span>
                <p className="text-[11px] text-gray-500 mt-1">
                  Serviço: {printDeclarationOrder.shipment?.serviceName || 'SEDEX'} | Peso: {printDeclarationOrder.shipment?.weightKg || 0.8} kg
                </p>
              </div>

              <div className="text-center font-mono">
                {/* Visual Barcode Mockup */}
                <div className="h-10 w-44 bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold">
                  |||||||||||||||||||||||||||||||
                </div>
                <span className="text-[10px] text-gray-500">#{printDeclarationOrder.orderNumber}</span>
              </div>
            </div>

            {/* Declaration Items */}
            <div className="border border-gray-300 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2">Discriminação do Conteúdo</th>
                    <th className="p-2 text-center">Qtd</th>
                    <th className="p-2 text-right">Valor Declarado (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {printDeclarationOrder.items.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2 font-bold">{item.productName} (Tam {item.size})</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan={3} className="p-2 text-right">TOTAL DECLARADO:</td>
                    <td className="p-2 text-right">{formatCurrency(printDeclarationOrder.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Legal Statement */}
            <p className="text-[10px] text-gray-500 text-justify">
              Declaro que não me enquadro no conceito de contribuinte previsto no art. 4º da Lei Complementar nº 87/1996 e que não estou postando mercadorias com intuito comercial habitual nesta encomenda, sob as penas da lei.
            </p>

            <div className="pt-4 flex justify-between text-xs text-gray-600">
              <p>São Paulo, {new Date().toLocaleDateString('pt-BR')}</p>
              <p className="border-t border-gray-400 pt-1 px-8">Assinatura do Remetente</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
