import { createClient } from "@supabase/supabase-js";

// This client uses the SERVICE ROLE key, which bypasses Row Level Security.
// It must only ever be imported into server-side code (Server Actions, Route
// Handlers) — never into a Client Component, or the key would be bundled
// into the browser JS and exposed publicly.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);