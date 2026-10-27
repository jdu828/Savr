
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '../src/lib/supabase';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Restore the saved session and listen for future authentication changes.
  useEffect(() => {
    let isMounted = true;

    // Subscribe to auth changes before checking the current session.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setIsInitializing(false);
      }
    });

    // Read the persisted session during app startup.
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;

        if (error) {
          setSession(null);
        } else {
          setSession(data.session);
        }

        setIsInitializing(false);
      })
      .catch(() => {
        if (isMounted) {
          setSession(null);
          setIsInitializing(false);
        }
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Redirect users according to their authentication state.
  useEffect(() => {
    if (isInitializing) return;

    const currentRoute = segments[0];
    const isLoginRoute = currentRoute === 'login';

    if (!session && !isLoginRoute) {
      router.replace('/login');
    } else if (session && isLoginRoute) {
      router.replace('/');
    }
  }, [isInitializing, session, segments, router]);

  // Avoid rendering routes until the saved session has been checked.
  if (isInitializing) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#24231F',
          }}
        >
          <ActivityIndicator size="large" color="#F5F1E8" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack />
    </GestureHandlerRootView>
  );
}
