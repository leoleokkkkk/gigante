'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  Heart,
  MapPin,
  Shield,
  LogOut,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { initialOrders } from '@/data/seed';

export default function MyAccountPage() {
  const { user, loginAsCustomer, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'pedidos' | 'dados' | 'enderecos'>('pedidos');
  const [orders, setOrders] = useState<Order[]>([]);

  // Simple customer login state if not logged in
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const list: Order[] = await res.json();
          setOrders(list);
        } else {
          setOrders(initialOrders);
        }
      } catch {
        setOrders(initialOrders);
      }
    }
    loadOrders();
  }, []);

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;
    loginAsCustomer(nameInput, emailInput, phoneInput);
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-950">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {!user ? (
          <div className="max-w-md mx-auto bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 mx-auto">
                <User className="w-7 h-7" />
              </div>
              <h1 className="font-display text-2xl font-black uppercase text-white">Minha Conta</h1>
              <p className="text-xs text-neutral-400">
                Acesse seus pedidos, acompanhe envios e gerencie seus dados.
              </p>
            </div>

            <form onSubmit={handleCustomerLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold uppercase mb-1">Seu Nome *</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder="Lucas Santos"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold uppercase mb-1">Seu E-mail *</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="lucas.santos@email.com"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold uppercase mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  placeholder="(11) 98122-3344"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider"
              >
                Identificar-se e Entrar
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            {/* User Profile Banner */}
            <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-black text-brand-400 text-2xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h1 className="font-display text-2xl font-black uppercase text-white tracking-tight">
                    {user.name}
                  </h1>
                  <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                    Cliente Gigante
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="py-2 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-neutral-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4 text-neutral-400" />
                <span>Sair da Conta</span>
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 border-b border-dark-800 pb-2">
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'pedidos'
                    ? 'bg-brand-500 text-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Meus Pedidos ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('dados')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'dados'
                    ? 'bg-brand-500 text-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Dados Cadastrais</span>
              </button>

              <button
                onClick={() => setActiveTab('enderecos')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'enderecos'
                    ? 'bg-brand-500 text-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Meus Endereços</span>
              </button>
            </div>

            {/* TAB: MEUS PEDIDOS */}
            {activeTab === 'pedidos' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-dark-900 border border-dark-800 space-y-3">
                    <Package className="w-10 h-10 text-neutral-600 mx-auto" />
                    <h3 className="font-bold text-white text-base">Nenhum pedido realizado ainda</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Você ainda não realizou compras na Gigante Multimarcas.
                    </p>
                    <Link
                      href="/produtos"
                      className="inline-block py-2.5 px-6 rounded-xl bg-brand-500 text-black text-xs font-bold"
                    >
                      Explorar Produtos
                    </Link>
                  </div>
                ) : (
                  orders.map(order => (
                    <div
                      key={order.id}
                      className="p-6 rounded-3xl bg-dark-900 border border-dark-800 space-y-4 shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-dark-800 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-white text-base">
                              #{order.orderNumber}
                            </span>
                            <span className="text-xs bg-dark-800 text-brand-400 font-bold uppercase px-2.5 py-0.5 rounded-full">
                              {order.orderStatus.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">
                            Realizado em {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-white">
                            {formatCurrency(order.total)}
                          </span>
                          <Link
                            href={`/pedido/${order.orderNumber}`}
                            className="py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-black text-xs font-black uppercase flex items-center gap-1 transition-all"
                          >
                            <span>Acompanhar</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      <div className="divide-y divide-dark-800">
                        {order.items.map(item => (
                          <div key={item.id} className="py-2 flex items-center gap-3 text-xs">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded-xl bg-dark-950 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-white truncate">{item.productName}</p>
                              <p className="text-neutral-400 text-[11px]">
                                Tam: {item.size} • Cor: {item.color} • Qtd: {item.quantity}
                              </p>
                            </div>
                            <span className="font-bold text-white">
                              {formatCurrency(item.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: DADOS CADASTRAIS */}
            {activeTab === 'dados' && (
              <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4 max-w-xl">
                <h3 className="font-bold text-base text-white pb-3 border-b border-dark-800">
                  Dados do Cliente
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block">Nome:</span>
                    <span className="font-bold text-white text-sm">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">E-mail:</span>
                    <span className="font-bold text-white text-sm">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Telefone:</span>
                    <span className="font-bold text-white text-sm">{user.phone || 'Não informado'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MEUS ENDEREÇOS */}
            {activeTab === 'enderecos' && (
              <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4 max-w-xl">
                <h3 className="font-bold text-base text-white pb-3 border-b border-dark-800">
                  Endereço Cadastrado
                </h3>
                <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 text-xs text-neutral-300 space-y-1">
                  <p className="font-bold text-white">Endereço Principal</p>
                  <p>Rua Joaquim Floriano, 466 — Apto 102</p>
                  <p>Itaim Bibi, São Paulo - SP</p>
                  <p>CEP: 04538-133</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
