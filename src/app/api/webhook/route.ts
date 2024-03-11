import { NextRequest, NextResponse } from 'next/server';

import { hotmart } from '../lib/getaways/hotmart';

import { admin, db } from '@/database/admin';

import { addDays } from 'date-fns';

import type { License } from '@/types/User';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const data = hotmart(body);

  if (!data.success) {
    return NextResponse.json(
      { message: 'Invalid request body', error: data.backlog },
      { status: 400 }
    );
  }

  if (data.type !== 'sale') {
    return NextResponse.json(
      { message: 'Invalid event type' },
      { status: 200 }
    );
  }

  const licenseAlreadyExists = await db
    .collection('licenses')
    .where('email', '==', data.lead.email!)
    .get();

  if (!licenseAlreadyExists.empty) {
    return NextResponse.json(
      { message: 'License already exists' },
      { status: 200 }
    );
  }

  const userAlreadyExists = await db
    .collection('users')
    .where('email', '==', data.lead.email!)
    .get();

  if (!userAlreadyExists.empty) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 200 }
    );
  }

  const query = db.collection('licenses');

  const licensedUntil = addDays(new Date(), 30);

  const license: Omit<License, 'id'> = {
    name: data.lead.name || null,
    email: data.lead.email!,
    phone: data.lead.phone,
    license: 'premium',
    licensedUntil: admin.firestore.Timestamp.fromDate(licensedUntil),
  };

  await query.add(license);

  return NextResponse.json(
    { message: 'User created successfully' },
    { status: 200 }
  );
}
