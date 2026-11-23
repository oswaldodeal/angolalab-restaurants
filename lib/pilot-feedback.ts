import 'server-only';

import { executePrivateSql } from '@/lib/turso';

export async function preparePilotFeedback() {
  await executePrivateSql(`CREATE TABLE IF NOT EXISTS pilot_feedback (
    user_id TEXT NOT NULL, body TEXT NOT NULL, submitted_at TEXT NOT NULL
  )`);
}
