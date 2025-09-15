import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  Dimensions, 
  PanResponder, 
  Animated, 
  TouchableOpacity,
  Image,
  ScrollView,
  Platform
} from 'react-native';
import { Heart, X, MessageCircle, Sparkles, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-store';
import { Colors } from '@/constants/colors';
import { DEMO_SOUL_CARDS, SoulCard } from '@/mocks/soulCards';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ArtworkBackground from '@/components/ArtworkBackground';

const raw = Dimensions.get('window');
const MAX_MOBILE_WIDTH = 430;
const screenWidth = Math.min(raw.width, MAX_MOBILE_WIDTH);
const screenHeight = raw.height;
const CARD_WIDTH = screenWidth - 40;
const CARD_HEIGHT = Math.min(screenHeight * 0.7, CARD_WIDTH * 1.5);

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [cards] = useState<SoulCard[]>(DEMO_SOUL_CARDS);
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  if (!user) return null;

  const isMysteryMode = user.mode === 'mystery';

  const resetPosition = () => {
    position.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    opacity.setValue(1);
  };

  const swipeCard = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? screenWidth : -screenWidth;
    
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      })
    ]).start(() => {
      setCurrentCardIndex(prev => prev + 1);
      resetPosition();
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
      rotate.setValue(gesture.dx * 0.1);
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        swipeCard('right');
      } else if (gesture.dx < -120) {
        swipeCard('left');
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        Animated.spring(rotate, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const startMysteryChat = () => {
    const mysteryCards = cards.filter(card => card.mode === 'mystery');
    if (mysteryCards.length > 0) {
      const randomCard = mysteryCards[Math.floor(Math.random() * mysteryCards.length)];
      router.push(`/(tabs)/chats?mysteryId=${randomCard.id}`);
    }
  };

  if (isMysteryMode) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[Colors.background, Colors.surfaceVariant]}
          style={styles.mysteryContainer}
        >
          <View style={styles.mysteryHeader}>
            <EyeOff color={Colors.primary} size={48} />
            <Text style={styles.mysteryTitle}>Mystery Mode</Text>
            <Text style={styles.mysterySubtitle}>
              Connect with someone anonymously
            </Text>
          </View>

          <View style={styles.mysteryCard}>
            <Sparkles color={Colors.primary} size={32} />
            <Text style={styles.mysteryCardTitle}>Ready for a Mystery?</Text>
            <Text style={styles.mysteryCardText}>
              We'll connect you with someone special. Your profiles will remain hidden until you both decide to reveal them.
            </Text>
            
            <TouchableOpacity 
              style={styles.startChatButton}
              onPress={startMysteryChat}
            >
              <MessageCircle color="white" size={20} />
              <Text style={styles.startChatText}>Start Mystery Chat</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mysteryFeatures}>
            <View style={styles.feature}>
              <Eye color={Colors.textSecondary} size={16} />
              <Text style={styles.featureText}>Anonymous conversations</Text>
            </View>
            <View style={styles.feature}>
              <Heart color={Colors.textSecondary} size={16} />
              <Text style={styles.featureText}>Authentic connections</Text>
            </View>
            <View style={styles.feature}>
              <Sparkles color={Colors.textSecondary} size={16} />
              <Text style={styles.featureText}>Mutual reveal system</Text>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const currentCard = cards[currentCardIndex];
  const nextCard = cards[currentCardIndex + 1];

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noMoreCards}>
          <Heart color={Colors.primary} size={64} />
          <Text style={styles.noMoreCardsTitle}>No More Soul Cards</Text>
          <Text style={styles.noMoreCardsText}>
            You've seen all available cards. Check back later for new connections!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const rotateCard = rotate.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Soul Cards</Text>
        <Text style={styles.subtitle}>Discover your perfect match</Text>
      </View>

      <View style={styles.cardContainer}>
        {nextCard && (
          <View style={[styles.card, styles.nextCard]}>
            <Image source={{ uri: nextCard.photos[0] }} style={styles.cardImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.cardOverlay}
            >
              <Text style={styles.cardName}>{nextCard.nickname}</Text>
              <Text style={styles.cardAge}>{nextCard.age} years old</Text>
            </LinearGradient>
          </View>
        )}

        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotateCard },
              ],
              opacity,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Image source={{ uri: currentCard.photos[0] }} style={styles.cardImage} />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.cardOverlay}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{currentCard.nickname}</Text>
              <Text style={styles.cardAge}>{currentCard.age} years old</Text>
              {currentCard.distance && (
                <Text style={styles.cardDistance}>{currentCard.distance} km away</Text>
              )}
            </View>
          </LinearGradient>

          <View style={styles.interestsContainer}>
            <ArtworkBackground style={styles.artworkBackground} />
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.entries(currentCard.interests).map(([category, answer]) => (
                <View key={category} style={styles.interestCard}>
                  <Text style={styles.interestCategory}>{category}</Text>
                  <Text style={styles.interestAnswer}>{answer}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </Animated.View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => swipeCard('left')}
        >
          <X color="white" size={32} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => swipeCard('right')}
        >
          <Heart color="white" size={32} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  nextCard: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  cardImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  cardInfo: {
    marginBottom: 10,
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cardAge: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  cardDistance: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  interestsContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  interestCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  artworkBackground: {
    opacity: 0.3,
  },
  interestCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 6,
  },
  interestAnswer: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 40,
    gap: 40,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  rejectButton: {
    backgroundColor: Colors.error,
  },
  likeButton: {
    backgroundColor: Colors.primary,
  },
  noMoreCards: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noMoreCardsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  noMoreCardsText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  mysteryContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  mysteryHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mysteryTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  mysterySubtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  mysteryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  mysteryCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  mysteryCardText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  startChatButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    gap: 8,
  },
  startChatText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  mysteryFeatures: {
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});