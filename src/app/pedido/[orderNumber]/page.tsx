import React from 'react';
import { notFound } from 'next/navigation';
import { getOrderByNumber, getOrderById } from '@/lib/db';
import OrderTrackingClient from './OrderTrackingClient';

export async function generateMetadata({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  return {
    title: `Rastreamento Pedido #${orderNumber} — Gigante Multimarcas`,
    description: `Acompanhe o status e a entrega do pedido #${orderNumber} na Gigante Multimarcas.`
  };
}

export default async function OrderTrackingPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  let order = getOrderByNumber(orderNumber);
  if (!order) {
    order = getOrderById(orderNumber);
  }

  return <OrderTrackingClient initialOrder={order || null} orderNumber={orderNumber} />;
}
