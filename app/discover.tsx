import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Heart, X, Eye, Sparkles, MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/auth-store';
import GradientBackground from '@/components/GradientBackground';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  const demoProfiles = [
    {
      id: '1',
      name: 'Mystery Person',
      age: '?',
      bio: 'Let\'s get to know each other through conversation first...',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      isRevealed: false,
    },
    {
      id: '2',
      name: 'Sarah',
      age: 26,
      bio: 'Love hiking, photography, and good coffee. Looking for genuine connections.',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      isRevealed: true,
    },
  ];

  const currentProfile = demoProfiles[currentIndex];
  const isMysteryMode = user?.mode === 'mystery';

  const handlePass = () => {
    if (currentIndex < demoProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.back();
    }
  };

  const handleLike = () => {
    // In mystery mode, this would start an anonymous chat
    // In normal mode, this would create a match if mutual
    router.push('/chats');
  };

  if (!currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Sparkles color="#9ca3af" size={48} />
          <Text style={styles.emptyTitle}>No more profiles</Text>
          <Text style={styles.emptySubtitle}>Check back later for new connections!</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X color="#1f2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isMysteryMode ? 'Mystery Mode' : 'Discover'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {isMysteryMode && !currentProfile.isRevealed ? (
            <GradientBackground 
              colors={['#667eea', '#764ba2']}
              style={styles.mysteryCard}
            >
              <Eye color="white" size={48} />
              <Text style={styles.mysteryTitle}>Mystery Match</Text>
              <Text style={styles.mysterySubtitle}>
                Start chatting to reveal profiles
              </Text>
            </GradientBackground>
          ) : (
            <>
              <Image
                source={{ uri: currentProfile.photo }}
                style={styles.profileImage}
                contentFit="cover"
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {currentProfile.name}, {currentProfile.age}
                </Text>
                <Text style={styles.profileBio}>{currentProfile.bio}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <X color="#f87171" size={32} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          {isMysteryMode ? (
            <MessageCircle color="white" size={32} />
          ) : (
            <Heart color="white" size={32} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.instruction}>
        {isMysteryMode 
          ? 'Tap 💬 to start an anonymous conversation'
          : 'Tap ❤️ to like, ✕ to pass'
        }
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: width - 48,
    height: width * 1.2,
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  mysteryCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  mysteryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  mysterySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  profileImage: {
    width: '100%',
    height: '70%',
  },
  profileInfo: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingVertical: 32,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#f87171',
  },
  likeButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  instruction: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});