// Read-only diagnostic. Never print URLs, tokens, SQL errors or private records.
async function main() {
  if (process.env.VERCEL_ENV !== 'preview') return;
  const raw = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!raw || !token) return console.log('DB_PREFLIGHT: MISSING_CONFIGURATION');
  let url;
  try { url = new URL(raw.replace(/^libsql:\/\//, 'https://').replace(/\/$/, '')); }
  catch { return console.log('DB_PREFLIGHT: INVALID_DATABASE_URL'); }
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.turso.io') || url.username || url.password || url.search || url.hash || url.pathname !== '/') return console.log('DB_PREFLIGHT: INVALID_DATABASE_URL');
  async function query(sql) {
    const r = await fetch(url.origin + '/v2/pipeline', {
      method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: [{ type: 'execute', stmt: { sql, want_rows: true } }, { type: 'close' }] }),
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) throw new Error(r.status === 401 || r.status === 403 ? 'TOKEN_REJECTED' : 'DATABASE_HTTP_' + r.status);
    const d = await r.json(); const first = d.results?.[0];
    if (first?.type !== 'ok') throw new Error('SQL_REQUEST_REJECTED');
    return first.response.result;
  }
  try {
    await query('SELECT 1'); console.log('DB_PREFLIGHT: CONNECTION_OK');
    const result = await query("PRAGMA table_info('restaurant_submissions')");
    const nameIndex = result.cols.findIndex(col => col.name === 'name');
    const names = result.rows.map(row => row[nameIndex].value);
    if (names.length) {
      const required = ['id','owner_name','owner_email','owner_phone','restaurant_name','country','city','cuisine','address','opening_hours','created_at'];
      console.log('DB_PREFLIGHT: LEGACY_SCHEMA_' + (required.every(n => names.includes(n)) ? 'OK' : 'INCOMPATIBLE'));
    } else console.log('DB_PREFLIGHT: NEW_DATABASE');
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    console.log('DB_PREFLIGHT: ' + (/^(TOKEN_REJECTED|DATABASE_HTTP_\d+|SQL_REQUEST_REJECTED)$/.test(message) ? message : 'DATABASE_UNREACHABLE'));
  }
}
main().catch(() => console.log('DB_PREFLIGHT: CHECK_UNAVAILABLE'));
