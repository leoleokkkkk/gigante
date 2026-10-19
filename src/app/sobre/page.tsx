'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Heart, MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-950">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            CULTURA STREETWEAR & PERFORMANCE
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            Sobre a Gigante Multimarcas
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Mais do que uma loja de tênis e roupas. Um ponto de encontro para quem vive e respira a cultura urbana, sneaker e streetwear autêntico.
          </p>
        </div>

        {/* Brand Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-dark-900 border border-dark-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            <h2 className="font-display text-2xl font-black uppercase text-white">Nossa Trajetória</h2>
            <p>
              A <strong>Gigante Multimarcas</strong> nasceu da paixão genuína por sneakers raros, silhuetas clássicas e o caimento perfeito das roupas pesadas streetwear.
            </p>
            <p>
              Com nossa flagship store localizada estrategicamente na Avenida Paulista, em São Paulo, construímos uma curadoria rigorosa com as marcas mais respeitadas do planeta: Nike, Adidas, Vans, New Balance, Mizuno, Puma e Converse.
            </p>
            <p>
              Garantimos 100% de autenticidade em cada par e peça comercializada, com nota fiscal, rastreabilidade e garantia de procedência oficial.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-dark-800 aspect-video md:aspect-square">
            <img
              src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80"
              alt="Gigante Multimarcas Store"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-dark-900 border border-dark-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-brand-500" />
            <h3 className="font-bold text-white text-base">Autenticidade Inegociável</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Todos os produtos passam por conferência física minuciosa de costura, etiquetas, solados e procedência.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900 border border-dark-800 space-y-3">
            <Award className="w-8 h-8 text-brand-500" />
            <h3 className="font-bold text-white text-base">Atendimento de Especialista</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Nossa equipe compreende caimento, numeração correta de calçados e história por trás de cada modelo.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900 border border-dark-800 space-y-3">
            <Heart className="w-8 h-8 text-brand-500" />
            <h3 className="font-bold text-white text-base">Comunidade & Cultura</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Fomentamos a cena de skate, hip-hop, basquete de rua e moda sustentável com lançamentos contínuos.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/produtos"
            className="py-4 px-8 rounded-2xl bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xl shadow-brand-500/25 transition-all hover:scale-105"
          >
            <span>Conhecer Nossos Produtos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
