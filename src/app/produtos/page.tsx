'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  Check,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Product, Category, Brand } from '@/types';
import { initialProducts, initialCategories, initialBrands } from '@/data/seed';

function CatalogContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('categoria') || '');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('marca') || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [promoOnly, setPromoOnly] = useState<boolean>(searchParams.get('ofertas') === 'true');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [priceMax, setPriceMax] = useState<number>(1500);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync url params when changed
  useEffect(() => {
    const cat = searchParams.get('categoria');
    const bnd = searchParams.get('marca');
    const ofr = searchParams.get('ofertas');
    const q = searchParams.get('q');

    if (cat) setSelectedCategory(cat);
    if (bnd) setSelectedBrand(bnd);
    if (ofr) setPromoOnly(ofr === 'true');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Extract all available sizes & colors from all products
  const allSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    products.forEach(p => p.variants.forEach(v => sizeSet.add(v.size)));
    return Array.from(sizeSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category
        if (selectedCategory && p.categoryId !== selectedCategory && p.subcategoryId !== selectedCategory) {
          return false;
        }

        // Brand
        if (selectedBrand && p.brandId !== selectedBrand) {
          return false;
        }

        // Size
        if (selectedSize && !p.variants.some(v => v.size === selectedSize && v.stock > 0)) {
          return false;
        }

        // Gender
        if (selectedGender && p.gender !== selectedGender && p.gender !== 'unissex') {
          return false;
        }

        // In stock
        if (inStockOnly && !p.variants.some(v => v.stock > 0)) {
          return false;
        }

        // Promo
        if (promoOnly && (!p.promoPrice || p.promoPrice >= p.sellingPrice)) {
          return false;
        }

        // Price
        const effectivePrice = p.promoPrice ?? p.sellingPrice;
        if (effectivePrice > priceMax) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.baseSku.toLowerCase().includes(q);
          const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
          const matchBrand = p.brandId.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchTag && !matchBrand) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.promoPrice ?? a.sellingPrice;
        const priceB = b.promoPrice ?? b.sellingPrice;

        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'discount') {
          const discA = a.promoPrice ? (a.sellingPrice - a.promoPrice) / a.sellingPrice : 0;
          const discB = b.promoPrice ? (b.sellingPrice - b.promoPrice) / b.sellingPrice : 0;
          return discB - discA;
        }
        if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return 0; // relevance
      });
  }, [
    products,
    selectedCategory,
    selectedBrand,
    selectedSize,
    selectedGender,
    inStockOnly,
    promoOnly,
    priceMax,
    searchQuery,
    sortBy
  ]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedSize('');
    setSelectedColor('');
    setSelectedGender('');
    setInStockOnly(false);
    setPromoOnly(false);
    setSearchQuery('');
    setPriceMax(1500);
    setSortBy('relevance');
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedBrand) ||
    Boolean(selectedSize) ||
    Boolean(selectedGender) ||
    inStockOnly ||
    promoOnly ||
    Boolean(searchQuery) ||
    priceMax < 1500;

  return (
    <div className="flex flex-col min-h-screen bg-dark-950">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-800">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Catálogo de Produtos
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Mostrando {filteredProducts.length} de {products.length} itens disponíveis
            </p>
          </div>

          {/* Sorting Dropdown & Mobile Filter Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-700 text-xs font-bold text-white flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-500" />
              <span>Filtros</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              )}
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-dark-900 border border-dark-700 text-white text-xs font-semibold rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="relevance">Mais Relevantes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="newest">Novidades</option>
                <option value="bestseller">Mais Vendidos</option>
                <option value="discount">Maior Desconto</option>
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-dark-900/60 border border-dark-850 p-6 rounded-3xl h-fit sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-dark-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" />
                <h3 className="font-bold text-sm text-white">Filtros Avançados</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-brand-400 hover:text-brand-300 font-bold"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2.5">
                Categorias
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    !selectedCategory ? 'bg-brand-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>Todas</span>
                  <span>{products.length}</span>
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id === selectedCategory ? '' : c.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === c.id ? 'bg-brand-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[11px] opacity-70">
                      {products.filter(p => p.categoryId === c.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="pt-4 border-t border-dark-800">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2.5">
                Marcas
              </h4>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedBrand('')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    !selectedBrand ? 'bg-brand-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>Todas as Marcas</span>
                </button>
                {brands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.id === selectedBrand ? '' : b.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedBrand === b.id ? 'bg-brand-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-[11px] opacity-70">
                      {products.filter(p => p.brandId === b.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Filter */}
            <div className="pt-4 border-t border-dark-800">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2.5">
                Tamanho
              </h4>
              <div className="grid grid-cols-4 gap-1.5">
                {allSizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz === selectedSize ? '' : sz)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                      selectedSize === sz
                        ? 'border-brand-500 bg-brand-500 text-black'
                        : 'border-dark-700 bg-dark-950 text-neutral-300 hover:border-dark-600'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="pt-4 border-t border-dark-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Preço Máximo
                </h4>
                <span className="text-xs font-bold text-brand-400">Até R$ {priceMax}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="20"
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>

            {/* Quick Checkboxes: In Stock & Promos */}
            <div className="pt-4 border-t border-dark-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="rounded border-dark-700 bg-dark-950 text-brand-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>Apenas em estoque</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={promoOnly}
                  onChange={e => setPromoOnly(e.target.checked)}
                  className="rounded border-dark-700 bg-dark-950 text-brand-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>Com desconto / Oferta</span>
              </label>
            </div>
          </aside>

          {/* Products List Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-dark-900 border border-dark-800 space-y-4">
                <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mx-auto text-neutral-500">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Nenhum produto encontrado</h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    Não encontramos itens que correspondam aos filtros selecionados. Tente ajustar os termos ou limpar os filtros.
                  </p>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 text-black font-bold text-xs hover:bg-brand-400 transition-colors"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <div
              onClick={() => setMobileFilterOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-sm bg-dark-950 border-l border-dark-800 p-6 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-dark-800">
                    <h3 className="font-bold text-base text-white">Filtrar Produtos</h3>
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      Categoria
                    </h4>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedCategory('')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                          !selectedCategory ? 'bg-brand-500 text-black' : 'text-neutral-300 bg-dark-900'
                        }`}
                      >
                        Todas
                      </button>
                      {categories.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCategory(c.id === selectedCategory ? '' : c.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                            selectedCategory === c.id ? 'bg-brand-500 text-black' : 'text-neutral-300 bg-dark-900'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      Marca
                    </h4>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      <button
                        onClick={() => setSelectedBrand('')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                          !selectedBrand ? 'bg-brand-500 text-black' : 'text-neutral-300 bg-dark-900'
                        }`}
                      >
                        Todas
                      </button>
                      {brands.map(b => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBrand(b.id === selectedBrand ? '' : b.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
                            selectedBrand === b.id ? 'bg-brand-500 text-black' : 'text-neutral-300 bg-dark-900'
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-dark-800 space-y-2">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-3 rounded-xl bg-brand-500 text-black font-bold text-xs uppercase"
                  >
                    Ver {filteredProducts.length} Produtos
                  </button>
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-2.5 rounded-xl border border-dark-700 text-neutral-400 text-xs font-bold"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Carregando catálogo...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
