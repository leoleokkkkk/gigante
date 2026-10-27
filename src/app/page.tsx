'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Zap,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Clock,
  Phone,
  Instagram,
  Facebook,
  Award,
  Truck,
  Lock
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Product, Banner, Brand, Category } from '@/types';
import { initialBanners, initialBrands, initialCategories, initialProducts } from '@/data/seed';

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [activeTab, setActiveTab] = useState<'novidades' | 'mais_vendidos' | 'ofertas'>('novidades');

  // Load live data from API if available
  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, banRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/banners')
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (banRes.ok) setBanners(await banRes.json());
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  // Banner carousel auto rotate
  useEffect(() => {
    const activeBanners = banners.filter(b => b.active);
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIdx(prev => (prev + 1) % activeBanners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners]);

  const activeBanners = banners.filter(b => b.active);
  const currentBanner = activeBanners[currentBannerIdx] || activeBanners[0];

  // Filtered products for tabs
  const filteredProducts = products.filter(p => {
    if (activeTab === 'novidades') return p.isNew;
    if (activeTab === 'mais_vendidos') return p.isBestSeller;
    if (activeTab === 'ofertas') return p.promoPrice && p.promoPrice < p.sellingPrice;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-dark-950">
      <Header />

      <main className="flex-1">
        {/* MOBILE HERO BANNER (100% proporcional — a imagem diminui para caber certinho na tela) */}
        <section className="sm:hidden w-full bg-black border-b border-neutral-900">
          {/* Banner Image scaling down with 100% width and natural aspect ratio */}
          <Link href="/produtos" className="block w-full relative overflow-hidden group">
            <img
              src="/images/hero_banner_complete.jpg"
              alt="Gigante's Multimarcas — Seu Estilo, Sua Marca, Seu Momento"
              className="w-full h-auto object-contain block select-none"
            />
          </Link>

          {/* Mobile Actions & Trust Strip right below the banner */}
          <div className="px-4 py-4 bg-black space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/produtos"
                className="py-3 px-4 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 text-center active:scale-95 transition-all"
              >
                <span>EXPLORAR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/produtos?ofertas=true"
                className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider border border-neutral-700 flex items-center justify-center gap-1.5 text-center active:scale-95 transition-all"
              >
                <Flame className="w-3.5 h-3.5 text-[#ef4444] fill-[#ef4444]" />
                <span>OFERTAS</span>
              </Link>
            </div>

            {/* 3 Compact Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-850">
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/70">
                <ShieldCheck className="w-4 h-4 text-neutral-200 mb-1" />
                <span className="text-[10px] font-bold text-white leading-tight">Originais</span>
                <span className="text-[8.5px] text-neutral-400">Garantidos</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/70">
                <Truck className="w-4 h-4 text-neutral-200 mb-1" />
                <span className="text-[10px] font-bold text-white leading-tight">Todo o Brasil</span>
                <span className="text-[8.5px] text-neutral-400">Rastreável</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/70">
                <Lock className="w-4 h-4 text-neutral-200 mb-1" />
                <span className="text-[10px] font-bold text-white leading-tight">Compra Segura</span>
                <span className="text-[8.5px] text-neutral-400">Protegida</span>
              </div>
            </div>
          </div>
        </section>

        {/* DESKTOP HERO BANNER (Para telas sm, md, lg, xl — 100% interativo e imersivo) */}
        <section className="hidden sm:flex relative w-full sm:min-h-[640px] lg:min-h-[700px] overflow-hidden bg-black border-b border-neutral-900 flex-col justify-center">
          {/* Background Sneaker Imagery with Ambient Red Neon Glow */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero_banner_clean.jpg"
              alt="Air Jordan 1 Retro — Gigante's Multimarcas"
              className="w-full h-full object-cover object-center filter brightness-95"
            />
            {/* Vignette gradients for text readability on desktop */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          </div>

          {/* Foreground Hero Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 py-16 flex flex-col justify-center">
            <div className="max-w-2xl space-y-4">
              {/* Tagline Bar */}
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#dc2626] rounded-full inline-block" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-300">
                  MODA URBANA • SNEAKERS • STREETWEAR
                </span>
              </div>

              {/* Massive 3-Line Headline */}
              <h1 className="font-display text-5xl md:text-6xl lg:text-[76px] font-black uppercase tracking-tight leading-[0.92]">
                <span className="block text-white">SEU ESTILO.</span>
                <span className="block text-[#dc2626]">SUA MARCA.</span>
                <span className="block text-white">SEU MOMENTO.</span>
              </h1>

              {/* Subtitle Description */}
              <p className="text-sm lg:text-base text-neutral-300 font-normal max-w-xl leading-relaxed pt-2">
                Os tênis, roupas e acessórios mais exclusivos da cultura streetwear, com qualidade, autenticidade e as melhores marcas do mercado.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-5">
                <Link
                  href="/produtos"
                  className="py-3.5 px-8 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <span>EXPLORAR PRODUTOS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/produtos?ofertas=true"
                  className="py-3.5 px-7 rounded-xl bg-black/60 hover:bg-neutral-900 text-white font-bold text-sm uppercase tracking-wider border border-neutral-700/80 hover:border-white backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-white" />
                  <span>VER OFERTAS</span>
                </Link>
              </div>

              {/* Bottom Trust & Feature Strip */}
              <div className="pt-10 grid grid-cols-3 gap-6 border-t border-neutral-800/80 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-neutral-800 bg-neutral-900/80 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-neutral-200" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">Produtos originais</h4>
                    <p className="text-[11px] text-neutral-400">Com garantia de autenticidade</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-neutral-800 bg-neutral-900/80 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                    <Truck className="w-5 h-5 text-neutral-200" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">Entrega para todo o Brasil</h4>
                    <p className="text-[11px] text-neutral-400">Com rastreamento</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-neutral-800 bg-neutral-900/80 flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                    <Lock className="w-5 h-5 text-neutral-200" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">Compra segura</h4>
                    <p className="text-[11px] text-neutral-400">Seus dados protegidos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIAS EM DESTAQUE */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-500">
                Departamentos
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
                Compre por Categoria
              </h2>
            </div>
            <Link
              href="/produtos"
              className="text-xs sm:text-sm font-bold text-neutral-400 hover:text-brand-400 flex items-center gap-1 transition-colors"
            >
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/produtos?categoria=${cat.id}`}
                className="group relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-dark-800 bg-dark-900 shadow-xl"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 filter brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight group-hover:text-brand-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-neutral-300 mt-1 line-clamp-1">{cat.description}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* BRANDS TICKER / GRID */}
        <section className="border-y border-dark-850 py-8 bg-dark-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-black uppercase tracking-widest text-neutral-500 mb-6">
              Marcas Oficiais Parceiras na Gigante Multimarcas
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
              {brands.map(brand => (
                <Link
                  key={brand.id}
                  href={`/produtos?marca=${brand.id}`}
                  className="px-4 py-2 rounded-xl bg-dark-900 border border-dark-800 hover:border-brand-500 text-neutral-400 hover:text-white transition-all text-sm font-black uppercase tracking-wider hover:scale-105"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* VITRINE DE PRODUTOS INTERATIVA (TABS: NOVIDADES / MAIS VENDIDOS / OFERTAS) */}
        <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-500">
                Seleção Exclusiva
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
                Destaques da Loja
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-dark-900 p-1 sm:p-1.5 rounded-2xl border border-dark-800 overflow-x-auto no-scrollbar max-w-full">
              <button
                onClick={() => setActiveTab('novidades')}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'novidades'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Novidades 2026
              </button>
              <button
                onClick={() => setActiveTab('mais_vendidos')}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'mais_vendidos'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Mais Vendidos
              </button>
              <button
                onClick={() => setActiveTab('ofertas')}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  activeTab === 'ofertas'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                Ofertas
              </button>
            </div>
          </div>

          {/* Products Grid — 2 columns on mobile, up to 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.slice(0, 8).map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 py-3.5 px-6 sm:px-8 rounded-2xl bg-dark-900 hover:bg-dark-800 text-white font-bold text-xs uppercase tracking-wider border border-dark-700 transition-all hover:scale-105"
            >
              <span>Ver Todos os Produtos ({products.length})</span>
              <ArrowRight className="w-4 h-4 text-brand-500" />
            </Link>
          </div>
        </section>

        {/* BANNER PROMOCIONAL STREETWEAR */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="relative rounded-3xl overflow-hidden border border-brand-500/30 bg-gradient-to-r from-dark-950 via-dark-900 to-dark-950 p-6 sm:p-12 shadow-2xl">
            <div className="max-w-xl space-y-3.5 sm:space-y-4">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20 inline-block">
                CUPOM DE BOAS-VINDAS
              </span>
              <h3 className="font-display text-2xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight">
                GANHE 10% OFF NO SEU PRIMEIRO DROP
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                Utilize o cupom <span className="font-black text-brand-400 bg-dark-800 px-2 py-0.5 rounded">GIGANTE10</span> na finalização do seu pedido para garantir 10% de desconto imediato.
              </p>
              <div className="pt-2">
                <Link
                  href="/produtos"
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all text-center"
                >
                  <span>Aproveitar Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ONDE ESTAMOS — LOJA FÍSICA */}
        <section className="py-12 sm:py-16 bg-dark-900 border-t border-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-brand-500">
                    Nossa Estrutura
                  </span>
                  <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
                    Conheça a Loja Física Gigante Multimarcas
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Localizada no coração de São Paulo, na Avenida Paulista, a loja física da Gigante Multimarcas foi projetada para proporcionar uma experiência imersiva na cultura sneaker e streetwear. Prove os modelos, confira o caimento das roupas e retire seus pedidos feitos no site em até 2 horas.
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-dark-950 border border-dark-800">
                    <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-neutral-300">
                      <p className="font-bold text-white text-xs sm:text-sm">Endereço Principal</p>
                      <p className="mt-0.5">Avenida Paulista, 1578 — Loja 12 (Térreo Comercial)</p>
                      <p>Bela Vista, São Paulo - SP, CEP 01310-200</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-dark-950 border border-dark-800">
                    <Clock className="w-5 h-5 text-brand-500 flex-shrink-0" />
                    <div className="text-xs text-neutral-300">
                      <p className="font-bold text-white text-xs sm:text-sm">Horário de Funcionamento</p>
                      <p className="mt-0.5">Segunda a Sábado: 09:00 às 20:00 | Domingo: 12:00 às 18:00</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                  <a
                    href="https://maps.google.com/?q=Avenida+Paulista+1578+Sao+Paulo"
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/20 text-center"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Como Chegar (Google Maps)</span>
                  </a>

                  <a
                    href="https://wa.me/5511987654321"
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-6 rounded-xl bg-dark-950 hover:bg-dark-800 text-white font-bold text-xs border border-dark-700 inline-flex items-center justify-center gap-2 transition-all text-center"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp da Loja</span>
                  </a>
                </div>
              </div>

              {/* Storefront Aesthetic Image */}
              <div className="relative rounded-3xl overflow-hidden border border-dark-800 shadow-2xl h-[260px] sm:h-[400px]">
                <img
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80"
                  alt="Loja Física Gigante Multimarcas"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                  <span className="bg-brand-500 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                    PONTO FÍSICO OFICIAL
                  </span>
                  <p className="text-white font-black text-base sm:text-lg mt-1.5 sm:mt-2">Gigante Multimarcas Flagship</p>
                  <p className="text-[11px] sm:text-xs text-neutral-300">Av. Paulista, 1578 — Bela Vista, SP</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


      <Footer />
    </div>
  );
}
