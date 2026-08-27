import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function getScreenshotUrl(path: string) {
  const { data, error } = await supabaseAdmin.storage
    .from("trade-screenshots")
    .createSignedUrl(path, 3600); // valid for 1 hour

  if (error || !data) {
    return null;
  }

  return data.signedUrl;
}  

