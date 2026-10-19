'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  customMessage?: string;
  phoneNumber?: string;
}

export function WhatsAppButton({
  customMessage = 'Olá! Gostaria de tirar uma dúvida sobre os produtos da Gigante Multimarcas.',
  phoneNumber = '5511987654321'
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      aria-label="Atendimento via WhatsApp"
    >
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-500 rounded-full animate-ping" />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-500 rounded-full" />
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold font-sans pl-0 group-hover:pl-2">
        Falar no WhatsApp
      </span>
    </a>
  );
}
