'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Zap, Flame, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const secondaryImage = product.images.find(img => img.isSecondary) || product.images[1] || primaryImage;

  const currentPrice = product.promoPrice ?? product.sellingPrice;
  const hasPromo = product.promoPrice && product.promoPrice < product.sellingPrice;
  const discountPercent = hasPromo
    ? Math.round(((product.sellingPrice - product.promoPrice!) / product.sellingPrice) * 100)
    : 0;

  const installmentValue = currentPrice / 10;
  const pixPrice = currentPrice * 0.95; // 5% discount on Pix

  // Calculate total stock across variants
  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
  const isOutOfStock = totalStock <= 0;

  // Available sizes
  const availableSizes = product.variants.filter(v => v.stock > 0).map(v => v.size);

  const isFavorited = isInWishlist(product.id);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-dark-900 border border-dark-800 hover:border-dark-700 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Image Gallery Container with Hover Transition */}
      <div className="relative aspect-square w-full overflow-hidden bg-dark-950">
        <Link href={`/produto/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && secondaryImage ? secondaryImage.url : primaryImage.url}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <Zap className="w-2.5 h-2.5 fill-white" />
              {discountPercent}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-brand-500 text-black text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <Sparkles className="w-2.5 h-2.5" />
              NOVO
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-dark-800/90 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 fill-amber-400" />
              TOP
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={e => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 ${
            isFavorited
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/40'
              : 'bg-dark-900/80 text-neutral-300 hover:text-white hover:bg-dark-800'
          }`}
          title={isFavorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorited ? 'fill-white' : ''}`} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="bg-neutral-800 text-neutral-300 border border-neutral-700 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 sm:px-3 py-1 rounded-full">
              Esgotado
            </span>
          </div>
        )}

        {/* Quick Sizes Strip on Hover */}
        {!isOutOfStock && availableSizes.length > 0 && (
          <div className="hidden sm:block absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <div className="flex items-center justify-center gap-1 flex-wrap">
              <span className="text-[10px] font-bold text-neutral-400 mr-1">Tamanhos:</span>
              {availableSizes.slice(0, 6).map((sz, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold bg-dark-800 border border-dark-700 text-neutral-200 px-1.5 py-0.5 rounded"
                >
                  {sz}
                </span>
              ))}
              {availableSizes.length > 6 && (
                <span className="text-[9px] font-bold text-brand-400">+{availableSizes.length - 6}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand Tag */}
          <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-brand-500">
            {product.brandId.replace('b-', '')}
          </span>

          {/* Product Title */}
          <Link href={`/produto/${product.slug}`} className="block mt-0.5 sm:mt-1">
            <h3 className="font-bold text-xs sm:text-sm text-neutral-100 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-brand-400 transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Installments Box */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-dark-800">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-lg font-black text-white">
              {formatCurrency(currentPrice)}
            </span>
            {hasPromo && (
              <span className="text-[10px] sm:text-xs text-neutral-500 line-through">
                {formatCurrency(product.sellingPrice)}
              </span>
            )}
          </div>

          {/* Pix & Installment Details */}
          <div className="mt-1 flex flex-col gap-0.5">
            <p className="text-[9px] sm:text-[11px] font-semibold text-emerald-400">
              {formatCurrency(pixPrice)} no Pix (5% OFF)
            </p>
            <p className="text-[9px] sm:text-[11px] text-neutral-400">
              ou 10x de {formatCurrency(installmentValue)} s/ juros
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-2 sm:mt-3">
            <Link
              href={`/produto/${product.slug}`}
              className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-dark-850 hover:bg-brand-600 hover:text-white border border-dark-750 hover:border-brand-500 text-neutral-200 text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-center group/btn shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
              <span>Ver Detalhes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

