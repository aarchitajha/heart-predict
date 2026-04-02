import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const usersWithCounts = db.users
    .filter(u => u.role === 'user')
    .map(u => ({
      ...u,
      assessmentCount: db.records.filter(r => r.userId === u.id).length
    }));

  return NextResponse.json({ users: usersWithCounts, records: db.records });
}
