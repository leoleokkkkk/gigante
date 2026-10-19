import { NextRequest, NextResponse } from 'next/server';
import {
  getCurrentCashRegister,
  getCashRegistersHistory,
  openCashRegister,
  closeCashRegister,
  addCashMovement
} from '@/lib/db';

export async function GET() {
  try {
    const current = getCurrentCashRegister();
    const history = getCashRegistersHistory();
    return NextResponse.json({ current, history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'open') {
      const { operatorName, openingBalance } = body;
      if (!operatorName || typeof openingBalance !== 'number') {
        return NextResponse.json(
          { error: 'Nome do operador e valor de abertura são obrigatórios.' },
          { status: 400 }
        );
      }
      const reg = openCashRegister(operatorName, openingBalance);
      return NextResponse.json(reg, { status: 201 });
    }

    if (action === 'close') {
      const { countedBalance, discrepancyNote } = body;
      if (typeof countedBalance !== 'number') {
        return NextResponse.json({ error: 'Valor contado é obrigatório.' }, { status: 400 });
      }
      const result = closeCashRegister(countedBalance, discrepancyNote);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result.register);
    }

    if (action === 'movement') {
      const { type, category, paymentMethod, amount, description } = body;
      if (!type || !category || !paymentMethod || typeof amount !== 'number' || !description) {
        return NextResponse.json({ error: 'Todos os campos da movimentação são obrigatórios.' }, { status: 400 });
      }
      const result = addCashMovement(type, category, paymentMethod, amount, description);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result.movement);
    }

    return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
