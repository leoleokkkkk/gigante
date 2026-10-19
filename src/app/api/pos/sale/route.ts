import { NextRequest, NextResponse } from 'next/server';
import { createPhysicalSale } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createPhysicalSale(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
