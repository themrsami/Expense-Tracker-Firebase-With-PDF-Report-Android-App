import { Stack } from 'expo-router';
import { AuthProvider } from '@/AuthContext';
import { getRedirectResult } from "firebase/auth";
import { auth } from '@/firebaseconfig';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    const checkUser = async () => {
      const result = await getRedirectResult(auth);
      if (result) {
        const user = result.user;
        console.log("User Info: ", user);
        // Navigate to the dashboard or home page
      }
    };
  
    checkUser();
  }, []);
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Signup/Login' }} />
          <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
          <Stack.Screen name="login" options={{ title: 'Log In' }} />
          <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      </Stack>
    </AuthProvider>
  );
}
