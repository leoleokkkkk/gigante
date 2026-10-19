'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Footer() {
  const { setIsOwnerModalOpen, isOwner } = useAuth();

  return (
    <footer className="bg-dark-950 border-t border-dark-800 text-neutral-400 text-sm">
      {/* Trust Badges Bar */}
      <div className="border-b border-dark-850 py-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-dark-900 border border-dark-800">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Autêntico</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Garantia total de produtos originais com NF.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-dark-900 border border-dark-800">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Envio Rápido ou Retirada</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Despacho ágil e retirada em até 2h na loja física.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-dark-900 border border-dark-800">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Troca Fácil</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Até 7 dias para devolução ou troca sem burocracia.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-dark-900 border border-dark-800">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Até 10x Sem Juros</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Ou 5% de desconto imediato pagando no Pix.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Gigante's Multimarcas — Original é Aqui"
                className="h-11 w-auto max-w-[170px] object-contain drop-shadow"
              />
            </div>
            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
              Referência em cultura streetwear, tênis exclusivos, vestuário de alta performance e acessórios premium. Conectando você às melhores marcas do mundo com atendimento de verdade.
            </p>
            <div className="text-xs text-neutral-500">
              <p>CNPJ: 45.892.103/0001-88</p>
              <p>Razão Social: Gigante Multimarcas Comércio de Artigos Esportivos LTDA</p>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/gigantemultimarcas"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-center text-neutral-300 hover:text-brand-400 hover:border-brand-500/50 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5511987654321"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-center text-neutral-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                title="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/gigantemultimarcas"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-center text-neutral-300 hover:text-blue-400 hover:border-blue-500/50 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Departamentos</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/produtos?categoria=cat-tenis" className="hover:text-white transition-colors">
                  Tênis & Sneakers
                </Link>
              </li>
              <li>
                <Link href="/produtos?categoria=cat-roupas" className="hover:text-white transition-colors">
                  Camisetas & Roupas
                </Link>
              </li>
              <li>
                <Link href="/produtos?categoria=cat-acessorios" className="hover:text-white transition-colors">
                  Bonés, Meias & Mochilas
                </Link>
              </li>
              <li>
                <Link href="/produtos?ofertas=true" className="hover:text-brand-400 transition-colors font-bold">
                  Outlet & Ofertas
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="hover:text-white transition-colors">
                  Lançamentos 2026
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Atendimento & Ajuda</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/rastreamento" className="hover:text-white transition-colors">
                  Rastrear Meu Pedido
                </Link>
              </li>
              <li>
                <Link href="/minha-conta" className="hover:text-white transition-colors">
                  Minha Conta
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="hover:text-white transition-colors">
                  Meus Favoritos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white transition-colors">
                  Sobre a Gigante Multimarcas
                </Link>
              </li>
              <li>
                <Link href="/onde-estamos" className="hover:text-white transition-colors">
                  Onde Estamos (Loja Física)
                </Link>
              </li>
            </ul>
          </div>

          {/* Physical Store & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Loja Física</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>
                  Av. Paulista, 1578 — Loja 12
                  <br />
                  Bela Vista, São Paulo - SP
                  <br />
                  CEP 01310-200
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>Seg a Sáb: 09h às 20h</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>(11) 98765-4321</span>
              </div>
              <a
                href="https://maps.google.com/?q=Avenida+Paulista+1578+Sao+Paulo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 pt-1"
              >
                Como Chegar no Mapa <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Modo Dono & Copyright */}
        <div className="mt-12 pt-6 border-t border-dark-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Gigante Multimarcas. Todos os direitos reservados.</p>
          
          <div className="flex items-center gap-4">
            <Link href="/sobre" className="hover:text-white transition-colors">
              Termos e Condições
            </Link>
            <span className="text-dark-700">|</span>
            <Link href="/sobre" className="hover:text-white transition-colors">
              Políticas de Privacidade
            </Link>
            <span className="text-dark-700">|</span>
            {isOwner ? (
              <Link
                href="/admin"
                className="font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 bg-brand-500/10 px-2.5 py-1 rounded-md"
              >
                <span>👑 Modo Dono Ativo</span>
              </Link>
            ) : (
              <button
                onClick={() => setIsOwnerModalOpen(true)}
                className="text-neutral-500 hover:text-brand-400 flex items-center gap-1 transition-colors"
                title="Acesso restrito à gestão da loja"
              >
                <Lock className="w-3 h-3" />
                <span>Modo Dono</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
