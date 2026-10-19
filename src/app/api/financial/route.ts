import { NextRequest, NextResponse } from 'next/server';
import { getFinancialTransactions, addFinancialTransaction } from '@/lib/db';

export async function GET() {
  try {
    const transactions = getFinancialTransactions();
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, category, amount, paymentMethod, date, description, observation } = body;

    if (!type || !category || typeof amount !== 'number' || !date || !description) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 });
    }

    const tx = addFinancialTransaction({
      type,
      category,
      amount,
      paymentMethod: paymentMethod || 'Pix',
      date,
      description,
      observation,
      referenceType: 'manual'
    });

    return NextResponse.json(tx, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
