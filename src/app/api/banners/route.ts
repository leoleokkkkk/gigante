import { NextRequest, NextResponse } from 'next/server';
import { getBanners, saveBanner } from '@/lib/db';

export async function GET() {
  try {
    const banners = getBanners();
    return NextResponse.json(banners);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = saveBanner(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
