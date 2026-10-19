'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  Store,
  CreditCard,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatCPF, formatPhone } from '@/lib/utils';
import { PaymentMethod } from '@/types';

type CheckoutStep = 'identification' | 'delivery' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shippingOption, shippingCost, total, coupon, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<CheckoutStep>('identification');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerCpf, setCustomerCpf] = useState('');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Delivery
  const [deliveryType, setDeliveryType] = useState<'shipping' | 'pickup'>('shipping');
  const [address, setAddress] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [installments, setInstallments] = useState(1);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Final Order State
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // If cart is empty and not on confirmation, show empty state
  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-dark-900 border border-dark-800 flex items-center justify-center text-neutral-500">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Seu carrinho está vazio</h2>
          <p className="text-neutral-400 text-sm max-w-sm">
            Adicione produtos ao carrinho antes de prosseguir para o checkout.
          </p>
          <Link href="/produtos" className="px-6 py-2.5 rounded-xl bg-brand-500 text-black font-bold text-xs uppercase">
            Ir às Compras
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Step 1 Validation
  const handleNextFromIdentification = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!customerName.trim() || !customerCpf.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios de identificação.');
      return;
    }
    setStep('delivery');
  };

  // Step 2 Validation
  const handleNextFromDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (deliveryType === 'shipping') {
      if (!address.cep || !address.street || !address.number || !address.neighborhood || !address.city || !address.state) {
        setErrorMessage('Por favor, complete todos os campos do endereço de entrega.');
        return;
      }
    }
    setStep('payment');
  };

  // Submit Order
  const handleConfirmOrder = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        customerName,
        customerCpf,
        customerEmail,
        customerPhone,
        deliveryType,
        shippingAddress: deliveryType === 'shipping' ? address : undefined,
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity
        })),
        paymentMethod,
        couponCode: coupon?.code
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Erro ao processar o pedido.');
        setLoading(false);
        return;
      }

      setConfirmedOrder(data);
      clearCart();
      setStep('confirmation');
    } catch (err: any) {
      setErrorMessage('Erro de conexão ao processar seu pedido.');
    } finally {
      setLoading(false);
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText('00020126580014BR.GOV.BCB.PIX013645892103000188520400005303986540' + confirmedOrder?.total.toFixed(2));
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-950">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress Tracker */}
        {step !== 'confirmation' && (
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-xl mx-auto text-xs font-bold">
              <div className={`flex items-center gap-2 ${step === 'identification' ? 'text-brand-500' : 'text-neutral-400'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step === 'identification' ? 'bg-brand-500 text-black' : 'bg-dark-850'}`}>1</span>
                <span>Identificação</span>
              </div>
              <div className="w-12 h-0.5 bg-dark-800" />
              <div className={`flex items-center gap-2 ${step === 'delivery' ? 'text-brand-500' : 'text-neutral-400'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step === 'delivery' ? 'bg-brand-500 text-black' : 'bg-dark-850'}`}>2</span>
                <span>Entrega</span>
              </div>
              <div className="w-12 h-0.5 bg-dark-800" />
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-brand-500' : 'text-neutral-400'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-brand-500 text-black' : 'bg-dark-850'}`}>3</span>
                <span>Pagamento</span>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: IDENTIFICATION */}
        {step === 'identification' && (
          <div className="max-w-xl mx-auto bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-dark-800">
              <h2 className="font-display text-2xl font-black uppercase text-white tracking-tight">
                1. Seus Dados Pessoais
              </h2>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            <form onSubmit={handleNextFromIdentification} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold uppercase mb-1.5">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Ex: Rodrigo Gigante Silva"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-bold uppercase mb-1.5">
                    CPF (Para emissão de NF) *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerCpf}
                    onChange={e => setCustomerCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold uppercase mb-1.5">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold uppercase mb-1.5">
                  E-mail para envio do comprovante e rastreamento *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-600/20"
              >
                <span>Prosseguir para Entrega</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: DELIVERY */}
        {step === 'delivery' && (
          <div className="max-w-xl mx-auto bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-dark-800">
              <h2 className="font-display text-2xl font-black uppercase text-white tracking-tight">
                2. Método de Recebimento
              </h2>
              <button
                onClick={() => setStep('identification')}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType('shipping')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  deliveryType === 'shipping'
                    ? 'border-brand-500 bg-brand-500/10 text-white'
                    : 'border-dark-700 bg-dark-950 text-neutral-400 hover:border-dark-600'
                }`}
              >
                <Truck className="w-6 h-6 text-brand-500" />
                <div>
                  <h4 className="font-bold text-sm text-white">Receber no Endereço</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Envio pelos Correios / Transportadora</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  deliveryType === 'pickup'
                    ? 'border-brand-500 bg-brand-500/10 text-white'
                    : 'border-dark-700 bg-dark-950 text-neutral-400 hover:border-dark-600'
                }`}
              >
                <Store className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="font-bold text-sm text-white">Retirada na Loja</h4>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">Grátis (Av. Paulista, 1578)</p>
                </div>
              </button>
            </div>

            {deliveryType === 'pickup' ? (
              <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-2 text-xs">
                <span className="font-bold text-white text-sm">Instruções para Retirada:</span>
                <p className="text-neutral-300">
                  Retire seu pedido na Gigante Multimarcas (Av. Paulista, 1578 — Loja 12, Bela Vista, São Paulo).
                </p>
                <p className="text-neutral-400">
                  O pedido fica disponível para retirada em até 2 horas úteis após a confirmação do pagamento. Apresente um documento oficial com foto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNextFromDelivery} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-300 font-bold uppercase mb-1">CEP *</label>
                    <input
                      type="text"
                      required
                      value={address.cep}
                      onChange={e => setAddress({ ...address, cep: e.target.value.slice(0, 9) })}
                      placeholder="00000-000"
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-bold uppercase mb-1">Estado (UF) *</label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={e => setAddress({ ...address, state: e.target.value.toUpperCase().slice(0, 2) })}
                      placeholder="SP"
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold uppercase mb-1">Rua / Avenida *</label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={e => setAddress({ ...address, street: e.target.value })}
                    placeholder="Ex: Av. Paulista"
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-bold uppercase mb-1">Número *</label>
                    <input
                      type="text"
                      required
                      value={address.number}
                      onChange={e => setAddress({ ...address, number: e.target.value })}
                      placeholder="1578"
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-neutral-300 font-bold uppercase mb-1">Complemento</label>
                    <input
                      type="text"
                      value={address.complement}
                      onChange={e => setAddress({ ...address, complement: e.target.value })}
                      placeholder="Apto 42, Bloco B"
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-300 font-bold uppercase mb-1">Bairro *</label>
                    <input
                      type="text"
                      required
                      value={address.neighborhood}
                      onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                      placeholder="Bela Vista"
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-bold uppercase mb-1">Cidade *</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                      placeholder="São Paulo"
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </form>
            )}

            <button
              onClick={handleNextFromDelivery}
              className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-600/20"
            >
              <span>Prosseguir para Pagamento</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: PAYMENT & REVIEW */}
        {step === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-dark-800">
                <h2 className="font-display text-2xl font-black uppercase text-white tracking-tight">
                  3. Forma de Pagamento
                </h2>
                <button
                  onClick={() => setStep('delivery')}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-brand-500 bg-brand-500/10 text-white font-bold'
                      : 'border-dark-700 bg-dark-950 text-neutral-400 hover:border-dark-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="block text-sm text-white">Pix Imediato</span>
                    <span className="text-[11px] text-emerald-400 font-bold">5% de desconto</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'border-brand-500 bg-brand-500/10 text-white font-bold'
                      : 'border-dark-700 bg-dark-950 text-neutral-400 hover:border-dark-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-brand-400" />
                  <div>
                    <span className="block text-sm text-white">Cartão de Crédito</span>
                    <span className="text-[11px] text-neutral-400">Até 10x sem juros</span>
                  </div>
                </button>
              </div>

              {/* PIX DETAILS */}
              {paymentMethod === 'pix' && (
                <div className="p-5 rounded-2xl bg-dark-950 border border-dark-800 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pagamento instantâneo via Pix com 5% de desconto aplicado</span>
                  </div>
                  <p className="text-neutral-400">
                    O QR Code e o código Copia e Cola serão exibidos na tela seguinte após clicar em &quot;Confirmar Pedido&quot;. A aprovação do pagamento é automática e o estoque é reservado na hora.
                  </p>
                </div>
              )}

              {/* CREDIT CARD FIELDS */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-neutral-300 font-bold uppercase mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardData.number}
                      onChange={e => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold uppercase mb-1">Nome Impresso no Cartão</label>
                    <input
                      type="text"
                      placeholder="NOME COMO NO CARTAO"
                      value={cardData.name}
                      onChange={e => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-300 font-bold uppercase mb-1">Validade (MM/AA)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardData.expiry}
                        onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 font-bold uppercase mb-1">CVV / Cód. Segurança</label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold uppercase mb-1">Parcelamento</label>
                    <select
                      value={installments}
                      onChange={e => setInstallments(Number(e.target.value))}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-xs font-semibold"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>
                          {n}x de {formatCurrency(total / n)} sem juros
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span>Processando Pedido e Baixando Estoque...</span>
                ) : (
                  <>
                    <span>Confirmar e Finalizar Pedido</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* ORDER REVIEW SUMMARY (5 Cols) */}
            <div className="lg:col-span-5 bg-dark-900 border border-dark-800 rounded-3xl p-6 space-y-4 h-fit">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider pb-3 border-b border-dark-800">
                Resumo da Compra ({items.reduce((a, b) => a + b.quantity, 0)} itens)
              </h3>

              <div className="divide-y divide-dark-800 max-h-72 overflow-y-auto pr-1 space-y-3">
                {items.map(item => (
                  <div key={item.variantId} className="pt-3 flex gap-3 text-xs">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-xl bg-dark-950 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{item.product.name}</p>
                      <p className="text-neutral-400 text-[11px]">
                        Tam: <span className="font-bold text-white">{item.variant.size}</span> | Qtd: {item.quantity}
                      </p>
                      <p className="text-brand-400 font-bold mt-1">
                        {formatCurrency((item.product.promoPrice ?? item.product.sellingPrice) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-dark-800 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Desconto</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-white font-semibold">
                    {deliveryType === 'pickup' || shippingCost === 0 ? (
                      <span className="text-emerald-400 font-bold">Grátis</span>
                    ) : (
                      formatCurrency(shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-dark-800">
                  <span>Total</span>
                  <span className="text-brand-400">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMED ORDER & PIX */}
        {step === 'confirmation' && confirmedOrder && (
          <div className="max-w-2xl mx-auto bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-10 text-center space-y-6 animate-in fade-in-0 duration-300">
            <div className="w-18 h-18 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                PEDIDO GERADO COM SUCESSO!
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mt-1">
                {confirmedOrder.orderNumber}
              </h2>
              <p className="text-xs text-neutral-400 mt-2 max-w-md mx-auto">
                Obrigado, <strong className="text-white">{confirmedOrder.customerName}</strong>! Seu pedido foi registrado no sistema e o estoque das variações foi atualizado automaticamente.
              </p>
            </div>

            {/* PIX Payment Box */}
            {confirmedOrder.paymentMethod === 'pix' && (
              <div className="p-6 rounded-2xl bg-dark-950 border border-dark-800 space-y-4 text-xs max-w-md mx-auto">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Pagamento via Pix (Copia e Cola)
                </span>

                <div className="w-40 h-40 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  {/* Visual QR Code Representation */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=GIGANTE_MULTIMARCAS_${confirmedOrder.orderNumber}_VALOR_${confirmedOrder.total}`}
                    alt="QR Code Pix"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-neutral-400">Chave Pix Copia e Cola:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`00020126580014BR.GOV.BCB.PIX013645892103000188520400005303986540${confirmedOrder.total.toFixed(2)}`}
                      className="flex-1 bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-[11px] text-neutral-300 font-mono"
                    />
                    <button
                      onClick={copyPixKey}
                      className="px-4 py-2 rounded-xl bg-brand-500 text-black font-bold text-xs flex items-center gap-1.5"
                    >
                      {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Order summary info */}
            <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Pago:</span>
                <span className="font-bold text-white text-sm">{formatCurrency(confirmedOrder.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Modalidade:</span>
                <span className="font-bold text-neutral-200">
                  {confirmedOrder.deliveryType === 'pickup' ? 'Retirada na Loja Física' : 'Envio pelos Correios'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Status Atual:</span>
                <span className="font-bold text-brand-400 uppercase">
                  {confirmedOrder.orderStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href={`/pedido/${confirmedOrder.orderNumber}`}
                className="py-3.5 px-6 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/20"
              >
                <span>Acompanhar Pedido na Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="py-3.5 px-6 rounded-2xl bg-dark-800 hover:bg-dark-700 text-white font-bold text-xs uppercase inline-flex items-center justify-center transition-all"
              >
                Voltar à Página Inicial
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
