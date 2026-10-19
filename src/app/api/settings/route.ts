import { NextRequest, NextResponse } from 'next/server';
import { getStoreSettings, updateStoreSettings } from '@/lib/db';

export async function GET() {
  try {
    const settings = getStoreSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateStoreSettings(body);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
