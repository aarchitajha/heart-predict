import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, role, adminId, token } = await req.json();

    if (role === 'admin') {
      // Admin auth requested
      if (adminId === 'CS-ADMIN-001' && token === 'sanctuary') {
        const adminUser = db.users.find(u => u.id === 'CS-ADMIN-001')!;
        return NextResponse.json({ user: adminUser });
      }
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    if (role === 'user' && name) {
      // Find or create user
      let user = db.users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.role === 'user');
      if (!user) {
        user = {
          id: `US-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          name: name,
          role: 'user'
        };
        db.users.push(user);
      }
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
