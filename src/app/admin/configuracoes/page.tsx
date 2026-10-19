'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Store,
  Phone,
  Truck,
  CreditCard,
  Shield,
  Save,
  Check,
  Instagram,
  Facebook
} from 'lucide-react';
import { StoreSettings } from '@/types';
import { initialStoreSettings } from '@/data/seed';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(initialStoreSettings);
  const [savedMessage, setSavedMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) setSettings(await res.json());
      } catch (err) {
        console.error(err);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSavedMessage('Configurações da loja salvas com sucesso!');
        setTimeout(() => setSavedMessage(''), 3000);
      }
    } catch {
      alert('Erro ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-brand-500">
          Personalização do Sistema
        </span>
        <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight mt-1">
          Configurações da Loja
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Edite informações institucionais, endereço físico, WhatsApp de atendimento e redes sociais.
        </p>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{savedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* SECTION 1: STORE BASIC INFO */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-dark-800">
            <Store className="w-4 h-4 text-brand-500" />
            Dados Institucionais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">Nome da Loja *</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">CNPJ *</label>
              <input
                type="text"
                required
                value={settings.cnpj}
                onChange={e => setSettings({ ...settings, cnpj: e.target.value })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">E-mail de Contato *</label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">Telefone Fixo</label>
              <input
                type="text"
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-bold mb-1">Horário de Funcionamento</label>
            <input
              type="text"
              value={settings.openingHours}
              onChange={e => setSettings({ ...settings, openingHours: e.target.value })}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
            />
          </div>
        </div>

        {/* SECTION 2: WHATSAPP & SOCIAL LINKS */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-dark-800">
            <Phone className="w-4 h-4 text-emerald-400" />
            WhatsApp Flutuante & Redes Sociais (Configuráveis)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">Número do WhatsApp (com DDI e DDD) *</label>
              <input
                type="text"
                required
                value={settings.whatsapp}
                onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="5511987654321"
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white font-mono"
              />
              <p className="text-[10px] text-neutral-500 mt-1">Este número alimenta o botão flutuante e o botão de interesse no produto.</p>
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">Instagram URL</label>
              <input
                type="text"
                value={settings.socialLinks.instagram}
                onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">TikTok URL</label>
              <input
                type="text"
                value={settings.socialLinks.tiktok}
                onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, tiktok: e.target.value } })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">Facebook URL</label>
              <input
                type="text"
                value={settings.socialLinks.facebook}
                onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: PHYSICAL STORE ADDRESS */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-dark-800">
            <Store className="w-4 h-4 text-brand-500" />
            Endereço da Loja Física (Onde Estamos)
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-neutral-300 font-bold mb-1">Rua / Avenida *</label>
              <input
                type="text"
                required
                value={settings.address.street}
                onChange={e => setSettings({ ...settings, address: { ...settings.address, street: e.target.value } })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-bold mb-1">Número *</label>
              <input
                type="text"
                required
                value={settings.address.number}
                onChange={e => setSettings({ ...settings, address: { ...settings.address, number: e.target.value } })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">Bairro *</label>
              <input
                type="text"
                required
                value={settings.address.neighborhood}
                onChange={e => setSettings({ ...settings, address: { ...settings.address, neighborhood: e.target.value } })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-bold mb-1">Cidade / UF *</label>
              <input
                type="text"
                required
                value={settings.address.city}
                onChange={e => setSettings({ ...settings, address: { ...settings.address, city: e.target.value } })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-bold mb-1">CEP *</label>
              <input
                type="text"
                required
                value={settings.address.cep}
                onChange={e => setSettings({ ...settings, address: { ...settings.address, cep: e.target.value } })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: SHIPPING & PAYMENT RULES */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-dark-800">
            <Truck className="w-4 h-4 text-brand-500" />
            Políticas de Frete & Pagamento
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">Frete Grátis Acima de (R$)</label>
              <input
                type="number"
                value={settings.shippingConfig.freeShippingThreshold}
                onChange={e => setSettings({
                  ...settings,
                  shippingConfig: { ...settings.shippingConfig, freeShippingThreshold: Number(e.target.value) }
                })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">Desconto no Pix (%)</label>
              <input
                type="number"
                value={settings.paymentConfig.pixDiscountPercent}
                onChange={e => setSettings({
                  ...settings,
                  paymentConfig: { ...settings.paymentConfig, pixDiscountPercent: Number(e.target.value) }
                })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white font-bold text-emerald-400"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">Máximo de Parcelas Sem Juros</label>
              <input
                type="number"
                value={settings.paymentConfig.maxInstallments}
                onChange={e => setSettings({
                  ...settings,
                  paymentConfig: { ...settings.paymentConfig, maxInstallments: Number(e.target.value) }
                })}
                className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white font-bold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-brand-500/20 text-xs"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Salvando...' : 'Salvar Todas as Configurações'}</span>
        </button>
      </form>
    </div>
  );
}
