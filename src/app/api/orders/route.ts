import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const orderNumber = searchParams.get('orderNumber');
    let orders = getOrders();

    if (status && status !== 'todos') {
      orders = orders.filter(o => o.orderStatus === status);
    }

    if (orderNumber) {
      const clean = orderNumber.replace('#', '').trim().toUpperCase();
      orders = orders.filter(o => o.orderNumber.replace('#', '').trim().toUpperCase().includes(clean));
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createOrder(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
