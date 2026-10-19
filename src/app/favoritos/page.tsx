'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { initialProducts } from '@/data/seed';

export default function WishlistPage() {
  const { wishlist } = useCart();

  const favoritedProducts = initialProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="flex flex-col min-h-screen bg-dark-950">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="pb-6 border-b border-dark-800 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <span>Meus Favoritos</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              {favoritedProducts.length} itens salvos na sua lista de desejos
            </p>
          </div>

          <Link
            href="/produtos"
            className="text-xs font-bold text-neutral-300 hover:text-brand-400 transition-colors"
          >
            Continuar Explorando
          </Link>
        </div>

        {favoritedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-dark-900 border border-dark-800 flex items-center justify-center mx-auto text-neutral-600">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Sua lista de favoritos está vazia</h2>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Clique no coração nos cards dos produtos para salvá-los e acompanhar a disponibilidade.
            </p>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-500 text-black font-bold text-xs uppercase"
            >
              <span>Ver Produtos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
            {favoritedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
