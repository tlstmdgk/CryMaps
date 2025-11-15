import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../lib/AuthContext'; // Import your new context
import { useEffect } from 'react';
import { Text, View } from 'react-native';

// This is the "gatekeeper" component
function RootLayoutNav() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments(); // Gets the current URL path

  useEffect(() => {
    if (loading) return; // Wait until auth state is loaded

    // Check if the user is on a screen in the "auth" flow (e.g., login page)
    // segments[0] is the first part of the URL.
    const inAuthFlow = segments[0] === 'login'; 

    if (!session && !inAuthFlow) {
      // User is not logged in and is NOT on the login page.
      // Send them to the login page.
      router.replace('/login');
    } else if (session && inAuthFlow) {
      // User IS logged in but IS on the login page.
      // Send them to the main app screen (index).
      router.replace('/');
    }
  }, [session, loading, segments, router]);

  // Show a loading screen while checking auth
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Once loaded, show the correct stack
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="map" options={{ headerShown: false }} />
    </Stack>
  );
}

// This is the root layout
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}