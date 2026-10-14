
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonResponse = (
  body: Record<string, unknown>,
  status = 200,
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });

/**
 * Authenticates a user using either an email address or username.
 *
 * Username resolution is performed using a privileged database function.
 * Authentication itself uses Supabase Auth, and successful sessions
 * are returned to the mobile client.
 */
Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  try {
    const body = await request.json();
    const identifier =
      typeof body.identifier === 'string'
        ? body.identifier.trim()
        : '';
    const password =
      typeof body.password === 'string'
        ? body.password
        : '';

    if (!identifier || !password) {
      return jsonResponse(
        { error: 'Email/username and password are required.' },
        400,
      );
    }

    const adminClient = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const authClient = createClient(
      supabaseUrl,
      anonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    let email = identifier;

    if (!identifier.includes('@')) {
      const { data, error } = await adminClient.rpc(
        'resolve_username_email',
        { p_username: identifier },
      );

      if (error) {
        console.error('Username lookup failed.');
        return jsonResponse(
          { error: 'Unable to log in. Please try again.' },
          500,
        );
      }

      if (!data) {
        return jsonResponse(
          { error: 'Invalid email/username or password.' },
          401,
        );
      }

      email = data;
    } else {
      email = identifier.toLowerCase();
    }

    const { data, error } =
      await authClient.auth.signInWithPassword({
        email,
        password,
      });

    if (error || !data.session) {
      return jsonResponse(
        { error: 'Invalid email/username or password.' },
        401,
      );
    }

    return jsonResponse({
      user: data.user,
      session: data.session,
    });
  } catch {
    return jsonResponse(
      { error: 'Unable to log in. Please try again.' },
      500,
    );
  }
});
