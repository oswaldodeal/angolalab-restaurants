import 'server-only';

import { executePrivateSql, sqlRows } from '@/lib/turso';
import { pilotContactBlocked } from '@/lib/pilot-access-blocks';
import type { ProfessionalProfile } from '@/lib/professional-profile-fields';

async function prepareProfessionalProfiles() {
  await executePrivateSql(`CREATE TABLE IF NOT EXISTS professional_profiles (
    user_id TEXT PRIMARY KEY NOT NULL,
    display_name TEXT NOT NULL,
    profession TEXT NOT NULL,
    skills TEXT NOT NULL,
    languages TEXT NOT NULL,
    projects TEXT NOT NULL
  )`);
}

export async function getProfessionalProfile(userId: string): Promise<ProfessionalProfile | null> {
  await prepareProfessionalProfiles();
  const [row] = sqlRows(await executePrivateSql(`SELECT display_name, profession, skills, languages, projects
    FROM professional_profiles WHERE user_id = ?`, [userId]));
  return row ? {
    displayName: row.display_name ?? '',
    profession: row.profession ?? '',
    skills: row.skills ?? '',
    languages: row.languages ?? '',
    projects: row.projects ?? '',
  } : null;
}

export async function saveProfessionalProfile(userId: string, profile: ProfessionalProfile, contactKeys: string) {
  await prepareProfessionalProfiles();
  const result = await executePrivateSql(`INSERT INTO professional_profiles
    (user_id, display_name, profession, skills, languages, projects)
    SELECT ?, ?, ?, ?, ?, ? WHERE NOT ${pilotContactBlocked}
    ON CONFLICT(user_id) DO UPDATE SET display_name = excluded.display_name,
      profession = excluded.profession, skills = excluded.skills,
      languages = excluded.languages, projects = excluded.projects`,
  [userId, profile.displayName, profile.profession, profile.skills, profile.languages, profile.projects, contactKeys]);
  return Number(result.affected_row_count) === 1;
}
