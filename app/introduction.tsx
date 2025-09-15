import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Sparkles, Users, Shield } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';



const features = [
  {
    icon: Heart,
    title: 'Authentic Connections',
    description: 'Connect with souls, not just profiles'
  },
  {
    icon: Sparkles,
    title: 'Mystery Mode',
    description: 'Anonymous conversations until mutual interest'
  },
  {
    icon: Users,
    title: 'AI Insights',
    description: 'Daily compatibility and engagement reports'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data and conversations stay secure'
  }
];

export default function IntroductionScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/profile-setup');
    }
  };

  const handleSkip = () => {
    router.push('/profile-setup');
  };

  const currentFeature = features[currentStep];
  const IconComponent = currentFeature.icon;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.appName}>Soul Signal</Text>
            <Text style={styles.tagline}>Where Hearts Connect</Text>
          </View>

          <View style={styles.featureContainer}>
            <View style={styles.iconContainer}>
              <IconComponent color={Colors.textOnPrimary} size={80} />
            </View>
            
            <Text style={styles.featureTitle}>{currentFeature.title}</Text>
            <Text style={styles.featureDescription}>{currentFeature.description}</Text>
          </View>

          <View style={styles.pagination}>
            {features.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep && styles.activeDot
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>
                {currentStep === features.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: Colors.textOnPrimary,
    opacity: 0.9,
    textAlign: 'center',
  },
  featureContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  featureTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  featureDescription: {
    fontSize: 16,
    color: Colors.textOnPrimary,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.textOnPrimary,
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    color: Colors.textOnPrimary,
    opacity: 0.8,
  },
  nextButton: {
    backgroundColor: Colors.textOnPrimary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});