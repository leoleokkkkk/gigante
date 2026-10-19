'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Archive,
  ExternalLink,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Product, ProductVariant, Category, Brand } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { initialProducts, initialCategories, initialBrands } from '@/data/seed';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('cat-tenis');
  const [brandId, setBrandId] = useState('b-nike');
  const [baseSku, setBaseSku] = useState('');
  const [costPrice, setCostPrice] = useState(100);
  const [sellingPrice, setSellingPrice] = useState(250);
  const [promoPrice, setPromoPrice] = useState<number | undefined>(undefined);
  const [weightKg, setWeightKg] = useState(0.8);
  const [heightCm, setHeightCm] = useState(12);
  const [widthCm, setWidthCm] = useState(20);
  const [lengthCm, setLengthCm] = useState(32);
  const [imageUrl, setImageUrl] = useState('');

  // Variants Matrix Builder State
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: 'v-1', productId: '', size: '39', color: 'Preto', sku: 'SKU-39', stock: 5, minStock: 2 },
    { id: 'v-2', productId: '', size: '40', color: 'Preto', sku: 'SKU-40', stock: 5, minStock: 2 },
    { id: 'v-3', productId: '', size: '41', color: 'Preto', sku: 'SKU-41', stock: 5, minStock: 2 },
    { id: 'v-4', productId: '', size: '42', color: 'Preto', sku: 'SKU-42', stock: 5, minStock: 2 }
  ]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) setProducts(await res.json());
      else setProducts(initialProducts);
    } catch {
      setProducts(initialProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setName('');
    setDescription('');
    setCategoryId('cat-tenis');
    setBrandId('b-nike');
    setBaseSku(`GM-${Date.now().toString().slice(-5)}`);
    setCostPrice(150);
    setSellingPrice(349.9);
    setPromoPrice(undefined);
    setImageUrl('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80');
    setVariants([
      { id: `v-${Date.now()}-1`, productId: '', size: '39', color: 'Preto', sku: 'SKU-39', stock: 4, minStock: 2 },
      { id: `v-${Date.now()}-2`, productId: '', size: '40', color: 'Preto', sku: 'SKU-40', stock: 6, minStock: 2 },
      { id: `v-${Date.now()}-3`, productId: '', size: '41', color: 'Preto', sku: 'SKU-41', stock: 4, minStock: 2 },
      { id: `v-${Date.now()}-4`, productId: '', size: '42', color: 'Preto', sku: 'SKU-42', stock: 3, minStock: 2 }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setName(p.name);
    setDescription(p.description);
    setCategoryId(p.categoryId);
    setBrandId(p.brandId);
    setBaseSku(p.baseSku);
    setCostPrice(p.costPrice);
    setSellingPrice(p.sellingPrice);
    setPromoPrice(p.promoPrice);
    setWeightKg(p.weightKg);
    setHeightCm(p.heightCm);
    setWidthCm(p.widthCm);
    setLengthCm(p.lengthCm);
    setImageUrl(p.images[0]?.url || '');
    setVariants(p.variants);
    setIsModalOpen(true);
  };

  const handleAddVariantRow = () => {
    const newId = `var-${Date.now()}-${Math.floor(Math.random() * 100)}`;
    setVariants([
      ...variants,
      {
        id: newId,
        productId: editingProductId || '',
        size: '43',
        color: 'Preto',
        sku: `${baseSku || 'SKU'}-${variants.length + 1}`,
        stock: 5,
        minStock: 2
      }
    ]);
  };

  const handleRemoveVariantRow = (variantId: string) => {
    if (variants.length <= 1) {
      alert('O produto precisa ter pelo menos 1 variação de tamanho/estoque.');
      return;
    }
    setVariants(variants.filter(v => v.id !== variantId));
  };

  const handleVariantChange = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(
      variants.map(v => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      id: editingProductId || undefined,
      name,
      description,
      categoryId,
      brandId,
      baseSku,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      promoPrice: promoPrice ? Number(promoPrice) : undefined,
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      widthCm: Number(widthCm),
      lengthCm: Number(lengthCm),
      images: [
        {
          id: `img-${Date.now()}`,
          url: imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
          alt: name,
          isPrimary: true,
          isSecondary: false,
          order: 1
        }
      ],
      variants
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadProducts();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao salvar produto.');
      }
    } catch {
      alert('Erro de conexão ao salvar produto.');
    }
  };

  const handleDeleteProduct = async (id: string, pName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${pName}"? Essa ação não poderá ser desfeita.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter(p => {
    if (filterCategory && p.categoryId !== filterCategory) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(term) ||
        p.baseSku.toLowerCase().includes(term) ||
        p.brandId.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-500">
            Catálogo & Estoque
          </span>
          <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
            Gestão de Produtos & Variações
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Cadastre tênis, roupas e acessórios com controle de estoque independente por tamanho e cor.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="py-2.5 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, marca ou SKU base..."
            className="w-full bg-dark-900 border border-dark-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="bg-dark-900 border border-dark-700 text-white text-xs font-bold rounded-xl py-2.5 px-4 focus:outline-none focus:border-brand-500 cursor-pointer w-full sm:w-auto"
        >
          <option value="">Todas as Categorias</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-950 text-neutral-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Produto</th>
                <th className="py-3.5 px-4">Marca / Categoria</th>
                <th className="py-3.5 px-4">SKU Base</th>
                <th className="py-3.5 px-4">Preço Custo</th>
                <th className="py-3.5 px-4">Preço Venda</th>
                <th className="py-3.5 px-4">Estoque Total</th>
                <th className="py-3.5 px-4">Variações</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 font-semibold text-neutral-300">
              {filtered.map(p => {
                const totalStock = p.variants.reduce((a, b) => a + b.stock, 0);
                const hasZero = p.variants.some(v => v.stock === 0);

                return (
                  <tr key={p.id} className="hover:bg-dark-850/50 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={p.images[0]?.url}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-xl bg-dark-950 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <Link href={`/produto/${p.slug}`} target="_blank" className="font-bold text-white hover:text-brand-400 truncate block max-w-xs">
                          {p.name}
                        </Link>
                        {p.promoPrice && (
                          <span className="text-[10px] text-red-400 font-bold">
                            Promoção: {formatCurrency(p.promoPrice)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-400 block uppercase">
                        {p.brandId.replace('b-', '')}
                      </span>
                      <span className="text-[11px] text-neutral-400 capitalize">
                        {p.categoryId.replace('cat-', '')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{p.baseSku}</td>
                    <td className="py-3.5 px-4 text-neutral-400">{formatCurrency(p.costPrice)}</td>
                    <td className="py-3.5 px-4 font-black text-white">{formatCurrency(p.sellingPrice)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                        totalStock === 0
                          ? 'bg-red-500/20 text-red-400'
                          : hasZero
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {totalStock} unidades
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {p.variants.map(v => (
                          <span
                            key={v.id}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              v.stock === 0 ? 'bg-red-950 text-red-400' : 'bg-dark-800 text-neutral-300'
                            }`}
                            title={`Tamanho ${v.size}: ${v.stock} un`}
                          >
                            {v.size}:{v.stock}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/produto/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-dark-800 hover:text-white text-neutral-400"
                          title="Ver na Loja"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-brand-500 hover:text-black text-neutral-300"
                          title="Editar Produto e Variações"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-red-500 hover:text-white text-neutral-400"
                          title="Excluir Produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL WITH VARIANT MATRIX BUILDER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-dark-800">
              <h3 className="font-display text-2xl font-black uppercase tracking-tight text-white">
                {editingProductId ? 'Editar Produto & Variações' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              {/* Product Basic Info */}
              <div className="space-y-4">
                <span className="font-bold text-brand-400 uppercase text-[11px] block">
                  1. Informações Básicas & Fiscais
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Nome do Produto *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ex: Tênis Nike Air Force 1 07 Triple White"
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">SKU Base *</label>
                    <input
                      type="text"
                      required
                      value={baseSku}
                      onChange={e => setBaseSku(e.target.value.toUpperCase())}
                      placeholder="NK-AF1-WHT"
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Categoria *</label>
                    <select
                      value={categoryId}
                      onChange={e => setCategoryId(e.target.value)}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-white"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Marca *</label>
                    <select
                      value={brandId}
                      onChange={e => setBrandId(e.target.value)}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-white"
                    >
                      {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Preço de Custo (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={costPrice}
                      onChange={e => setCostPrice(Number(e.target.value))}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Preço de Venda (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={sellingPrice}
                      onChange={e => setSellingPrice(Number(e.target.value))}
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Preço Promocional (Opcional)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={promoPrice || ''}
                      onChange={e => setPromoPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Deixe em branco se não houver promoção"
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">URL da Imagem Principal</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Descrição Detalhada</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Detalhes sobre material, cabedal, amortecimento e design..."
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              {/* VARIANT MATRIX BUILDER (ESTOQUE INDEPENDENTE POR TAMANHO/COR) */}
              <div className="space-y-4 pt-4 border-t border-dark-800">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-brand-400 uppercase text-[11px] block">
                      2. Matriz de Variações & Estoque Independente
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      Cada tamanho possui controle de estoque físico estrito.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="py-1.5 px-3 rounded-lg bg-dark-800 hover:bg-dark-700 text-white font-bold text-xs flex items-center gap-1 border border-dark-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Numeração
                  </button>
                </div>

                <div className="border border-dark-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-dark-950 border-b border-dark-800 text-neutral-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Tamanho</th>
                        <th className="p-3">Cor / Modelo</th>
                        <th className="p-3">SKU Específico</th>
                        <th className="p-3">Estoque Atual</th>
                        <th className="p-3">Estoque Mín.</th>
                        <th className="p-3 text-center">Remover</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-800 font-semibold bg-dark-950/40">
                      {variants.map(v => (
                        <tr key={v.id}>
                          <td className="p-2">
                            <input
                              type="text"
                              required
                              value={v.size}
                              onChange={e => handleVariantChange(v.id, 'size', e.target.value)}
                              className="w-20 bg-dark-900 border border-dark-700 rounded-lg p-1.5 text-center font-bold text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              required
                              value={v.color}
                              onChange={e => handleVariantChange(v.id, 'color', e.target.value)}
                              className="w-32 bg-dark-900 border border-dark-700 rounded-lg p-1.5 text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.sku}
                              onChange={e => handleVariantChange(v.id, 'sku', e.target.value)}
                              className="w-36 bg-dark-900 border border-dark-700 rounded-lg p-1.5 font-mono text-[11px] text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              required
                              value={v.stock}
                              onChange={e => handleVariantChange(v.id, 'stock', Number(e.target.value))}
                              className="w-20 bg-dark-900 border border-dark-700 rounded-lg p-1.5 text-center font-bold text-brand-400"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={v.minStock}
                              onChange={e => handleVariantChange(v.id, 'minStock', Number(e.target.value))}
                              className="w-16 bg-dark-900 border border-dark-700 rounded-lg p-1.5 text-center text-neutral-400"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariantRow(v.id)}
                              className="p-1 rounded text-neutral-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t border-dark-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-5 rounded-xl border border-dark-700 text-neutral-300 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black uppercase tracking-wider"
                >
                  Salvar Produto & Variações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
