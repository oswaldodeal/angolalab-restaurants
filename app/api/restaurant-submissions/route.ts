import { NextRequest, NextResponse } from 'next/server';
import { CITIES, COUNTRIES, CUISINES } from '@/lib/store';
import { executePrivateSql } from '@/lib/turso';

export const runtime = 'nodejs';

type Registration = {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  restaurantName: string;
  country: string;
  city: string;
  cuisine: string;
  address: string;
  openingHours: string;
};

function field(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text.length > 0 && text.length <= max ? text : null;
}

export async function POST(request: NextRequest) {
  // The database must exist before submissions can be accepted.
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return NextResponse.json(
      { error: 'Registration is not available yet.' },
      { status: 503 }
    );
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.startsWith('application/json')) {
    return NextResponse.json({ error: 'JSON required.' }, { status: 415 });
  }
  if (Number(request.headers.get('content-length') ?? 0) > 8192) {
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid payload');
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  // Honeypot field: reject automated submissions without retaining their data.
  if (raw.website) return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });

  const submission: Registration = {
    ownerName: field(raw.ownerName, 120) ?? '',
    ownerEmail: field(raw.ownerEmail, 254) ?? '',
    ownerPhone: field(raw.ownerPhone, 35) ?? '',
    restaurantName: field(raw.restaurantName, 160) ?? '',
    country: field(raw.country, 2) ?? '',
    city: field(raw.city, 60) ?? '',
    cuisine: field(raw.cuisine, 60) ?? '',
    address: field(raw.address, 300) ?? '',
    openingHours: typeof raw.openingHours === 'string' ? raw.openingHours.trim().slice(0, 200) : '',
  };

  const valid =
    Object.values(submission).slice(0, 8).every(Boolean) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.ownerEmail) &&
    /^[+\d()\s.-]{7,35}$/.test(submission.ownerPhone) &&
    COUNTRIES.some((c) => c.id === submission.country) &&
    CITIES.some((c) => c.id === submission.city && c.country === submission.country) &&
    CUISINES.some((c) => c.id === submission.cuisine);

  if (!valid) {
    return NextResponse.json({ error: 'Please check the registration details.' }, { status: 400 });
  }

  try {
    const id = crypto.randomUUID();
    await executePrivateSql(
      `INSERT INTO restaurant_submissions
        (id, owner_name, owner_email, owner_phone, restaurant_name, country, city, cuisine, address, opening_hours, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        id, submission.ownerName, submission.ownerEmail, submission.ownerPhone,
        submission.restaurantName, submission.country, submission.city,
        submission.cuisine, submission.address, submission.openingHours || null,
      ]
    );
    return NextResponse.json(
      { id, status: 'pending', message: 'Submitted for staff review.' },
      { status: 201 }
    );
  } catch {
    // Do not return private DB errors or credentials to the browser.
    return NextResponse.json(
      { error: 'Unable to save the submission. Please try again later.' },
      { status: 503 }
    );
  }
}
