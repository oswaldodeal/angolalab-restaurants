import 'server-only';

export type StaffSubmission = {
  id: string;
  restaurant_name: string;
  country: string;
  city: string;
  cuisine: string;
  address: string;
  opening_hours: string | null;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  status: string;
  created_at: string;
};

type Value = { type: string; value?: string };
type QueryResult = {
  results?: Array<{
    type?: string;
    response?: { result?: { cols?: Array<{ name: string }>; rows?: Value[][] } };
  }>;
};

export async function getStaffSubmissions(): Promise<StaffSubmission[]> {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url || !token) throw new Error('Database not configured');
  const endpoint = url.replace(/^libsql:\/\//, 'https://').replace(/\/$/, '');
  const parsed = new URL(endpoint);
  if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.turso.io')) {
    throw new Error('Invalid database URL');
  }
  const sql = `SELECT id, restaurant_name, country, city, cuisine, address,
    opening_hours, owner_name, owner_email, owner_phone, status, created_at
    FROM restaurant_submissions ORDER BY created_at DESC LIMIT 50`;
  const response = await fetch(endpoint + '/v2/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ type: 'execute', stmt: { sql } }, { type: 'close' }] }),
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('Database request failed');
  const data: QueryResult = await response.json();
  const first = data.results?.[0];
  if (first?.type !== 'ok' || !first.response?.result) throw new Error('Database query failed');
  const { cols = [], rows = [] } = first.response.result;
  return rows.map((row) => Object.fromEntries(cols.map((col, index) =>
    [col.name, row[index]?.type === 'null' ? null : (row[index]?.value ?? '')]
  )) as StaffSubmission);
}
