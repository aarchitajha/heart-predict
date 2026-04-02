import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (userId) {
    const userRecords = db.records.filter(r => r.userId === userId);
    return NextResponse.json({ records: userRecords });
  }

  // If no userId, return all (assume admin call for simplicity in prototype)
  return NextResponse.json({ records: db.records });
}

export async function POST(req: Request) {
  try {
    const { userId, request, response } = await req.json();

    if (!userId || !request || !response) {
       return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const record = {
      id: `REC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      userId,
      date: new Date().toISOString(),
      request,
      response
    };

    db.records.push(record);
    return NextResponse.json({ record });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
