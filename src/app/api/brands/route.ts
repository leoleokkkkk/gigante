import { NextRequest, NextResponse } from 'next/server';
import { getBrands, saveBrand } from '@/lib/db';

export async function GET() {
  try {
    const brands = getBrands();
    return NextResponse.json(brands);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = saveBrand(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
