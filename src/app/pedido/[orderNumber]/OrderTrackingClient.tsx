'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Order, OrderStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OrderTrackingClientProps {
  initialOrder: Order | null;
  orderNumber: string;
}

export default function OrderTrackingClient({ initialOrder, orderNumber }: OrderTrackingClientProps) {
  const [order] = useState<Order | null>(initialOrder);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-dark-900 border border-dark-800 flex items-center justify-center text-neutral-500">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Pedido não localizado</h2>
          <p className="text-neutral-400 text-xs max-w-sm">
            Não encontramos nenhum pedido com o código &quot;{orderNumber}&quot;. Verifique se digitou o número corretamente (ex: GM-000101).
          </p>
          <Link href="/rastreamento" className="px-6 py-2.5 rounded-xl bg-brand-500 text-black font-bold text-xs uppercase">
            Buscar Novamente
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isPickup = order.deliveryType === 'pickup';

  const deliveryStages: { key: OrderStatus; label: string }[] = isPickup
    ? [
        { key: 'pago', label: 'Pagamento Confirmado' },
        { key: 'em_separacao', label: 'Em Separação' },
        { key: 'pronto_retirada', label: 'Pronto para Retirada' },
        { key: 'retirado', label: 'Retirado na Loja' }
      ]
    : [
        { key: 'pago', label: 'Pagamento Aprovado' },
        { key: 'em_separacao', label: 'Em Separação' },
        { key: 'enviado', label: 'Enviado / Postado' },
        { key: 'em_transito', label: 'Em Trânsito' },
        { key: 'saiu_entrega', label: 'Saiu para Entrega' },
        { key: 'entregue', label: 'Entregue' }
      ];

  const getStageIndex = (status: OrderStatus) => {
    return deliveryStages.findIndex(s => s.key === status);
  };

  const currentStageIndex = getStageIndex(order.orderStatus);

  const copyTracking = () => {
    if (order.shipment?.trackingCode) {
      navigator.clipboard.writeText(order.shipment.trackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-950">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-brand-500">
                Acompanhamento do Pedido
              </span>
              <span className="text-xs bg-dark-800 text-neutral-300 px-2 py-0.5 rounded-full font-bold">
                {isPickup ? 'Retirada na Loja' : 'Envio pelos Correios'}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mt-1">
              Pedido #{order.orderNumber}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Realizado em {formatDate(order.createdAt)} • Cliente: <strong className="text-neutral-200">{order.customerName}</strong>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-neutral-400 block">Total do Pedido</span>
            <span className="text-2xl font-black text-brand-400">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* VISUAL INTERACTIVE TIMELINE */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">
            Status do Envio em Tempo Real
          </h3>

          <div className="relative">
            <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-dark-800 -translate-y-1/2 z-0" />

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 relative z-10">
              {deliveryStages.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx && currentStageIndex !== -1;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stage.key} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-brand-500 text-black ring-4 ring-brand-500/20 shadow-lg scale-110'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-dark-950 border border-dark-700 text-neutral-600'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-black">{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-brand-400 font-black' : isPassed ? 'text-white' : 'text-neutral-500'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CORREIOS TRACKING CODE BOX */}
        {!isPickup && order.shipment?.trackingCode && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-dark-900 to-dark-900/60 border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Código de Rastreamento ({order.shipment.carrier} - {order.shipment.serviceName})
                </span>
                <span className="text-lg font-mono font-black text-white tracking-widest">
                  {order.shipment.trackingCode}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyTracking}
                className="py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
              </button>

              <a
                href={`https://rastreamento.correios.com.br/app/index.php?codigo=${order.shipment.trackingCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-brand-500/20"
              >
                <span>Rastrear no Correios</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* CHRONOLOGICAL EVENT LOG */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider pb-3 border-b border-dark-800">
            Histórico e Ocorrências do Pedido
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-dark-800">
            {order.timeline.map((event, idx) => (
              <div key={event.id || idx} className="relative">
                <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-dark-950" />
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{event.title}</span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-neutral-400 mt-0.5">{event.description}</p>
                  <span className="text-[10px] text-neutral-500 mt-1 inline-block">
                    Registrado por: {event.actor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ITEMS IN THIS ORDER */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider pb-3 border-b border-dark-800">
            Itens do Pedido ({order.items.length})
          </h3>

          <div className="divide-y divide-dark-800">
            {order.items.map(item => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded-xl bg-dark-950 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase text-brand-500">
                      {item.brandName}
                    </span>
                    <h4 className="font-bold text-white text-sm">{item.productName}</h4>
                    <p className="text-neutral-400 text-[11px]">
                      Tamanho: <span className="font-bold text-white">{item.size}</span> • Cor: {item.color} • Qtd: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-white">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
