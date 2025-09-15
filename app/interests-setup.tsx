import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Check, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { INTEREST_CARDS, InterestCard } from '@/constants/interests';
import ArtworkBackground from '@/components/ArtworkBackground';

export default function InterestsSetupScreen() {
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const currentCard = INTEREST_CARDS[currentCardIndex];
  const isLastCard = currentCardIndex === INTEREST_CARDS.length - 1;
  const hasResponse = responses[currentCard.id]?.trim().length > 0;

  // Multi-select options for specific cards (2nd and 4th)
  const MULTI_OPTIONS: { [index: number]: string[] } = {
    1: ['Movies', 'Art', 'Music', 'Theatre', 'Stand-up', 'Podcasts', 'Photography'],
    3: ['Trekking', 'Swimming', 'Sports', 'Gaming', 'Cooking', 'Reading', 'Travel']
  };
  const isMultiCard = currentCardIndex in MULTI_OPTIONS;

  const handleNext = () => {
    if (!hasResponse) {
      Alert.alert('Response Required', 'Please complete this card before continuing');
      return;
    }

    if (isLastCard) {
      router.push('/mode-selection');
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const updateResponse = (cardId: string, text: string) => {
    setResponses(prev => ({ ...prev, [cardId]: text }));
  };

  const toggleMultiOption = (cardIndex: number, option: string) => {
    const cardId = INTEREST_CARDS[cardIndex].id;
    const current = responses[cardId]?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const exists = current.includes(option);
    const next = exists ? current.filter(o => o !== option) : [...current, option];
    setResponses(prev => ({ ...prev, [cardId]: next.join(', ') }));
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
            <Text style={styles.title}>Soul Cards Template</Text>
            <Text style={styles.subtitle}>Share your authentic self</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${((currentCardIndex + 1) / INTEREST_CARDS.length) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {currentCardIndex + 1} of {INTEREST_CARDS.length}
              </Text>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <ArtworkBackground style={styles.cardArtwork} />
              <View style={styles.cardHeader}>
                <Text style={styles.cardNumber}>{currentCardIndex + 1}</Text>
                <Text style={styles.cardTitle}>{currentCard.title}</Text>
              </View>

              <View style={styles.promptContainer}>
                <Text style={styles.promptIcon}>👉</Text>
                <Text style={styles.promptText}>"{currentCard.prompt}"</Text>
              </View>

              {isMultiCard ? (
                <View style={styles.chipsWrap}>
                  {MULTI_OPTIONS[currentCardIndex].map((opt) => {
                    const selected = (responses[currentCard.id] || '')
                      .split(',')
                      .map(s => s.trim())
                      .filter(Boolean)
                      .includes(opt);
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.chip, selected && styles.chipSelected]}
                        onPress={() => toggleMultiOption(currentCardIndex, opt)}
                      >
                        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <>
                  <TextInput
                    style={styles.responseInput}
                    value={responses[currentCard.id] || ''}
                    onChangeText={(text) => updateResponse(currentCard.id, text)}
                    placeholder="Share your thoughts..."
                    placeholderTextColor={Colors.textLight}
                    multiline
                    maxLength={200}
                    textAlignVertical="top"
                  />
                  <Text style={styles.characterCount}>
                    {(responses[currentCard.id] || '').length}/200
                  </Text>
                </>
              )}
            </View>
          </View>

          <View style={styles.navigationContainer}>
            {currentCardIndex > 0 && (
              <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
                <Text style={styles.previousButtonText}>Previous</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.nextButton, !hasResponse && styles.nextButtonDisabled]} 
              onPress={handleNext}
              disabled={!hasResponse}
            >
              {hasResponse && <Check color={Colors.textOnPrimary} size={20} />}
              <Text style={styles.nextButtonText}>
                {isLastCard ? 'Complete' : 'Next Card'}
              </Text>
              {!isLastCard && <ArrowRight color={Colors.textOnPrimary} size={20} />}
            </TouchableOpacity>
          </View>

          <View style={styles.cardPreview}>
            <Text style={styles.previewTitle}>Your Cards:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {INTEREST_CARDS.map((card, index) => (
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.miniCard,
                    index === currentCardIndex && styles.activeMiniCard,
                    responses[card.id] && styles.completedMiniCard
                  ]}
                  onPress={() => setCurrentCardIndex(index)}
                >
                  <Text style={styles.miniCardLabel}>{index + 1}</Text>
                  {responses[card.id] && (
                    <View style={styles.completedIndicator}>
                      <Check color={Colors.textOnPrimary} size={12} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    marginBottom: 24,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  cardArtwork: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.07,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cardNumber: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.textSecondary,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  promptContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  promptIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  promptText: {
    fontSize: 16,
    color: Colors.text,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 24,
  },
  responseInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
    minHeight: 120,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.text,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: Colors.primary,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'right',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 24,
  },
  previousButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  previousButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 140,
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: Colors.textLight,
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textOnPrimary,
    marginHorizontal: 8,
  },
  cardPreview: {
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  miniCard: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  activeMiniCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  completedMiniCard: {
    backgroundColor: Colors.primary,
  },
  miniCardLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  completedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});