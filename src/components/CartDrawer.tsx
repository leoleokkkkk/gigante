'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
  Truck,
  Store
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    coupon,
    applyCoupon,
    removeCoupon,
    shippingOption,
    setShippingOption,
    shippingCost,
    total
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplying(true);
    setCouponFeedback(null);
    const result = await applyCoupon(couponInput.trim());
    setIsApplying(false);

    setCouponFeedback({
      message: result.message,
      isError: !result.success
    });

    if (result.success) {
      setCouponInput('');
    }
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-dark-950 border-l border-dark-800 text-white flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-5 border-b border-dark-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-500" />
              <h2 className="font-bold text-base">Seu Carrinho ({items.reduce((a, b) => a + b.quantity, 0)})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-dark-900 border border-dark-800 flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Seu carrinho está vazio</h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                    Explore os tênis, camisetas e acessórios mais hypados da Gigante Multimarcas!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 text-black font-bold text-xs hover:bg-brand-400 transition-colors"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map(item => {
                const currentPrice = item.product.promoPrice ?? item.product.sellingPrice;
                return (
                  <div
                    key={item.variantId}
                    className="p-3.5 rounded-2xl bg-dark-900 border border-dark-800 flex gap-3 relative"
                  >
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl bg-dark-950 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start pr-6">
                        <div>
                          <span className="text-[10px] font-black uppercase text-brand-500">
                            {item.product.brandId.replace('b-', '')}
                          </span>
                          <h4 className="text-xs font-bold text-neutral-100 truncate">{item.product.name}</h4>
                        </div>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
                        <span className="bg-dark-800 px-2 py-0.5 rounded border border-dark-700 font-semibold text-neutral-200">
                          Tam: {item.variant.size}
                        </span>
                        <span className="bg-dark-800 px-2 py-0.5 rounded border border-dark-700 text-neutral-300 truncate">
                          {item.variant.color}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-dark-950 border border-dark-700 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.stock}
                            className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-dark-800 transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-white">
                            {formatCurrency(currentPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-red-400 transition-colors p-1"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer with Coupons & Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-dark-800 bg-dark-900/60 space-y-4">
              {/* Coupon Form */}
              <div className="space-y-1.5">
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-brand-500" />
                      <span className="font-bold text-brand-400">Cupom {coupon.code} aplicado</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-neutral-400 hover:text-white text-xs underline font-semibold"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Cupom (ex: GIGANTE10)"
                      className="flex-1 bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 uppercase focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-xs font-bold text-white transition-colors"
                    >
                      {isApplying ? '...' : 'Aplicar'}
                    </button>
                  </form>
                )}
                {couponFeedback && (
                  <p className={`text-[11px] font-semibold ${couponFeedback.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Delivery Selection */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Opção de Entrega
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setShippingOption('pickup')}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                      shippingOption === 'pickup'
                        ? 'border-brand-500 bg-brand-500/10 text-white font-bold'
                        : 'border-dark-700 bg-dark-950 text-neutral-400 hover:border-dark-600'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-[10px]">Retirada</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Grátis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingOption('pac')}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                      shippingOption === 'pac'
                        ? 'border-brand-500 bg-brand-500/10 text-white font-bold'
                        : 'border-dark-700 bg-dark-950 text-neutral-400 hover:border-dark-600'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-[10px]">PAC</span>
                    <span className="text-[10px] font-bold">
                      {subtotal >= 299 ? 'Grátis' : 'R$ 18,90'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingOption('sedex')}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                      shippingOption === 'sedex'
                        ? 'border-brand-500 bg-brand-500/10 text-white font-bold'
                        : 'border-dark-700 bg-dark-950 text-neutral-400 hover:border-dark-600'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-[10px]">SEDEX</span>
                    <span className="text-[10px] font-bold">R$ 28,50</span>
                  </button>
                </div>
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-dark-800">
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
                  <span>Frete / Envio</span>
                  <span className="text-white font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-400 font-bold">Grátis</span>
                    ) : (
                      formatCurrency(shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-dark-800">
                  <span>Total</span>
                  <span className="text-base text-brand-400">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout Button - Support Green */}
              <button
                onClick={handleGoToCheckout}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
