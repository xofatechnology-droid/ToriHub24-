import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types';

// Service-role client — server-only. Bypasses RLS. Never import this in a Client Component.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
