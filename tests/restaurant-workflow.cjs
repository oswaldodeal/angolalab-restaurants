const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync(':memory:');
const root = path.resolve(__dirname, '..');
const cache = new Map();
let loggedIn = false;
let session = '';
const writes = [];
class Redirect extends Error { constructor(url) { super(url); this.url = url; } }
class NextRequest extends Request { get nextUrl() { return new URL(this.url); } }
const responses = { json: (value, init) => Response.json(value, init) };
const cookies = async () => ({ get: () => ({ value: loggedIn ? session : '' }), set: () => { loggedIn = false; } });
process.env.TURSO_DATABASE_URL = 'libsql://test.turso.io';
process.env.TURSO_AUTH_TOKEN = 'test-not-a-secret';
process.env.STAFF_REVIEW_PASSWORD = 'a-long-test-only-staff-password';
async function fakeFetch(url, options) {
  assert.equal(url, 'https://test.turso.io/v2/pipeline');
  const body = JSON.parse(options.body);
  const { sql, args = [] } = body.requests[0].stmt;
  try {
    const stmt = db.prepare(sql);
    const values = args.map(arg => arg.type === 'null' ? null : arg.value);
    const cols = stmt.columns().map(col => ({ name: col.name }));
    let rows = [], affected_row_count = 0;
    if (cols.length) rows = stmt.all(...values).map(row => cols.map(col => row[col.name] == null ? { type: 'null' } : { type: 'text', value: String(row[col.name]) }));
    else { const result = stmt.run(...values); affected_row_count = Number(result.changes); writes.push(sql); }
    return Response.json({ results: [{ type: 'ok', response: { result: { cols, rows, affected_row_count } } }] });
  } catch { return Response.json({ results: [{ type: 'error' }] }); }
}
function load(name) {
  const full = path.join(root, name + '.ts');
  if (cache.has(full)) return cache.get(full).exports;
  const module = { exports: {} }; cache.set(full, module);
  const code = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const localRequire = id => {
    if (id === 'server-only') return {};
    if (id === 'next/headers') return { cookies };
    if (id === 'next/navigation') return { redirect: url => { throw new Redirect(url); } };
    if (id === 'next/cache') return { revalidatePath: () => {} };
    if (id === 'next/server') return { NextRequest, NextResponse: responses };
    if (id.startsWith('@/')) return load(id.slice(2));
    return require(id);
  };
  vm.runInThisContext('(function(require,module,exports,fetch){' + code + '\n})', { filename: full })(localRequire, module, module.exports, fakeFetch);
  return module.exports;
}
const payload = { ownerName: 'PRIVATE_OWNER', ownerEmail: 'private@example.test', ownerPhone: '+44 7700 900123', restaurantName: 'Pilot Test Restaurant', country: 'GB', city: 'manchester', cuisine: 'angolan', address: 'PRIVATE_ADDRESS', openingHours: 'Mon–Fri 10–18', website: '' };
function request(body, origin = 'https://pilot.test') { return new NextRequest('https://pilot.test/api/restaurant-submissions', { method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify(body) }); }
async function action(id, decision, consent = true) {
  const form = new FormData(); form.set('id', id); form.set('decision', decision); form.set('note', 'Pilot identity checked; explicit publication permission reviewed.');
  if (consent) form.set('publicationConsent', 'on');
  try { await load('app/staff/review/actions').reviewRestaurant(form); assert.fail('Expected redirect'); } catch (error) { if (!(error instanceof Redirect)) throw error; return error.url; }
}
(async () => {
  const data = load('lib/restaurant-data');
  const api = load('app/api/restaurant-submissions/route');
  const auth = load('lib/staff-auth'); session = auth.makeSession();
  assert.equal(auth.validPassword('💪'.repeat(31)), false, 'Unicode passwords fail without throwing');
  const staffSecret = process.env.STAFF_REVIEW_PASSWORD;
  delete process.env.STAFF_REVIEW_PASSWORD;
  assert.equal((await api.POST(request(payload))).status, 503, 'Intake stays closed without a staff review password');
  process.env.STAFF_REVIEW_PASSWORD = staffSecret;
  const before = writes.length;
  assert.equal(await action('anything', 'approved'), '/staff/review/login');
  assert.equal(writes.length, before, 'Unauthorized review cannot write to DB');
  assert.equal((await api.POST(request(payload, 'https://other.test'))).status, 403);
  assert.equal((await api.POST(request({ ...payload, city: 'luanda' }))).status, 400, 'Country/city mismatch rejected');
  assert.equal((await api.POST(request({ ...payload, ownerEmail: 'bad' }))).status, 400);
  assert.equal((await api.POST(request({ ...payload, website: 'spam' }))).status, 400);
  assert.equal((await api.POST(request({ ...payload, ownerName: 'x'.repeat(9000) }))).status, 413);
  const result = await api.POST(request(payload)); assert.equal(result.status, 201);
  const { id } = await result.json();
  assert.equal((await data.getPublishedRestaurants()).length, 0, 'Pending is private');
  loggedIn = true;
  assert.equal(await action(id, 'approved', false), '/staff/review?result=invalid');
  assert.equal((await data.getPublishedRestaurants()).length, 0);
  assert.equal(await action(id, 'approved'), '/staff/review?result=saved');
  const list = await data.getPublishedRestaurants(); assert.equal(list.length, 1);
  assert.equal(list[0].country, 'GB', 'UK intake survives the schema');
  assert.equal(list[0].status, 'basic'); assert.equal(list[0].verifiedAt, undefined);
  assert.equal(list[0].hours, payload.openingHours);
  assert(!JSON.stringify(list).includes('PRIVATE_')); assert(!JSON.stringify(list).includes('private@example'));
  assert.equal(db.prepare('SELECT count(*) AS n FROM restaurant_review_history').get().n, 1);
  assert.equal(await action(id, 'approved'), '/staff/review?result=stale', 'Duplicate approval does not duplicate listing/audit');
  assert.equal(db.prepare('SELECT count(*) AS n FROM restaurant_review_history').get().n, 1);
  const verifiedForm = new FormData();
  verifiedForm.set('id', id);
  verifiedForm.set('publicAddress', '12 Fictional Business Street');
  verifiedForm.set('publicPhone', '+44 1632 960001');
  verifiedForm.set('evidenceNote', 'Fictional evidence and permission checked for this test.');
  const publishVerified = () => load('app/staff/review/actions').publishVerifiedContacts(verifiedForm);
  loggedIn = false;
  await assert.rejects(publishVerified, error => error.url === '/staff/review/login');
  loggedIn = true;
  await assert.rejects(publishVerified, error => error.url.endsWith('invalid-verification'));
  verifiedForm.set('verifiedConsent', 'on');
  await assert.rejects(publishVerified, error => error.url.endsWith('result=verified'));
  const verifiedProfile = await data.getPublishedRestaurant(id);
  assert.equal(verifiedProfile.status, 'verified');
  assert.equal(verifiedProfile.address, '12 Fictional Business Street');
  assert.equal(verifiedProfile.phone, '+44 1632 960001');
  assert.ok(!JSON.stringify(verifiedProfile).includes('PRIVATE_'));
  assert.ok(!JSON.stringify(verifiedProfile).includes(payload.ownerPhone));
  await assert.rejects(publishVerified, error => error.url.endsWith('result=stale'));
  const proForm = new FormData();
  proForm.set('id', id);
  const enablePro = () => load('app/staff/review/actions').enableProPlan(proForm);
  loggedIn = false;
  await assert.rejects(enablePro, error => error.url === '/staff/review/login');
  loggedIn = true;
  proForm.set('coverPhotoUrl', 'javascript:alert(1)');
  await assert.rejects(enablePro, error => error.url.endsWith('invalid-cover'));
  assert.equal((await data.getPublishedRestaurant(id)).profilePlan, 'verified');
  proForm.set('coverPhotoUrl', 'https://images.example/restaurant.jpg');
  await assert.rejects(enablePro, error => error.url.endsWith('result=saved'));
  const proProfile = await data.getPublishedRestaurant(id);
  assert.equal(proProfile.status, 'verified');
  assert.equal(proProfile.profilePlan, 'pro');
  assert.equal(proProfile.photos[0], 'https://images.example/restaurant.jpg');
  assert.equal(await action(id, 'withdrawn'), '/staff/review?result=saved');
  assert.equal(await data.getPublishedRestaurant(id), null, 'Withdrawal removes profile');
  assert.equal(db.prepare('SELECT count(*) AS n FROM restaurant_verified_contacts').get().n, 0);
  assert.equal(db.prepare('SELECT count(*) AS n FROM restaurant_pro_plans').get().n, 0);
  await assert.rejects(enablePro, error => error.url.endsWith('result=stale'));
  await assert.rejects(publishVerified, error => error.url.endsWith('result=stale'));
  const second = await (await api.POST(request({ ...payload, restaurantName: 'Rejected Test' }))).json();
  assert.equal(await action(second.id, 'rejected'), '/staff/review?result=saved');
  assert.equal((await data.getPublishedRestaurants()).length, 0);
  // Publication failure must roll back status and audit, not leave half an approval.
  const third = await (await api.POST(request({ ...payload, restaurantName: 'Rollback Test' }))).json();
  db.exec("CREATE TRIGGER fail_test BEFORE INSERT ON restaurant_listings BEGIN SELECT RAISE(ABORT,'test'); END");
  assert.equal(await action(third.id, 'approved'), '/staff/review?result=unavailable');
  assert.equal(db.prepare('SELECT status FROM restaurant_intake WHERE id=?').get(third.id).status, 'pending');
  assert.equal(db.prepare('SELECT count(*) AS n FROM restaurant_review_history WHERE submission_id=?').get(third.id).n, 0);
  db.exec('DROP TRIGGER fail_test');
  // Legacy AO/PT submissions survive migration; no automatic publication or verification.
  db.prepare(`INSERT INTO restaurant_submissions (id,owner_name,owner_email,owner_phone,restaurant_name,country,city,cuisine,address,status) VALUES ('legacy','owner','x@y.test','12345678','Legacy','AO','luanda','angolan','hidden','approved')`).run();
  for (const statement of load('lib/restaurant-schema').restaurantSchema) db.exec(statement);
  assert.equal(db.prepare("SELECT status FROM restaurant_intake WHERE id='legacy'").get().status, 'pending');
  assert.equal(db.prepare("SELECT status FROM restaurant_submissions WHERE id='legacy'").get().status, 'approved');
  assert.equal((await data.getPublishedRestaurants()).length, 0);
  console.log('PASS: UK registration; validation; unauthorized/consent guards; Basic publication; staff-only Verified contacts; private field isolation; duplicate review; rejection; withdrawal; atomic rollback; legacy preservation.');
})().catch(error => { console.error(error); process.exitCode = 1; });
