import { NextRequest, NextResponse } from 'next/server';
import { getCategories, saveCategory } from '@/lib/db';

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = saveCategory(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
