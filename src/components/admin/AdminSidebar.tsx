'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Layers,
  Archive,
  Users,
  DollarSign,
  Wallet,
  BarChart3,
  Tag,
  Image as ImageIcon,
  Settings,
  ClipboardList,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pedidos', label: 'Pedidos & Envios', icon: ShoppingBag },
  { href: '/admin/pos', label: 'PDV / Venda Balcão', icon: Store },
  { href: '/admin/produtos', label: 'Produtos & Variações', icon: Layers },
  { href: '/admin/estoque', label: 'Controle de Estoque', icon: Archive },
  { href: '/admin/caixa', label: 'Fechamento de Caixa', icon: Wallet },
  { href: '/admin/financeiro', label: 'Fluxo de Caixa & DRE', icon: DollarSign },
  { href: '/admin/clientes', label: 'Clientes (CRM)', icon: Users },
  { href: '/admin/devolucoes', label: 'Devoluções (Reversa)', icon: RotateCcw },
  { href: '/admin/cupons', label: 'Cupons de Desconto', icon: Tag },
  { href: '/admin/banners', label: 'Banners & Destaques', icon: ImageIcon },
  { href: '/admin/relatorios', label: 'Relatórios Gerenciais', icon: BarChart3 },
  { href: '/admin/configuracoes', label: 'Configurações da Loja', icon: Settings },
  { href: '/admin/auditoria', label: 'Trilha de Auditoria', icon: ClipboardList },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col h-full text-neutral-300 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-dark-800 flex items-center justify-between">
        <Link href="/admin" className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between">
            <img
              src="/images/logo.png"
              alt="Gigante's Multimarcas"
              className="h-9 w-auto max-w-[130px] object-contain drop-shadow"
            />
            <span className="text-[9px] font-black tracking-widest bg-brand-500/10 text-brand-400 border border-brand-500/30 px-1.5 py-0.5 rounded uppercase">
              ERP DONO
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-xs font-semibold">
        {menuItems.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-brand-500 text-black font-black shadow-lg shadow-brand-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-dark-850'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Storefront Quick Link */}
      <div className="p-4 border-t border-dark-800">
        <Link
          href="/"
          target="_blank"
          className="w-full py-2.5 px-3 rounded-xl bg-dark-850 hover:bg-dark-800 text-neutral-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-dark-700 transition-colors"
        >
          <span>Abrir Loja Virtual</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
