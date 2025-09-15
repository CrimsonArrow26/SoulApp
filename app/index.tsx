import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/auth-store';

export default function Index() {
  const { hasCompletedOnboarding, isLoading, session } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/auth/login" />;
  }

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/introduction" />;
}