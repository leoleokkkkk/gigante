'use client';

import React from 'react';
import { MapPin, Clock, Phone, Mail, ExternalLink, Navigation } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function WhereWeArePage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-950">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            FLAGSHIP STORE SÃO PAULO
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            Onde Estamos
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Venha experimentar os tênis e roupas presencialmente na nossa loja física ou retirar seu pedido feito no site em até 2 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-6 shadow-2xl">
            <h2 className="font-display text-2xl font-black uppercase text-white">
              Endereço e Contatos
            </h2>

            <div className="space-y-4 text-xs text-neutral-300">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-dark-950 border border-dark-800">
                <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-sm">Ponto Físico</p>
                  <p className="mt-0.5">Avenida Paulista, 1578 — Loja 12 (Térreo Comercial)</p>
                  <p>Bela Vista — São Paulo / SP</p>
                  <p>CEP: 01310-200</p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Próximo à estação Trianon-Masp do Metrô (Linha 2 - Verde).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-dark-950 border border-dark-800">
                <Clock className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-sm">Horário de Funcionamento</p>
                  <p className="mt-0.5">Segunda a Sábado: 09:00 às 20:00</p>
                  <p>Domingos e Feriados: 12:00 às 18:00</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-dark-950 border border-dark-800">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-sm">WhatsApp e Atendimento</p>
                  <p className="mt-0.5">(11) 98765-4321 • (11) 3288-4900</p>
                  <p className="text-neutral-500">contato@gigantemultimarcas.com.br</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Avenida+Paulista+1578+Sao+Paulo"
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.01]"
              >
                <Navigation className="w-4 h-4" />
                <span>Abrir Rota no Google Maps</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Visual Mockup */}
          <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-dark-950 border border-dark-800">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80"
                alt="Mapa da Loja Física"
                className="w-full h-full object-cover filter contrast-125 brightness-90"
              />
              <div className="absolute inset-0 bg-dark-950/20 backdrop-blur-[1px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-brand-500 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-500 animate-ping" />
                <span className="text-xs font-black uppercase text-brand-400">Gigante Multimarcas</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 text-xs text-neutral-400 space-y-1">
              <span className="font-bold text-white block">Estacionamento Conveniado</span>
              <p>Possuímos convênio com estacionamento no próprio edifício para clientes em compras ou retiradas.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
