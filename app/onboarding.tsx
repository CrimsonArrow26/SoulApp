import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import GradientBackground from '@/components/GradientBackground';
import ModeCard from '@/components/ModeCard';
import { useAuth } from '@/hooks/auth-store';

export default function OnboardingScreen() {
  const [selectedMode, setSelectedMode] = useState<'mystery' | 'normal' | null>(null);
  const { createUser } = useAuth();

  const handleContinue = async () => {
    if (!selectedMode) return;

    // Create a demo user
    await createUser({
      name: 'Demo User',
      age: 25,
      bio: 'Looking for meaningful connections',
      photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'],
      interests: ['Travel', 'Photography', 'Music'],
      location: 'San Francisco, CA',
      mode: selectedMode,
    });

    router.replace('/(tabs)');
  };

  return (
    <GradientBackground colors={['#667eea', '#764ba2', '#f093fb']}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Your Journey</Text>
            <Text style={styles.subtitle}>
              How would you like to connect with others?
            </Text>
          </View>

          <View style={styles.modes}>
            <ModeCard
              mode="mystery"
              title="Mystery Mode"
              description="Connect through authentic conversations before seeing profiles"
              features={[
                'Anonymous random pairing',
                'Profiles revealed after mutual interest',
                'Focus on personality over appearance',
                'AI-powered compatibility insights'
              ]}
              onSelect={() => setSelectedMode('mystery')}
              isSelected={selectedMode === 'mystery'}
            />

            <ModeCard
              mode="normal"
              title="Normal Mode"
              description="Browse profiles and swipe to find your perfect match"
              features={[
                'Traditional profile browsing',
                'Swipe-based matching system',
                'See photos and bios upfront',
                'Advanced behavioral analytics'
              ]}
              onSelect={() => setSelectedMode('normal')}
              isSelected={selectedMode === 'normal'}
            />
          </View>

          <TouchableOpacity
            style={[styles.continueButton, !selectedMode && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!selectedMode}
          >
            <Text style={styles.continueButtonText}>
              {selectedMode ? `Continue with ${selectedMode === 'mystery' ? 'Mystery' : 'Normal'} Mode` : 'Select a Mode'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  modes: {
    padding: 24,
    paddingTop: 12,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 18,
    margin: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});