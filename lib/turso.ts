import 'server-only';

type Cell = { type: string; value?: string };
export type SqlResult = { cols?: Array<{ name: string }>; rows?: Cell[][]; affected_row_count?: number };

export async function executePrivateSql(sql: string, values: Array<string | null> = []): Promise<SqlResult> {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url || !token) throw new Error('TURSO_NOT_CONFIGURED');
  const endpoint = url.replace(/^libsql:\/\//, 'https://').replace(/\/$/, '');
  const parsed = new URL(endpoint);
  if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.turso.io')) throw new Error('TURSO_INVALID_URL');
  const args = values.map(value => value === null ? { type: 'null' } : { type: 'text', value });
  const response = await fetch(`${endpoint}/v2/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ type: 'execute', stmt: { sql, args, want_rows: true } }, { type: 'close' }] }),
    cache: 'no-store', signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('TURSO_REQUEST_FAILED');
  const data: { results?: Array<{ type?: string; response?: { result?: SqlResult } }> } = await response.json();
  const first = data.results?.[0];
  if (first?.type !== 'ok' || !first.response?.result) throw new Error('TURSO_QUERY_FAILED');
  return first.response.result;
}

export function sqlRows(result: SqlResult): Array<Record<string, string | null>> {
  return (result.rows ?? []).map(row => Object.fromEntries((result.cols ?? []).map((col, i) =>
    [col.name, row[i]?.type === 'null' ? null : row[i]?.value ?? '']
  )));
}
