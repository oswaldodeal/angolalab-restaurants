import 'server-only';

import { pilotContactBlocked } from '@/lib/pilot-access-blocks';
import { prepareProfessionalProfiles } from '@/lib/professional-profile';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { emptyVisitorSettings, type VisitorSettings } from '@/lib/fpp-visitor-settings';

async function prepareVisitorSettings() {
  await prepareProfessionalProfiles();
  await executePrivateSql(`CREATE TABLE IF NOT EXISTS fpp_visitor_settings (
    user_id TEXT PRIMARY KEY NOT NULL REFERENCES professional_profiles(user_id),
    preferences TEXT NOT NULL CHECK (json_valid(preferences))
  )`);
}

export async function getFppVisitorSettings(userId: string): Promise<VisitorSettings> {
  await prepareVisitorSettings();
  const [row] = sqlRows(await executePrivateSql('SELECT preferences FROM fpp_visitor_settings WHERE user_id = ?', [userId]));
  return row?.preferences ? { ...emptyVisitorSettings, ...JSON.parse(row.preferences) } : emptyVisitorSettings;
}

export async function storeFppVisitorSettings(userId: string, settings: VisitorSettings, contactKeys: string) {
  await prepareVisitorSettings();
  const result = await executePrivateSql(`INSERT INTO fpp_visitor_settings (user_id, preferences)
    SELECT user_id, ? FROM professional_profiles WHERE user_id = ? AND NOT ${pilotContactBlocked}
    ON CONFLICT(user_id) DO UPDATE SET preferences = excluded.preferences`,
  [JSON.stringify(settings), userId, contactKeys]);
  return Number(result.affected_row_count) === 1;
}
