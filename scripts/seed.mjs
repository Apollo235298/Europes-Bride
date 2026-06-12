// Seed the Supabase project: create the two portal users (admin + client),
// their profile rows, and the initial dashboard document from lib/demo-data.js.
// Usage: fill .env.local (service role key + seed emails/passwords), then `npm run seed`.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// Load .env.local manually (no dotenv dependency).
try {
  for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch { /* .env.local missing — rely on shell env */ }

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const { DEMO_DATA } = await import("../lib/demo-data.js");
const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function ensureUser(email, password, displayName, role) {
  if (!email || !password) {
    console.warn(`Skipping ${role} user — email/password not set in .env.local`);
    return;
  }
  const { data: created, error } = await admin.auth.admin.createUser({
    email, password, email_confirm: true
  });
  let userId = created?.user?.id;
  if (error) {
    if (!/already/i.test(error.message)) throw error;
    const { data: list } = await admin.auth.admin.listUsers();
    userId = list.users.find((u) => u.email === email)?.id;
    console.log(`User ${email} already exists`);
  } else {
    console.log(`Created user ${email}`);
  }
  if (userId) {
    const { error: pErr } = await admin.from("profiles").upsert({ id: userId, display_name: displayName, role });
    if (pErr) throw pErr;
    console.log(`Profile set: ${displayName} (${role})`);
  }
}

await ensureUser(process.env.SEED_ADMIN_EMAIL, process.env.SEED_ADMIN_PASSWORD, "Joshua Moon", "admin");
await ensureUser(process.env.SEED_CLIENT_EMAIL, process.env.SEED_CLIENT_PASSWORD, "Ivan Khalus", "client");

const { error: dErr } = await admin.from("dashboard_state").upsert({ id: 1, data: DEMO_DATA, updated_at: new Date().toISOString() });
if (dErr) throw dErr;
console.log("Dashboard document seeded. Done.");
