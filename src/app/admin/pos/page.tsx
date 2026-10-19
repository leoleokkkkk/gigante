'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Store,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Printer,
  DollarSign,
  QrCode,
  CreditCard,
  Banknote,
  Receipt,
  User,
  ArrowRight
} from 'lucide-react';
import { Product, ProductVariant, PaymentMethod } from '@/types';
import { formatCurrency, formatCPF } from '@/lib/utils';
import { initialProducts } from '@/data/seed';

interface PosCartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
}

export default function AdminPOSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCashOpen, setIsCashOpen] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Cart for POS
  const [posCart, setPosCart] = useState<PosCartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  // Confirmation modal
  const [completedSale, setCompletedSale] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, cashRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/cash-register')
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (cashRes.ok) {
          const cashData = await cashRes.json();
          setIsCashOpen(cashData.current?.status === 'open');
        }
      } catch {
        setProducts(initialProducts);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    const firstAvailable = prod.variants.find(v => v.stock > 0) || prod.variants[0];
    setSelectedVariant(firstAvailable || null);
  };

  const handleAddItemToCart = () => {
    if (!selectedProduct || !selectedVariant) return;

    if (selectedVariant.stock <= 0) {
      alert('Variação esgotada no estoque!');
      return;
    }

    const existingIdx = posCart.findIndex(i => i.variant.id === selectedVariant.id);
    if (existingIdx > -1) {
      const currentQty = posCart[existingIdx].quantity;
      if (currentQty + 1 > selectedVariant.stock) {
        alert(`Estoque máximo disponível é ${selectedVariant.stock} unidades.`);
        return;
      }
      const updated = [...posCart];
      updated[existingIdx].quantity += 1;
      setPosCart(updated);
    } else {
      setPosCart([
        ...posCart,
        {
          product: selectedProduct,
          variant: selectedVariant,
          quantity: 1,
          unitPrice: selectedProduct.promoPrice ?? selectedProduct.sellingPrice
        }
      ]);
    }
  };

  const handleUpdateQuantity = (variantId: string, delta: number) => {
    const item = posCart.find(i => i.variant.id === variantId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      setPosCart(posCart.filter(i => i.variant.id !== variantId));
      return;
    }

    if (newQty > item.variant.stock) {
      alert(`Estoque máximo disponível é ${item.variant.stock} unidades.`);
      return;
    }

    setPosCart(posCart.map(i => (i.variant.id === variantId ? { ...i, quantity: newQty } : i)));
  };

  const subtotal = posCart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = Math.max(0, subtotal - discountAmount);

  const handleFinalizeSale = async () => {
    if (posCart.length === 0) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        items: posCart.map(i => ({
          productId: i.product.id,
          variantId: i.variant.id,
          quantity: i.quantity,
          customPrice: i.unitPrice
        })),
        paymentMethod,
        customerName: customerName.trim() || 'Cliente Balcão',
        customerPhone: customerPhone.trim() || '(11) Balcão',
        discount: Number(discountAmount)
      };

      const res = await fetch('/api/pos/sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Erro ao registrar venda.');
        setIsSubmitting(false);
        return;
      }

      setCompletedSale(data);
      setPosCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setDiscountAmount(0);
      setSelectedProduct(null);
      setSelectedVariant(null);
    } catch {
      setErrorMessage('Erro de conexão ao salvar venda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-500">
            Frente de Caixa
          </span>
          <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
            PDV — Vendas Presenciais / Balcão
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Lançamento de vendas físicas com baixa automática no estoque da variação e lançamento no caixa.
          </p>
        </div>

        {!isCashOpen && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>O caixa físico está fechado! Abra o caixa para registrar vendas.</span>
            <Link href="/admin/caixa" className="underline ml-2 text-white">
              Abrir Caixa →
            </Link>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* POS Grid: Left catalog selection, Right sale cart & summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Product Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar tênis por nome, marca ou SKU..."
              className="w-full bg-dark-900 border border-dark-700 rounded-2xl py-3 pl-11 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 font-semibold"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {products
              .filter(p =>
                searchTerm
                  ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.baseSku.toLowerCase().includes(searchTerm.toLowerCase())
                  : true
              )
              .map(p => {
                const isSelected = selectedProduct?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className={`p-2.5 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/20'
                        : 'border-dark-800 bg-dark-900 hover:border-dark-700'
                    }`}
                  >
                    <img
                      src={p.images[0]?.url}
                      alt={p.name}
                      className="w-full aspect-square object-cover rounded-xl bg-dark-950"
                    />
                    <div>
                      <span className="text-[10px] font-black uppercase text-brand-500 block">
                        {p.brandId.replace('b-', '')}
                      </span>
                      <p className="font-bold text-xs text-white truncate">{p.name}</p>
                      <p className="text-xs font-black text-brand-400 mt-0.5">
                        {formatCurrency(p.promoPrice ?? p.sellingPrice)}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Variant Selector for Selected Product */}
          {selectedProduct && (
            <div className="p-5 rounded-3xl bg-dark-900 border border-dark-800 space-y-4 animate-in fade-in-0 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-dark-800">
                <div>
                  <h4 className="font-bold text-sm text-white">{selectedProduct.name}</h4>
                  <p className="text-xs text-neutral-400">Escolha o tamanho e cor para adicionar ao balcão:</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-xs text-neutral-500 hover:text-white"
                >
                  ✕ Cancelar
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProduct.variants.map(v => {
                  const isSel = selectedVariant?.id === v.id;
                  const isOut = v.stock <= 0;

                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={isOut}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-0.5 ${
                        isSel
                          ? 'border-brand-500 bg-brand-500 text-black'
                          : isOut
                          ? 'border-dark-800 bg-dark-950 text-neutral-600 cursor-not-allowed'
                          : 'border-dark-700 bg-dark-950 text-white hover:border-dark-600'
                      }`}
                    >
                      <span className="font-black text-sm">{v.size}</span>
                      <span className="text-[10px] opacity-80">
                        {isOut ? '0 un' : `${v.stock} un`}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleAddItemToCart}
                disabled={!selectedVariant || selectedVariant.stock <= 0}
                className="w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              >
                <span>Adicionar ao Cupom do Balcão</span>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Active POS Cart & Payment (5 cols) */}
        <div className="lg:col-span-5 bg-dark-900 border border-dark-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-500" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Venda Balcão ({posCart.length} itens)
                </h3>
              </div>
              {posCart.length > 0 && (
                <button
                  onClick={() => setPosCart([])}
                  className="text-xs text-neutral-400 hover:text-red-400"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Cart Items list */}
            <div className="divide-y divide-dark-800 max-h-60 overflow-y-auto pr-1 space-y-2">
              {posCart.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-8">
                  Nenhum item adicionado. Selecione um produto e tamanho ao lado.
                </p>
              ) : (
                posCart.map(item => (
                  <div key={item.variant.id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-white truncate">{item.product.name}</p>
                      <p className="text-[11px] text-neutral-400">
                        Tam: <strong className="text-white">{item.variant.size}</strong> • {formatCurrency(item.unitPrice)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center bg-dark-950 border border-dark-700 rounded-lg p-0.5">
                        <button
                          onClick={() => handleUpdateQuantity(item.variant.id, -1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.variant.id, 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-white w-16 text-right">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer & Discount Fields */}
            <div className="pt-4 border-t border-dark-800 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nome do Cliente (opcional)"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Telefone / WhatsApp"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Desconto Balcão (R$):</span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={discountAmount}
                  onChange={e => setDiscountAmount(Number(e.target.value))}
                  className="w-24 bg-dark-950 border border-dark-700 rounded-xl px-2 py-1 text-right text-white font-bold"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Meio de Pagamento
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { key: 'pix', label: 'Pix', icon: QrCode },
                    { key: 'credit_card', label: 'Crédito', icon: CreditCard },
                    { key: 'debit_card', label: 'Débito', icon: CreditCard },
                    { key: 'cash', label: 'Dinheiro', icon: Banknote }
                  ].map(m => (
                    <button
                      key={m.key}
                      onClick={() => setPaymentMethod(m.key as PaymentMethod)}
                      className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === m.key
                          ? 'border-brand-500 bg-brand-500 text-black font-black'
                          : 'border-dark-700 bg-dark-950 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <m.icon className="w-3.5 h-3.5" />
                      <span className="text-[10px]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="pt-4 border-t border-dark-800 space-y-3">
            <div className="flex items-center justify-between text-base font-black">
              <span className="text-neutral-300">Total a Pagar:</span>
              <span className="text-2xl text-brand-400">{formatCurrency(total)}</span>
            </div>

            <button
              onClick={handleFinalizeSale}
              disabled={posCart.length === 0 || isSubmitting || !isCashOpen}
              className="w-full py-4 px-6 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-brand-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Registrando no Caixa...' : 'Concluir Venda e Baixar Estoque'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* POS RECEIPT CONFIRMATION MODAL */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="bg-white text-black p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-4 text-center font-mono">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-base uppercase">GIGANTE MULTIMARCAS</h3>
              <p className="text-[10px] text-gray-500">Av. Paulista, 1578 — Bela Vista, SP</p>
              <p className="text-[10px] text-gray-500">CNPJ: 45.892.103/0001-88</p>
            </div>

            <div className="border-t border-b border-dashed border-gray-300 py-2 text-xs space-y-1 text-left">
              <p><strong>CUPOM NÃO FISCAL:</strong> #{completedSale.orderNumber}</p>
              <p>Data: {new Date().toLocaleString('pt-BR')}</p>
              <p>Cliente: {completedSale.customerName}</p>
              <p>Pagamento: {completedSale.paymentMethod.toUpperCase()}</p>
            </div>

            <div className="text-xs text-left space-y-1">
              {completedSale.items.map((it: any) => (
                <div key={it.id} className="flex justify-between">
                  <span>{it.quantity}x {it.productName} (Tam {it.size})</span>
                  <span>{formatCurrency(it.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-2 text-right font-black text-sm">
              TOTAL PAGO: {formatCurrency(completedSale.total)}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Recibo</span>
              </button>
              <button
                onClick={() => setCompletedSale(null)}
                className="py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
