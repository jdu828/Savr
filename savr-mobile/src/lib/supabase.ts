
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Create the Supabase client with persistent authentication.
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      // Store the session securely across app restarts using AsyncStorage.
      storage: AsyncStorage,

      // Refresh access tokens automatically when needed.
      autoRefreshToken: true,

      // Persist the user's session across app restarts.
      persistSession: true,

      // Deep-link session detection is not needed for this configuration.
      detectSessionInUrl: false,
    },
  },
);

// Manage automatic token refresh based on the native app's lifecycle.
// Register this listener only once, alongside the Supabase client.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      // Resume token refresh when the user returns to Savr.
      supabase.auth.startAutoRefresh();
    } else {
      // Pause token refresh while Savr is in the background.
      supabase.auth.stopAutoRefresh();
    }
  });
}
