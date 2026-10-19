import { NextRequest, NextResponse } from 'next/server';
import { getReturns, updateReturnStatus } from '@/lib/db';

export async function GET() {
  try {
    const returns = getReturns();
    return NextResponse.json(returns);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, restock, notes } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'id e status são obrigatórios.' }, { status: 400 });
    }

    const updated = updateReturnStatus(id, status, restock, notes);
    if (!updated) {
      return NextResponse.json({ error: 'Devolução não encontrada.' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
