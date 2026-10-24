import 'server-only';

// This module is server-only. Never prefix the variables with NEXT_PUBLIC_.
type SqlArg = { type: 'text'; value: string } | { type: 'null' };

export async function executePrivateSql(sql: string, values: Array<string | null>) {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url || !token) {
    throw new Error('TURSO_NOT_CONFIGURED');
  }
  // Only libsql+https:// or https:// URLs from the Turso dashboard are accepted.
  const endpoint = url.replace(/^libsql:\/\//, 'https://').replace(/\/$/, '');
  const parsed = new URL(endpoint);
  if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.turso.io')) {
    throw new Error('TURSO_INVALID_URL');
  }
  const args: SqlArg[] = values.map((value) =>
    value === null ? { type: 'null' } : { type: 'text', value }
  );
  const response = await fetch(`${endpoint}/v2/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        { type: 'execute', stmt: { sql, args } },
        { type: 'close' },
      ],
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('TURSO_REQUEST_FAILED');
  const data: { results?: Array<{ type?: string; error?: { message?: string } }> } = await response.json();
  if (data.results?.[0]?.type !== 'ok') throw new Error('TURSO_QUERY_FAILED');
}
