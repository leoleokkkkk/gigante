'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Lock, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isOwner, loginAsOwner } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginAsOwner(adminPassword);
    if (!res.success) {
      setErrorMsg(res.message || 'Senha incorreta.');
    } else {
      setErrorMsg('');
    }
  };

  // If not owner, show protected login gate
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-dark-900 border border-dark-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-black uppercase text-white tracking-tight">
              Modo Dono Protegido
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Esta área é restrita ao proprietário da Gigante Multimarcas para controle de estoque, finanças e expedição.
            </p>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-4 text-xs text-left">
            <div>
              <label className="block text-neutral-300 font-bold uppercase mb-1.5">
                Senha de Administrador
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="Digite sua senha de acesso..."
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-brand-500"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {errorMsg && <p className="text-xs text-red-400 font-bold mt-1.5">{errorMsg}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-500/20"
            >
              <span>Acessar Painel Gerencial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-dark-800 space-y-2">
            <button
              onClick={() => loginAsOwner('gigante123')}
              className="w-full py-2 px-3 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-700 text-brand-400 font-bold text-xs transition-colors"
            >
              Acesso Rápido de Demonstração (Dono)
            </button>

            <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300 block pt-1">
              ← Voltar para a Loja Virtual
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dark-950 text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative flex-1 max-w-xs w-full bg-dark-900 h-full z-10">
            <AdminSidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onOpenMobileMenu={() => setMobileSidebarOpen(true)} pendingCount={3} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-dark-950">
          {children}
        </main>
      </div>
    </div>
  );
}
