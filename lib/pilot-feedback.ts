import 'server-only';

import { executePrivateSql } from '@/lib/turso';

export async function preparePilotFeedback() {
  await executePrivateSql(`CREATE TABLE IF NOT EXISTS pilot_feedback (
    user_id TEXT NOT NULL, body TEXT NOT NULL, submitted_at TEXT NOT NULL
  )`);
}

export async function prepareRestaurantSurveys() {
  await executePrivateSql(`CREATE TABLE IF NOT EXISTS restaurant_experience_surveys (
    order_id TEXT PRIMARY KEY NOT NULL, ratings TEXT NOT NULL CHECK(json_valid(ratings)),
    comment TEXT NOT NULL, submitted_at TEXT NOT NULL, reviewed_at TEXT,
    analysis TEXT, visit_analysis TEXT
  )`);
}
