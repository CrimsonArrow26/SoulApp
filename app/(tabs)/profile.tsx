import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { Edit3, MapPin, Heart, Settings, LogOut, Camera, Star } from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-store';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleSettings = () => {
    console.log('Settings');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No user data found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleSettings}>
              <Settings color="#667eea" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
              <LogOut color="#ef4444" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            {user.photos && user.photos.length > 0 ? (
              <Image source={{ uri: user.photos[0] }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.placeholderPhoto}>
                <Camera color="#9ca3af" size={48} />
              </View>
            )}
            <TouchableOpacity style={styles.editPhotoButton}>
              <Edit3 color="white" size={16} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.firstName}</Text>
          <Text style={styles.userAge}>{user.age} years old</Text>
          <View style={styles.locationContainer}>
            <MapPin color="#6b7280" size={16} />
            <Text style={styles.locationText}>Location not set</Text>
          </View>
        </View>

        {/* Mode Badge */}
        <View style={styles.modeSection}>
          <View style={[styles.modeBadge, user.mode === 'mystery' ? styles.mysteryBadge : styles.normalBadge]}>
            <Text style={styles.modeIcon}>{user.mode === 'mystery' ? '🎭' : '💖'}</Text>
            <Text style={styles.modeText}>
              {user.mode === 'mystery' ? 'Mystery Mode' : 'Normal Mode'}
            </Text>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <Edit3 color="#667eea" size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.bioText}>{user.bio || 'No bio added yet'}</Text>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <Edit3 color="#667eea" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.interestsContainer}>
            {user.interests && Object.keys(user.interests).length > 0 ? (
              Object.entries(user.interests).map(([key, value], index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{value}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyInterests}>No interests added yet</Text>
            )}
          </View>
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <Edit3 color="#667eea" size={20} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
            {user.photos && user.photos.length > 0 ? (
              user.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.photoThumbnail} />
              ))
            ) : (
              <View style={styles.addPhotoPlaceholder}>
                <Camera color="#9ca3af" size={32} />
                <Text style={styles.addPhotoText}>Add photos</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Heart color="#ef4444" size={24} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statItem}>
              <Star color="#f59e0b" size={24} />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>85%</Text>
              <Text style={styles.statLabel}>Compatibility</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit3 color="white" size={20} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  photoSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userAge: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
  },
  modeSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  mysteryBadge: {
    backgroundColor: '#f3e8ff',
  },
  normalBadge: {
    backgroundColor: '#fef3f2',
  },
  modeIcon: {
    fontSize: 16,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    color: '#374151',
  },
  emptyInterests: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  photosScroll: {
    marginTop: 8,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  addPhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionSection: {
    padding: 16,
    paddingBottom: 32,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});