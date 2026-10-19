'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Check, Trash2, ExternalLink } from 'lucide-react';
import { Banner } from '@/types';
import { initialBanners } from '@/data/seed';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('Explorar Coleção');
  const [ctaLink, setCtaLink] = useState('/produtos');
  const [imageUrl, setImageUrl] = useState('');
  const [badgeText, setBadgeText] = useState('NOVIDADE 2026');

  const loadBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      if (res.ok) setBanners(await res.json());
      else setBanners(initialBanners);
    } catch {
      setBanners(initialBanners);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleToggleActive = async (banner: Banner) => {
    try {
      const updated = { ...banner, active: !banner.active };
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) loadBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `bnr-${Date.now()}`,
          title: title.toUpperCase(),
          subtitle,
          ctaText,
          ctaLink,
          imageUrl,
          badgeText,
          order: banners.length + 1,
          active: true
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle('');
        setSubtitle('');
        setImageUrl('');
        loadBanners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-brand-500">
            Design & Vitrine
          </span>
          <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
            Banners da Página Inicial
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Gerencie os banners de destaque, imagens de campanha, títulos e botões de ação na Home.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map(b => (
          <div
            key={b.id}
            className="rounded-3xl bg-dark-900 border border-dark-800 overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div className="relative aspect-[16/7] bg-dark-950 overflow-hidden">
              <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  b.active ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {b.active ? 'Ativo na Home' : 'Desativado'}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block">
                  {b.badgeText || 'Campanha'}
                </span>
                <h3 className="font-display text-xl font-black uppercase text-white tracking-tight">
                  {b.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{b.subtitle}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-dark-800 text-xs">
                <span className="text-neutral-500 font-mono">Link: {b.ctaLink}</span>
                <button
                  onClick={() => handleToggleActive(b)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                    b.active ? 'bg-dark-800 text-neutral-300 hover:text-white' : 'bg-brand-500 text-black'
                  }`}
                >
                  {b.active ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="font-bold text-lg">Adicionar Novo Banner</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Título Principal *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="EX: NOVO DROP NIKE AIR MAX"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Subtítulo / Descrição</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  placeholder="Os modelos mais exclusivos da temporada com frete grátis."
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">URL da Imagem *</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Texto do Botão (CTA)</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={e => setCtaText(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Link de Destino</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={e => setCtaLink(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black uppercase text-xs"
              >
                Salvar Banner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
