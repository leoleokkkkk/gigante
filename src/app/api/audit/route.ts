import { NextResponse } from 'next/server';
import { getAuditLogs, getCustomers } from '@/lib/db';

export async function GET() {
  try {
    const logs = getAuditLogs();
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
