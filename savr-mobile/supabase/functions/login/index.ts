import { createClient } from 'supabase';

// Read server credentials from the Supabase Edge Function environment.
// These values are available on the server and should not be exposed in the mobile app.
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// CORS headers control which cross-origin requests a browser can make.
// The wildcard allows requests from any origin. This is convenient for development,
// but should be restricted to trusted origins if browser-based access requires it.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Create a consistent JSON response for every outcome.
// The status parameter controls the HTTP status code (e.g. 200, 400, 401, or 500).
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
 * For usernames, a privileged database function resolves the username
 * to the associated email address. Supabase Auth then verifies the
 * email/password combination and returns a session to the mobile app.
 */
Deno.serve(async (request: Request) => {
  // Browsers may send an OPTIONS preflight request before the actual request.
  // Respond to it without attempting to authenticate anyone.
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // This endpoint only accepts POST requests because login credentials
  // are submitted in the request body.
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  try {
    // Parse the JSON sent by login.service.ts.
    const body = await request.json();

    // Accept an identifier (email or username) only if it is a string.
    // Trim surrounding whitespace so accidental spaces don't break login.
    const identifier =
      typeof body.identifier === 'string'
        ? body.identifier.trim()
        : '';

    // Accept the password only if it is a string.
    // Do not trim the password because whitespace may be intentional.
    const password =
      typeof body.password === 'string'
        ? body.password
        : '';

    // Reject requests with missing credentials before contacting Supabase.
    if (!identifier || !password) {
      return jsonResponse(
        { error: 'Email/username and password are required.' },
        400,
      );
    }

    // Create a privileged client for the username-to-email lookup.
    // The service-role key permits this client to call the restricted
    // resolve_username_email database function.
    // This key must remain server-side and must never be sent to the app.
    const adminClient = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          // This client only performs a database lookup.
          // It does not need to store or refresh a login session.
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    // Create a separate client for normal Supabase Auth operations.
    // This client uses the public anon key, not the privileged service-role key.
    const authClient = createClient(
      supabaseUrl,
      anonKey,
      {
        auth: {
          // The function returns the resulting session to the mobile app,
          // so it does not need to persist the session on the server.
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    // Assume the identifier is an email initially.
    // If it is a username, the lookup below replaces it with the email.
    let email = identifier;

    // Our login UI accepts either an email or a username.
    // By convention, an identifier without "@" is treated as a username.
    if (!identifier.includes('@')) {
      // Ask PostgreSQL to find the email associated with this username.
      // The database function performs a case-insensitive username comparison.
      const { data, error } = await adminClient.rpc(
        'resolve_username_email',
        { p_username: identifier },
      );

      // A database lookup error is different from an unknown username.
      // Log the operational failure without logging the submitted credentials.
      if (error) {
        console.error('Username lookup failed.');
        return jsonResponse(
          { error: 'Unable to log in. Please try again.' },
          500,
        );
      }

      // If no matching email was found, return the same generic credentials
      // error used for failed password authentication.
      // This avoids explicitly revealing whether a username exists.
      if (!data) {
        return jsonResponse(
          { error: 'Invalid email/username or password.' },
          401,
        );
      }

      // Replace the username with the email required by Supabase Auth.
      email = data;
    } else {
      // Normalize email capitalization before authentication.
      // The password itself remains unchanged.
      email = identifier.toLowerCase();
    }

    // Ask Supabase Auth to verify the email and password.
    // Supabase handles password verification and its configured auth rules.
    const { data, error } =
      await authClient.auth.signInWithPassword({
        email,
        password,
      });

    // Reject failed authentication or a response without a valid session.
    // Use a generic message for either case instead of revealing account details.
    if (error || !data.session) {
      return jsonResponse(
        { error: 'Invalid email/username or password.' },
        401,
      );
    }

    // Authentication succeeded. Return the authenticated user and session
    // to login.service.ts, which can establish the session in the app's
    // existing Supabase client using supabase.auth.setSession().
    return jsonResponse({
      user: data.user,
      session: data.session,
    });
  } catch {
    // Handle unexpected failures, such as malformed JSON or an unhandled
    // runtime error. Avoid returning internal details to the client.
    return jsonResponse(
      { error: 'Unable to log in. Please try again.' },
      500,
    );
  }
});
