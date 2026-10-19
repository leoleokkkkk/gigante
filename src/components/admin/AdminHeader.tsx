'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User,
  ShieldCheck,
  Store
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  pendingCount?: number;
}

export function AdminHeader({ onOpenMobileMenu, pendingCount = 0 }: AdminHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="h-16 bg-dark-900 border-b border-dark-800 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Mobile Menu Trigger */}
      <button
        onClick={onOpenMobileMenu}
        className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-dark-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Quick Search */}
      <div className="relative flex-1 max-w-sm hidden sm:block">
        <input
          type="text"
          placeholder="Busca rápida no sistema..."
          className="w-full bg-dark-950 border border-dark-700 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
        />
        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-3">
        {/* PDV Quick Action */}
        <Link
          href="/admin/pos"
          className="py-1.5 px-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black text-xs font-black uppercase flex items-center gap-1.5 shadow-md shadow-brand-500/20"
        >
          <Store className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nova Venda Balcão</span>
        </Link>

        {/* Notifications Icon with Badge */}
        <Link
          href="/admin#atencao"
          className="relative p-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-neutral-300 hover:text-white"
          title="Atenção Necessária"
        >
          <Bell className="w-4 h-4" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </Link>

        {/* Owner Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-dark-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-black font-black text-xs">
            RG
          </div>
          <div className="hidden md:block text-left text-xs">
            <p className="font-bold text-white leading-none">Rodrigo Gigante</p>
            <p className="text-[10px] text-neutral-400 leading-none mt-1">Proprietário / Dono</p>
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl bg-dark-850 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors"
          title="Sair do Modo Dono"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
