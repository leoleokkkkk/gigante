import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produto não encontrado — Gigante Multimarcas'
    };
  }

  return {
    title: `${product.name} — Gigante Multimarcas`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — Gigante Multimarcas`,
      description: product.shortDescription || product.description.slice(0, 160),
      images: [{ url: product.images[0]?.url || '' }]
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  return <ProductDetailClient initialProduct={product || null} slug={slug} />;
}
