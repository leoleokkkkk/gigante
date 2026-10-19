'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ShieldAlert,
  Flame,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Truck,
  Tag,
  CreditCard,
  Zap,
  Crown,
  Package,
  Phone
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const { items, setIsCartOpen, wishlist } = useCart();
  const { user, isOwner, setIsOwnerModalOpen, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const totalCartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Close search on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search suggestions debounced
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setSuggestedProducts([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
          setSuggestedProducts(data.products || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowDropdown(false);
    router.push(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSelectSuggestion = (text: string) => {
    setSearchQuery(text);
    setShowDropdown(false);
    router.push(`/produtos?q=${encodeURIComponent(text)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-md border-b border-neutral-900 text-white transition-all select-none">
      {/* Top Red Announcement Banner */}
      <div className="bg-[#dc2626] text-white py-1.5 px-3 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase border-b border-red-700/50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between overflow-x-auto no-scrollbar gap-4 sm:gap-6 whitespace-nowrap">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Truck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>ENVIO EXPRESSO BRASIL</span>
            <span className="opacity-40 ml-3 hidden sm:inline">|</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Tag className="w-3.5 h-3.5 flex-shrink-0" />
            <span>FRETE GRÁTIS ACIMA DE R$ 299</span>
            <span className="opacity-40 ml-3 hidden sm:inline">|</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
            <span>10X SEM JUROS</span>
            <span className="opacity-40 ml-3 hidden lg:inline">|</span>
          </div>
          <Link
            href="/produtos?ofertas=true"
            className="hidden lg:flex items-center gap-1.5 flex-shrink-0 hover:underline"
          >
            <Zap className="w-3.5 h-3.5 fill-white flex-shrink-0" />
            <span>APROVEITE AS OFERTAS</span>
          </Link>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-1 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Official Brand Logo with Crown */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0 py-1">
            <div className="flex flex-col items-center">
              {/* Crown Icon */}
              <div className="flex items-center justify-center text-white mb-0.5">
                <Crown className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-white text-white drop-shadow" />
              </div>
              {/* GIGANTE'S Typography */}
              <span className="font-display text-xl sm:text-2xl md:text-[26px] font-black tracking-tight text-white uppercase leading-none">
                GIGANTE&apos;S
              </span>
              {/* MULTIMARCAS with flanking red dashes */}
              <div className="flex items-center gap-1.5 w-full justify-center mt-0.5">
                <span className="h-[2px] w-2.5 sm:w-4 bg-[#dc2626] rounded-full" />
                <span className="text-[7.5px] sm:text-[9px] font-black tracking-[0.22em] uppercase text-white leading-none">
                  MULTIMARCAS
                </span>
                <span className="h-[2px] w-2.5 sm:w-4 bg-[#dc2626] rounded-full" />
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 font-semibold text-xs tracking-wider uppercase">
            <Link
              href="/"
              className="relative py-1 text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#dc2626] after:rounded-full transition-all"
            >
              INÍCIO
            </Link>
            <Link
              href="/produtos?categoria=cat-tenis"
              className="py-1 text-neutral-300 hover:text-white transition-colors"
            >
              TÊNIS
            </Link>
            <Link
              href="/produtos?categoria=cat-roupas"
              className="py-1 text-neutral-300 hover:text-white transition-colors"
            >
              ROUPAS
            </Link>
            <Link
              href="/produtos?categoria=cat-acessorios"
              className="py-1 text-neutral-300 hover:text-white transition-colors"
            >
              ACESSÓRIOS
            </Link>
            <Link
              href="/produtos"
              className="py-1 text-neutral-300 hover:text-white transition-colors"
            >
              TODAS AS MARCAS
            </Link>
            <Link
              href="/produtos?ofertas=true"
              className="py-1 text-[#ef4444] font-bold hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 text-[#ef4444] fill-[#ef4444]" />
              <span>OFERTAS</span>
            </Link>
          </nav>

          {/* Desktop Search Bar with Autocomplete Suggestions */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                placeholder="Buscar por tênis, marca, camiseta, SKU..."
                className="w-full bg-dark-900 border border-dark-700 rounded-full py-2.5 pl-11 pr-10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowDropdown(false);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs bg-dark-800 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Autocomplete Dropdown Modal */}
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-0 duration-150">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-neutral-400">Pesquisando catálogo...</div>
                ) : (
                  <div>
                    {suggestions.length > 0 && (
                      <div className="p-3 border-b border-dark-800">
                        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2">
                          Sugestões de Busca
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {suggestions.map((s, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelectSuggestion(s)}
                              className="text-xs bg-dark-800 hover:bg-brand-500 hover:text-black text-neutral-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                            >
                              <Search className="w-3 h-3 text-neutral-400" />
                              <span>{s}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {suggestedProducts.length > 0 ? (
                      <div className="p-3">
                        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2">
                          Produtos Encontrados
                        </div>
                        <div className="divide-y divide-dark-800">
                          {suggestedProducts.map(p => (
                            <Link
                              key={p.id}
                              href={`/produto/${p.slug}`}
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-dark-800 transition-colors group"
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 object-cover rounded-lg bg-dark-850 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-neutral-200 truncate group-hover:text-brand-400 transition-colors">
                                  {p.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs font-bold text-white">
                                    {formatCurrency(p.promoPrice ?? p.sellingPrice)}
                                  </span>
                                  {p.promoPrice && (
                                    <span className="text-[10px] text-neutral-500 line-through">
                                      {formatCurrency(p.sellingPrice)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-brand-400 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-neutral-400">
                        Nenhum produto encontrado para &quot;{searchQuery}&quot;
                      </div>
                    )}

                    <div className="bg-dark-950 p-2.5 text-center border-t border-dark-800">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1"
                      >
                        Ver todos os resultados da busca <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Wishlist Link */}
            <Link
              href="/favoritos"
              className="relative p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
              title="Meus Favoritos"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#dc2626] text-white text-[9px] font-black flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors group"
              title="Abrir Carrinho"
            >
              <ShoppingCart className="w-5 h-5 group-hover:text-white transition-colors" />
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#dc2626] text-white text-[10px] font-black flex items-center justify-center">
                {totalCartCount}
              </span>
            </button>

            {/* Painel Dono Button */}
            <div className="relative group">
              <button
                onClick={() => {
                  if (isOwner) {
                    router.push('/admin');
                  } else {
                    setIsOwnerModalOpen(true);
                  }
                }}
                className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 transition-all text-xs font-bold text-white shadow-sm"
                title="Painel Dono"
              >
                <Crown className="w-3.5 h-3.5 text-[#dc2626] fill-[#dc2626]" />
                <span className="hidden sm:inline font-bold text-xs text-white">Painel Dono</span>
                <ChevronDown className="hidden sm:inline w-3 h-3 text-neutral-400 group-hover:text-white transition-colors" />
              </button>

              {/* Account Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-52 bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50">
                {isOwner ? (
                  <>
                    <div className="px-3 py-2 border-b border-dark-800 mb-1">
                      <p className="text-xs font-bold text-brand-400">Modo Dono Ativo</p>
                      <p className="text-[11px] text-neutral-400 truncate">{user?.name}</p>
                    </div>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-dark-800 rounded-lg hover:text-white"
                    >
                      <span>📊 Dashboard ERP</span>
                    </Link>
                    <Link
                      href="/admin/pedidos"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-dark-800 rounded-lg hover:text-white"
                    >
                      <span>📦 Pedidos & Envio</span>
                    </Link>
                    <Link
                      href="/admin/pos"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-dark-800 rounded-lg hover:text-white"
                    >
                      <span>🛒 PDV / Venda Balcão</span>
                    </Link>
                    <Link
                      href="/admin/estoque"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-dark-800 rounded-lg hover:text-white"
                    >
                      <span>👟 Estoque por Variação</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg mt-1"
                    >
                      Sair do Modo Dono
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/minha-conta"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-dark-800 rounded-lg hover:text-white"
                    >
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Minha Conta</span>
                    </Link>
                    <Link
                      href="/rastreamento"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-dark-800 rounded-lg hover:text-white"
                    >
                      <span>📦 Rastrear Pedido</span>
                    </Link>
                    <Link
                      href="/favoritos"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-dark-800 rounded-lg hover:text-white"
                    >
                      <Heart className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Meus Favoritos</span>
                    </Link>
                    <div className="my-1 border-t border-dark-800"></div>
                    <button
                      onClick={() => setIsOwnerModalOpen(true)}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-brand-400 hover:bg-dark-800 rounded-lg"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Acesso Modo Dono</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar with Instant Autocomplete */}
        <div className="pb-3 md:hidden relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
              placeholder="Buscar tênis, marcas, roupas..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-2 pl-9 pr-8 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition-all"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs bg-neutral-800 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </form>

          {/* Mobile Search Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[75vh] overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-center text-xs text-neutral-400">Buscando no catálogo...</div>
              ) : (
                <div>
                  {suggestions.length > 0 && (
                    <div className="p-2.5 border-b border-neutral-800">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 px-1">
                        Sugestões
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectSuggestion(s)}
                            className="text-[11px] bg-neutral-800 hover:bg-[#dc2626] hover:text-white text-neutral-200 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
                          >
                            <Search className="w-2.5 h-2.5 text-neutral-400" />
                            <span>{s}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {suggestedProducts.length > 0 ? (
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 px-1">
                        Produtos
                      </div>
                      <div className="divide-y divide-neutral-800/80">
                        {suggestedProducts.slice(0, 5).map(p => (
                          <Link
                            key={p.id}
                            href={`/produto/${p.slug}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-800 transition-colors"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg bg-neutral-950 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-neutral-200 truncate">
                                {p.name}
                              </h4>
                              <p className="text-[11px] font-bold text-[#dc2626]">
                                {formatCurrency(p.promoPrice ?? p.sellingPrice)}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-xs text-neutral-400">
                      Nenhum resultado para &quot;{searchQuery}&quot;
                    </div>
                  )}

                  <div className="bg-black p-2 text-center border-t border-neutral-800">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-[#dc2626] hover:underline inline-flex items-center gap-1"
                    >
                      Ver todos os resultados <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modern Full-Screen Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col animate-in fade-in-0 duration-200">
          {/* Drawer Top Bar */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-900 bg-black">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="flex flex-col items-center">
                <Crown className="w-3.5 h-3.5 fill-white text-white drop-shadow mb-0.5" />
                <span className="font-display text-lg font-black tracking-tight text-white uppercase leading-none">
                  GIGANTE&apos;S
                </span>
                <div className="flex items-center gap-1 w-full justify-center mt-0.5">
                  <span className="h-[2px] w-2.5 bg-[#dc2626] rounded-full" />
                  <span className="text-[7px] font-black tracking-[0.2em] uppercase text-white leading-none">
                    MULTIMARCAS
                  </span>
                  <span className="h-[2px] w-2.5 bg-[#dc2626] rounded-full" />
                </div>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Navigation Section */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 px-2">
                Navegação Principal
              </p>
              <div className="flex flex-col gap-1.5 font-bold text-sm">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl bg-neutral-900/80 text-white flex items-center justify-between"
                >
                  <span>Início</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </Link>
                <Link
                  href="/produtos?categoria=cat-tenis"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl hover:bg-neutral-900 text-neutral-200 flex items-center justify-between transition-colors"
                >
                  <span>👟 Tênis & Sneakers</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </Link>
                <Link
                  href="/produtos?categoria=cat-roupas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl hover:bg-neutral-900 text-neutral-200 flex items-center justify-between transition-colors"
                >
                  <span>👕 Roupas Streetwear</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </Link>
                <Link
                  href="/produtos?categoria=cat-acessorios"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl hover:bg-neutral-900 text-neutral-200 flex items-center justify-between transition-colors"
                >
                  <span>🎒 Bonés, Meias & Mochilas</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </Link>
                <Link
                  href="/produtos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl hover:bg-neutral-900 text-neutral-200 flex items-center justify-between transition-colors"
                >
                  <span>🏷️ Todas as Marcas</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </Link>
                <Link
                  href="/produtos?ofertas=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl bg-red-600/15 border border-red-600/30 text-white flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#ef4444] fill-[#ef4444]" />
                    <span>Ofertas & Promoções</span>
                  </span>
                  <span className="text-[10px] bg-[#dc2626] text-white px-2 py-0.5 rounded font-black tracking-wider">
                    HOT
                  </span>
                </Link>
              </div>
            </div>

            {/* Quick Actions & Support */}
            <div className="pt-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 px-2">
                Minha Conta & Ajuda
              </p>
              <div className="flex flex-col gap-1.5 font-semibold text-xs">
                <Link
                  href="/rastreamento"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900/50 hover:bg-neutral-900 text-neutral-300 flex items-center gap-2.5 transition-colors"
                >
                  <Package className="w-4 h-4 text-neutral-400" />
                  <span>Rastrear Pedido</span>
                </Link>
                <Link
                  href="/favoritos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900/50 hover:bg-neutral-900 text-neutral-300 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-neutral-400" />
                    <span>Meus Favoritos</span>
                  </span>
                  {wishlist.length > 0 && (
                    <span className="bg-[#dc2626] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <a
                  href="https://wa.me/5511987654321"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-600/30 text-emerald-300 flex items-center gap-2.5 transition-colors font-bold"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Atendimento no WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Owner Section */}
            <div className="pt-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 px-2">
                Área de Gestão
              </p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isOwner) {
                    router.push('/admin');
                  } else {
                    setIsOwnerModalOpen(true);
                  }
                }}
                className="w-full text-left px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900 text-xs font-bold text-neutral-300 hover:text-white flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#dc2626] fill-[#dc2626]" />
                  <span>{isOwner ? 'Ir para o Painel ERP' : 'Acesso Painel Dono'}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            {/* Store Physical Address Notice */}
            <div className="pt-4 border-t border-neutral-900 text-center text-[11px] text-neutral-500 space-y-1">
              <p className="font-bold text-neutral-400">Loja Física Gigante Multimarcas</p>
              <p>Av. Paulista, 1578 — Bela Vista, São Paulo/SP</p>
              <p className="text-[10px] text-neutral-600 pt-1">© 2026 Gigante Multimarcas. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
