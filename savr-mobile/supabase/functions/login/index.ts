
import { createClient } from 'supabase';

// Read server-side credentials from Supabase environment variables.
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Configure CORS for requests from the mobile app and browser clients.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Return consistent JSON responses with the appropriate HTTP status.
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

Deno.serve(async (request: Request) => {
  // Handle browser CORS preflight requests without authenticating.
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only accept POST requests containing login credentials.
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  try {
    // Parse the credentials submitted by login.service.ts.
    const body = await request.json();

    // Trim the identifier and its type, but preserve the password exactly
    // as entered by the user.
    const identifier =
      typeof body.identifier === 'string'
        ? body.identifier.trim()
        : '';

    const identifierType = body.identifierType;

    const password =
      typeof body.password === 'string'
        ? body.password
        : '';

    // Require the client to explicitly identify the kind of login identifier.
    // This prevents numeric usernames from being mistaken for phone numbers.
    if (
      !identifier ||
      !password ||
      !['email', 'username', 'phone'].includes(identifierType)
    ) {
      return jsonResponse(
        {
          error:
            'A valid identifier type, identifier, and password are required.',
        },
        400,
      );
    }

    // Create a privileged client for restricted server-side database lookups.
    // Never expose the service-role key to the mobile application.
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

    // Create a separate client to authenticate credentials with Supabase Auth.
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

    // This variable will contain the email used by Supabase Auth.
    let email: string | null = null;

    // Email login: use the supplied email address directly.
    if (identifierType === 'email') {
      // Normalize email capitalization before authentication.
      email = identifier.toLowerCase();

    } else if (identifierType === 'phone') {
      // Phone login: resolve the supplied phone number to its account email.
      // The database function should only be executable by service_role.
      const { data, error } = await adminClient.rpc(
        'resolve_phone_email',
        { p_phone: identifier },
      );

      // Return a generic server error if the phone lookup fails.
      if (error) {
        console.error('Phone number lookup failed.');
        return jsonResponse(
          { error: 'Unable to log in. Please try again.' },
          500,
        );
      }

      // Do not reveal whether a phone number belongs to an account.
      if (typeof data !== 'string' || !data) {
        return jsonResponse(
          { error: 'Invalid credentials, or unable to log in.' },
          401,
        );
      }

      // Use the resolved email for password authentication.
      email = data.toLowerCase();
    } else {
      
      // Username login: resolve the username to its account email.
      // Numeric usernames are supported because the client explicitly
      // identifies this request as a username login.
      const { data, error } = await adminClient.rpc(
        'resolve_username_email',
        { p_username: identifier },
      );

      // Return a generic server error if the username lookup fails.
      if (error) {
        console.error('Username lookup failed.');
        return jsonResponse(
          { error: 'Unable to log in. Please try again.' },
          500,
        );
      }

      // Do not reveal whether a username belongs to an account.
      if (typeof data !== 'string' || !data) {
        return jsonResponse(
          { error: 'Invalid credentials, or unable to log in.' },
          401,
        );
      }

      // Use the resolved email for password authentication.
      email = data.toLowerCase();
    }

    // Authenticate with the resolved email and the user's original password.
    // Supabase Auth verifies the password and applies its configured auth rules.
    const { data, error } =
      await authClient.auth.signInWithPassword({
        email,
        password,
      });

    // Reject failed authentication or responses without a session.
    if (error || !data.session) {
      return jsonResponse(
        { error: 'Invalid credentials, or unable to log in.' },
        401,
      );
    }

    // Return the authenticated user and session to the mobile app.
    // login.service.ts persists this session using supabase.auth.setSession().
    return jsonResponse({
      user: data.user,
      session: data.session,
    });
  } catch {
    // Handle malformed JSON and unexpected runtime errors without exposing
    // internal details or credentials to the client.
    return jsonResponse(
      { error: 'Unable to log in. Please try again.' },
      500,
    );
  }
});
