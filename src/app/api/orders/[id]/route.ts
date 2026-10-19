import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, getOrderByNumber, updateOrderStatus } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Check by id or by orderNumber
    let order = getOrderById(id);
    if (!order) {
      order = getOrderByNumber(id);
    }

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, actor, title, description } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status é obrigatório.' }, { status: 400 });
    }

    const updated = updateOrderStatus(id, status, actor, title, description);
    if (!updated) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
