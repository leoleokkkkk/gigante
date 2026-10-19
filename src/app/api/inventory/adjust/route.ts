import { NextRequest, NextResponse } from 'next/server';
import { adjustVariantStock, getInventoryMovements } from '@/lib/db';

export async function GET() {
  try {
    const movements = getInventoryMovements();
    return NextResponse.json(movements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { variantId, quantityChange, type, reason, userName } = body;

    if (!variantId || typeof quantityChange !== 'number' || !type || !reason) {
      return NextResponse.json(
        { error: 'variantId, quantityChange, type e reason são obrigatórios.' },
        { status: 400 }
      );
    }

    const result = adjustVariantStock(variantId, quantityChange, type, reason, { userName });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
