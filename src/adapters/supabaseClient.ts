import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim().length > 0 &&
  supabaseAnonKey.trim().length > 0 &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

/**
 * Ensures an active anonymous session exists for this device/browser.
 * If Supabase is unconfigured, resolves gracefully to null without error.
 */
export async function getOrInitAnonymousUser(): Promise<User | null> {
  if (!supabase) return null;

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.warn('Supabase getSession warning:', sessionError.message);
    }

    if (sessionData?.session?.user) {
      return sessionData.session.user;
    }

    // Attempt anonymous sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
    if (signInError) {
      console.warn('Supabase anonymous sign-in warning:', signInError.message);
      return null;
    }

    return signInData.user ?? null;
  } catch (err) {
    console.warn('Supabase auth network unreachable, continuing in offline mode', err);
    return null;
  }
}
