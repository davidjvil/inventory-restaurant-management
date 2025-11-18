import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new multi-step signup flow
    router.replace('/(auth)/signup/account-type');
  }, []);

  return null;
}

