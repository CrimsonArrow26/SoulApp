import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasSeenIntroduction, setHasSeenIntroduction] = useState(false);
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const { data } = await supabase.auth.getSession();
      const onboardingStatus = await AsyncStorage.getItem('onboarding_complete');
      const introStatus = await AsyncStorage.getItem('introduction_seen');
      
      if (data.session) setSession(data.session);

      if (userData) setUser(JSON.parse(userData));
      
      if (onboardingStatus) setHasCompletedOnboarding(true);
      
      if (introStatus) setHasSeenIntroduction(true);
    } catch (error) {
      console.log('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side register/login using supabase-js
  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setSession(data.session);
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session);
  };

  const refresh = async () => {
    await supabase.auth.refreshSession();
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
  };

  const fetchProfile = async () => {
    const { data: userAuth } = await supabase.auth.getUser();
    if (!userAuth.user) return;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userAuth.user.id)
        .single();
      if (profile) {
        // Map backend profile to User shape partially for UI
        const mapped: User = {
          id: profile.id,
          firstName: profile.full_name || '',
          nickname: profile.nickname || '',
          age: profile.dob ? Math.max(18, Math.floor((Date.now() - Date.parse(profile.dob)) / (365.25 * 24 * 60 * 60 * 1000))) : 18,
          bio: profile.bio || '',
          photos: profile.photos || [],
          interests: profile.interests || {},
          mode: profile.mode || 'normal',
          isOnline: true,
          lastSeen: new Date(),
        };
        setUser(mapped);
        await AsyncStorage.setItem('user', JSON.stringify(mapped));
        await AsyncStorage.setItem('onboarding_complete', 'true');
        setHasCompletedOnboarding(true);
      }
    } catch (_) {
      // no profile yet
    }
  };

  const createUser = async (payload: Partial<User>) => {
    const newUser: User = {
      id: `local-${Date.now()}`,
      firstName: payload.firstName || '',
      nickname: payload.nickname || '',
      age: typeof payload.age === 'number' ? payload.age : 18,
      bio: payload.bio || '',
      photos: payload.photos || [],
      interests: payload.interests || {},
      mode: payload.mode || 'normal',
      isOnline: true,
      lastSeen: new Date(),
    };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    await AsyncStorage.setItem('onboarding_complete', 'true');
    setUser(newUser);
    setHasCompletedOnboarding(true);
    return newUser;
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates } as User;
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.multiRemove(['user', 'onboarding_complete', 'introduction_seen', 'auth_session']);
    setUser(null);
    setHasCompletedOnboarding(false);
    setHasSeenIntroduction(false);
    setSession(null);
  };

  return {
    user,
    isLoading,
    session,
    hasCompletedOnboarding,
    hasSeenIntroduction,
    register,
    login,
    refresh,
    fetchProfile,
    createUser,
    updateUser,
    logout,
  };
});