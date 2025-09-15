import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Heart, Sparkles, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';

type ModeType = 'mystery' | 'normal' | null;

export default function ModeSelectionScreen() {
  const { createUser } = useAuth();
  const [selectedMode, setSelectedMode] = useState<ModeType>(null);

  const handleModeSelect = (mode: ModeType) => {
    setSelectedMode(mode);
  };

  const handleContinue = async () => {
    if (!selectedMode) return;

    await createUser({
      firstName: 'Demo User',
      nickname: 'SoulSeeker',
      photos: [],
      interests: {},
      mode: selectedMode,
      age: 22,
      bio: '',
    });

    router.replace('/(tabs)/home');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.surfaceVariant]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft color={Colors.text} size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Choose Your Journey</Text>
            <Text style={styles.subtitle}>How would you like to connect?</Text>
          </View>

          <View style={styles.modesContainer}>
            <TouchableOpacity
              style={[
                styles.modeCard,
                selectedMode === 'normal' && styles.selectedCard
              ]}
              onPress={() => handleModeSelect('normal')}
            >
              <LinearGradient
                colors={selectedMode === 'normal' ? [Colors.primary, Colors.secondary] : [Colors.surface, Colors.surface]}
                style={styles.cardGradient}
              >
                <View style={styles.modeIcon}>
                  <Eye color={selectedMode === 'normal' ? Colors.textOnPrimary : Colors.primary} size={48} />
                </View>
                
                <Text style={[
                  styles.modeTitle,
                  selectedMode === 'normal' && styles.selectedText
                ]}>
                  Normal Mode
                </Text>
                
                <Text style={[
                  styles.modeDescription,
                  selectedMode === 'normal' && styles.selectedDescriptionText
                ]}>
                  Browse profiles and swipe to connect. See photos and interests upfront.
                </Text>

                <View style={styles.features}>
                  <View style={styles.feature}>
                    <Eye 
                      color={selectedMode === 'normal' ? Colors.textOnPrimary : Colors.textSecondary} 
                      size={16} 
                    />
                    <Text style={[
                      styles.featureText,
                      selectedMode === 'normal' && styles.selectedText
                    ]}>
                      Profile browsing
                    </Text>
                  </View>
                  <View style={styles.feature}>
                    <Heart 
                      color={selectedMode === 'normal' ? Colors.textOnPrimary : Colors.textSecondary} 
                      size={16} 
                    />
                    <Text style={[
                      styles.featureText,
                      selectedMode === 'normal' && styles.selectedText
                    ]}>
                      Visual matching
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeCard,
                selectedMode === 'mystery' && styles.selectedCard
              ]}
              onPress={() => handleModeSelect('mystery')}
            >
              <LinearGradient
                colors={selectedMode === 'mystery' ? [Colors.primary, Colors.secondary] : [Colors.surface, Colors.surface]}
                style={styles.cardGradient}
              >
                <View style={styles.modeIcon}>
                  <EyeOff color={selectedMode === 'mystery' ? Colors.textOnPrimary : Colors.primary} size={48} />
                </View>
                
                <Text style={[
                  styles.modeTitle,
                  selectedMode === 'mystery' && styles.selectedText
                ]}>
                  Mystery Mode
                </Text>
                
                <Text style={[
                  styles.modeDescription,
                  selectedMode === 'mystery' && styles.selectedDescriptionText
                ]}>
                  Connect through anonymous conversations. Profiles are revealed only after mutual interest.
                </Text>

                <View style={styles.features}>
                  <View style={styles.feature}>
                    <Sparkles 
                      color={selectedMode === 'mystery' ? Colors.textOnPrimary : Colors.textSecondary} 
                      size={16} 
                    />
                    <Text style={[
                      styles.featureText,
                      selectedMode === 'mystery' && styles.selectedText
                    ]}>
                      Anonymous chats
                    </Text>
                  </View>
                  <View style={styles.feature}>
                    <Heart 
                      color={selectedMode === 'mystery' ? Colors.textOnPrimary : Colors.textSecondary} 
                      size={16} 
                    />
                    <Text style={[
                      styles.featureText,
                      selectedMode === 'mystery' && styles.selectedText
                    ]}>
                      Authentic connections
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.note}>
              💡 You can always change this later in your profile settings
            </Text>

            <TouchableOpacity
              style={[
                styles.continueButton,
                !selectedMode && styles.continueButtonDisabled
              ]}
              onPress={handleContinue}
              disabled={!selectedMode}
            >
              <Text style={styles.continueButtonText}>
                Start Your Journey
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
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  modesContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  modeCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  selectedCard: {
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  cardGradient: {
    padding: 24,
    minHeight: 200,
  },
  modeIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  selectedText: {
    color: Colors.textOnPrimary,
  },
  modeDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  selectedDescriptionText: {
    color: Colors.textOnPrimary,
    opacity: 0.9,
  },
  features: {
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bottomSection: {
    alignItems: 'center',
    paddingTop: 32,
  },
  note: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.textLight,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textOnPrimary,
  },
});