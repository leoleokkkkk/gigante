import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { OwnerLoginModal } from '@/components/OwnerLoginModal';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Gigante Multimarcas — Tênis, Roupas Streetwear & Esportivos',
  description: 'Loja oficial Gigante Multimarcas. Tênis exclusivos Nike, Adidas, Vans, New Balance, moletons pesados, camisetas oversized e acessórios streetwear.',
  keywords: 'tênis, sneakers, streetwear, nike, adidas, vans, new balance, gigante multimarcas, roupas esportivas, moda urbana'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-dark-950 text-white min-h-screen flex flex-col antialiased selection:bg-brand-500 selection:text-black">
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <OwnerLoginModal />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
