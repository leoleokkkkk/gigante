'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  Store,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Flame,
  MessageCircle,
  Check,
  ChevronRight,
  Info,
  Ruler,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

interface ProductDetailClientProps {
  initialProduct: Product | null;
  slug: string;
}

export default function ProductDetailClient({ initialProduct, slug }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product] = useState<Product | null>(initialProduct);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Default select first variant with stock > 0, or first variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    if (!initialProduct) return null;
    return initialProduct.variants.find(v => v.stock > 0) || initialProduct.variants[0] || null;
  });

  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState('');
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [addedMessage, setAddedMessage] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white">Produto não encontrado</h2>
          <p className="text-neutral-400 text-sm">O produto solicitado pode ter sido descontinuado ou movido.</p>
          <Link href="/produtos" className="px-6 py-2.5 rounded-xl bg-brand-500 text-black font-bold text-xs uppercase">
            Voltar ao Catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = product.promoPrice ?? product.sellingPrice;
  const hasPromo = product.promoPrice && product.promoPrice < product.sellingPrice;
  const discountPercent = hasPromo
    ? Math.round(((product.sellingPrice - product.promoPrice!) / product.sellingPrice) * 100)
    : 0;

  const installmentValue = currentPrice / 10;
  const pixPrice = currentPrice * 0.95; // 5% discount on Pix

  const selectedStock = selectedVariant ? selectedVariant.stock : 0;
  const isSelectedOutOfStock = selectedStock <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const res = addToCart(product, selectedVariant, quantity);
    if (res.success) {
      setAddedMessage('Adicionado ao carrinho com sucesso!');
      setTimeout(() => setAddedMessage(''), 3000);
    } else {
      alert(res.message);
    }
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    const res = addToCart(product, selectedVariant, quantity);
    if (res.success) {
      router.push('/checkout');
    } else {
      alert(res.message);
    }
  };

  const handleSimulateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.length >= 8) {
      setShippingCalculated(true);
    }
  };

  const whatsappMessage = `Olá Gigante Multimarcas! Tenho interesse no produto: ${product.name}${
    selectedVariant ? ` (Tamanho: ${selectedVariant.size}, Cor: ${selectedVariant.color})` : ''
  }. Está disponível?`;

  return (
    <div className="flex flex-col min-h-screen bg-dark-950">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Início</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/produtos" className="hover:text-white transition-colors">Produtos</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-200 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main Section: Gallery + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Photos Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails Column */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-dark-900 ${
                    selectedImageIdx === idx
                      ? 'border-brand-500 shadow-lg shadow-brand-500/20 scale-95'
                      : 'border-dark-800 hover:border-dark-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Interactive Photo */}
            <div className="flex-1 relative aspect-square rounded-3xl overflow-hidden bg-dark-900 border border-dark-800 group shadow-2xl">
              <img
                src={product.images[selectedImageIdx]?.url || product.images[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
              />

              {/* Badges on main image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-white" />
                    {discountPercent}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-brand-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    LANÇAMENTO
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white shadow-xl shadow-red-500/50'
                    : 'bg-dark-900/80 text-neutral-300 hover:text-white hover:bg-dark-800'
                }`}
                title="Favoritar produto"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Purchasing Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-500">
                {product.brandId.replace('b-', '')}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                SKU: <span className="text-neutral-300 font-mono">{product.baseSku}</span>
              </p>
            </div>

            {/* Pricing Box */}
            <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">
                  {formatCurrency(currentPrice)}
                </span>
                {hasPromo && (
                  <span className="text-base text-neutral-500 line-through">
                    {formatCurrency(product.sellingPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-emerald-400 font-bold">
                <Zap className="w-4 h-4 fill-emerald-400" />
                <span>{formatCurrency(pixPrice)} no Pix à vista (5% OFF)</span>
              </div>

              <p className="text-xs text-neutral-400">
                ou em até <span className="font-bold text-white">10x de {formatCurrency(installmentValue)}</span> sem juros no cartão
              </p>
            </div>

            {/* VARIANTS SELECTOR: TAMANHOS & ESTOQUE INDEPENDENTE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Selecione o Tamanho
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Guia de Medidas
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.variants.map(variant => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const isOut = variant.stock <= 0;

                  return (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setQuantity(1);
                      }}
                      className={`relative py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500 text-black shadow-lg shadow-brand-500/20 scale-105'
                          : isOut
                          ? 'border-dark-800 bg-dark-900/40 text-neutral-600 cursor-not-allowed'
                          : 'border-dark-700 bg-dark-900 text-neutral-200 hover:border-dark-600'
                      }`}
                    >
                      <span className="font-black text-sm">{variant.size}</span>
                      {isOut ? (
                        <span className="text-[9px] font-bold text-neutral-600">Esgotado</span>
                      ) : variant.stock <= variant.minStock ? (
                        <span className={`text-[9px] font-bold ${isSelected ? 'text-black' : 'text-amber-400'}`}>
                          Apenas {variant.stock}!
                        </span>
                      ) : (
                        <span className={`text-[9px] ${isSelected ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {variant.stock} unid.
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Variant Stock Feedback */}
              {selectedVariant && (
                <div className="text-xs flex items-center gap-2 pt-1">
                  {selectedVariant.stock <= 0 ? (
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Esgotado nesta numeração. Escolha outro tamanho.
                    </span>
                  ) : selectedVariant.stock <= selectedVariant.minStock ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Flame className="w-4 h-4 fill-amber-400" />
                      Corre! Restam apenas {selectedVariant.stock} unidades disponíveis no tamanho {selectedVariant.size}.
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Em estoque ({selectedVariant.stock} disponíveis) — Envio imediato!
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quantity Selector & Purchase Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-dark-900 border border-dark-700 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1 || isSelectedOutOfStock}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-300 hover:text-white hover:bg-dark-800 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(selectedStock, prev + 1))}
                    disabled={quantity >= selectedStock || isSelectedOutOfStock}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-300 hover:text-white hover:bg-dark-800 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isSelectedOutOfStock}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-dark-900 hover:bg-dark-850 border border-dark-700 hover:border-brand-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-500" />
                  <span>Adicionar ao Carrinho</span>
                </button>
              </div>

              {/* Buy Now Button - Support Green */}
              <button
                onClick={handleBuyNow}
                disabled={isSelectedOutOfStock}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Comprar Agora</span>
              </button>

              {/* WhatsApp direct inquiry button */}
              <a
                href={`https://wa.me/5511987654321?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar com a Gigante Multimarcas no WhatsApp</span>
              </a>

              {addedMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{addedMessage}</span>
                </div>
              )}
            </div>

            {/* Shipping Simulator & Store Pickup */}
            <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-500" />
                Calcular Frete e Prazos
              </span>

              <form onSubmit={handleSimulateShipping} className="flex gap-2">
                <input
                  type="text"
                  value={cep}
                  onChange={e => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="Digite seu CEP (ex: 01310200)"
                  className="flex-1 bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-white font-bold text-xs"
                >
                  Calcular
                </button>
              </form>

              {shippingCalculated && (
                <div className="space-y-2 pt-2 border-t border-dark-800 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-950">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-brand-400" />
                      <div>
                        <p className="font-bold text-white">Retirada na Loja Física</p>
                        <p className="text-[11px] text-neutral-400">Av. Paulista, 1578 — Loja 12</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-bold">Grátis (Em 2h)</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-950">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-400" />
                      <div>
                        <p className="font-bold text-white">Correios SEDEX Express</p>
                        <p className="text-[11px] text-neutral-400">Entrega em 1 a 2 dias úteis</p>
                      </div>
                    </div>
                    <span className="font-bold text-white">R$ 28,50</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-950">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-400" />
                      <div>
                        <p className="font-bold text-white">Correios PAC Convencional</p>
                        <p className="text-[11px] text-neutral-400">Entrega em 4 a 6 dias úteis</p>
                      </div>
                    </div>
                    <span className="font-bold text-white">
                      {currentPrice >= 299 ? (
                        <span className="text-emerald-400">Grátis</span>
                      ) : (
                        'R$ 18,90'
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Full Description */}
        <div className="mt-16 pt-10 border-t border-dark-800 space-y-6">
          <h2 className="font-display text-2xl font-black uppercase text-white tracking-tight">
            Descrição & Detalhes do Produto
          </h2>
          <div className="prose prose-invert max-w-none text-sm text-neutral-300 leading-relaxed space-y-4">
            <p>{product.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800">
              <span className="text-[11px] font-bold text-neutral-500 uppercase">Marca</span>
              <p className="font-bold text-white text-sm mt-0.5">{product.brandId.replace('b-', '').toUpperCase()}</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800">
              <span className="text-[11px] font-bold text-neutral-500 uppercase">Gênero</span>
              <p className="font-bold text-white text-sm mt-0.5 capitalize">{product.gender}</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800">
              <span className="text-[11px] font-bold text-neutral-500 uppercase">Peso Aproximado</span>
              <p className="font-bold text-white text-sm mt-0.5">{product.weightKg} kg (com caixa)</p>
            </div>
            <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800">
              <span className="text-[11px] font-bold text-neutral-500 uppercase">Garantia</span>
              <p className="font-bold text-white text-sm mt-0.5">90 dias contra defeitos</p>
            </div>
          </div>
        </div>

        {/* Size Guide Modal */}
        {showSizeGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-dark-800">
                <h3 className="font-bold text-lg">Guia de Tamanhos Oficial</h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-neutral-400">
                Meça o comprimento da palmilha ou do seu pé descalço do calcanhar ao dedão:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-dark-700 text-neutral-400">
                      <th className="py-2">Tamanho BR</th>
                      <th className="py-2">US</th>
                      <th className="py-2">EUR</th>
                      <th className="py-2">Comprimento (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-800 font-semibold">
                    <tr><td className="py-2 text-white">38</td><td>7.0</td><td>39</td><td>25.0 cm</td></tr>
                    <tr><td className="py-2 text-white">39</td><td>7.5</td><td>40</td><td>25.5 cm</td></tr>
                    <tr><td className="py-2 text-white">40</td><td>8.5</td><td>41</td><td>26.5 cm</td></tr>
                    <tr><td className="py-2 text-white">41</td><td>9.5</td><td>42</td><td>27.5 cm</td></tr>
                    <tr><td className="py-2 text-white">42</td><td>10.0</td><td>43</td><td>28.0 cm</td></tr>
                    <tr><td className="py-2 text-white">43</td><td>11.0</td><td>44</td><td>29.0 cm</td></tr>
                    <tr><td className="py-2 text-white">44</td><td>12.0</td><td>45</td><td>30.0 cm</td></tr>
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => setShowSizeGuide(false)}
                className="w-full py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-xs font-bold"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
