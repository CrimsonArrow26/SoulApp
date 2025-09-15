// supabase/functions/_shared/supabaseClient.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.4';

// Supabase UI forbids secrets starting with SUPABASE_. Support both names.
const SUPABASE_URL =
  Deno.env.get('PROJECT_URL') ||
  Deno.env.get('SUPABASE_URL') ||
  '';

const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get('SERVICE_ROLE_KEY') ||
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ||
  '';

const SUPABASE_ANON_KEY =
  Deno.env.get('ANON_KEY') ||
  Deno.env.get('SUPABASE_ANON_KEY') ||
  undefined;

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export const createAnonClient = () => {
  if (!SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_ANON_KEY not set');
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
