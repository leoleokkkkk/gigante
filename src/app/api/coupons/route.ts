import { NextRequest, NextResponse } from 'next/server';
import { getCoupons, saveCoupon } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const coupons = getCoupons();

    if (code) {
      const found = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
      if (!found) {
        return NextResponse.json({ error: 'Cupom inválido ou expirado.' }, { status: 404 });
      }
      return NextResponse.json(found);
    }

    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = saveCoupon(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
