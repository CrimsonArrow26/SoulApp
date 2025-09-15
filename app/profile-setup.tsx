import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Upload, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ProfileData {
  firstName: string;
  nickname: string;
  photos: string[];
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
}

function getEighteenYearsAgoISO(): string {
  const now = new Date();
  const max = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
  return max.toISOString().slice(0, 10);
}

function isUnder18(isoDate: string): boolean {
  if (!isoDate) return true;
  const dob = new Date(isoDate + 'T00:00:00');
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  // If dob is after cutoff, user is under 18
  return dob > cutoff;
}

export default function ProfileSetupScreen() {
  const { createUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    nickname: '',
    photos: [],
    dateOfBirth: '',
    gender: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [isDobFocused, setIsDobFocused] = useState(false);
  const dobInputRef = useRef<HTMLInputElement | null>(null);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhotos = [result.assets[0].uri, ...profileData.photos.slice(1)];
      setProfileData(prev => ({ ...prev, photos: newPhotos }));
    }
  };

  const handleUploadPhoto = async (index: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Photo library permission is required to upload photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhotos = [...profileData.photos];
      newPhotos[index] = result.assets[0].uri;
      setProfileData(prev => ({ ...prev, photos: newPhotos }));
    }
  };

  const handleNext = () => {
    if (!profileData.firstName.trim() || !profileData.nickname.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    if (profileData.photos.length === 0) {
      Alert.alert('Photo Required', 'Please add at least one photo');
      return;
    }

    // Simple DOB check (YYYY-MM-DD)
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(profileData.dateOfBirth.trim())) {
      Alert.alert('Invalid Date of Birth', 'Use format YYYY-MM-DD');
      return;
    }

    if (isUnder18(profileData.dateOfBirth.trim())) {
      Alert.alert('Age restriction', 'You must be at least 18 years old to continue');
      return;
    }

    if (!profileData.gender) {
      Alert.alert('Missing Information', 'Please select your gender');
      return;
    }

    router.push('/interests-setup');
  };

  const handleBack = () => {
    router.back();
  };

  const maxDobIso = getEighteenYearsAgoISO();
  const maxDobDate = new Date(maxDobIso + 'T00:00:00');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.surfaceVariant]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <ArrowLeft color={Colors.text} size={24} />
              </TouchableOpacity>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>Let's get to know you better</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.firstName}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, firstName: text }))}
                  placeholder="Enter your full name"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nickname *</Text>
                <Text style={styles.helperText}>This will be displayed in Mystery Mode</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.nickname}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, nickname: text }))}
                  placeholder="Choose a unique nickname"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth *</Text>
                {Platform.OS === 'web' ? (
                  <View
                    // @ts-ignore web-only onClick to focus hidden input
                    onClick={() => {
                      if (dobInputRef.current) dobInputRef.current.showPicker?.();
                      if (dobInputRef.current) dobInputRef.current.focus();
                    }}
                    style={[
                      styles.input,
                      { borderColor: isDobFocused ? Colors.primary : Colors.border, paddingVertical: 0, height: 48 },
                      { justifyContent: 'center' }
                    ]}
                  >
                    <Text style={profileData.dateOfBirth ? styles.dateText : styles.datePlaceholder}>
                      {profileData.dateOfBirth || 'Select your date of birth'}
                    </Text>
                    {/* Full-size invisible input to capture clicks and open native picker */}
                    {/* @ts-ignore web element */}
                    <input
                      ref={dobInputRef as any}
                      type="date"
                      value={profileData.dateOfBirth}
                      max={maxDobIso}
                      onChange={(e: any) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, dateOfBirth: value }));
                        setDobDate(value ? new Date(value) : null);
                      }}
                      onFocus={() => setIsDobFocused(true)}
                      onBlur={() => setIsDobFocused(false)}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                    />
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.input}
                      onPress={() => setShowDatePicker(true)}
                      activeOpacity={0.7}
                    >
                      <Text style={profileData.dateOfBirth ? styles.dateText : styles.datePlaceholder}>
                        {profileData.dateOfBirth || 'Select your date of birth'}
                      </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={dobDate || new Date(2000, 0, 1)}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        maximumDate={maxDobDate}
                        onChange={(event: any, selectedDate?: Date) => {
                          // On Android, user can cancel (selectedDate undefined)
                          if (Platform.OS !== 'ios') {
                            setShowDatePicker(false);
                          }
                          if (selectedDate) {
                            setDobDate(selectedDate);
                            const iso = selectedDate.toISOString().slice(0, 10);
                            setProfileData(prev => ({ ...prev, dateOfBirth: iso }));
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender *</Text>
                <View style={styles.genderRow}>
                  <TouchableOpacity
                    style={[styles.genderOption, profileData.gender === 'male' && styles.genderOptionSelected]}
                    onPress={() => setProfileData(prev => ({ ...prev, gender: 'male' }))}
                  >
                    <Text style={[styles.genderText, profileData.gender === 'male' && styles.genderTextSelected]}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.genderOption, profileData.gender === 'female' && styles.genderOptionSelected]}
                    onPress={() => setProfileData(prev => ({ ...prev, gender: 'female' }))}
                  >
                    <Text style={[styles.genderText, profileData.gender === 'female' && styles.genderTextSelected]}>Female</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.genderOption, profileData.gender === 'other' && styles.genderOptionSelected]}
                    onPress={() => setProfileData(prev => ({ ...prev, gender: 'other' }))}
                  >
                    <Text style={[styles.genderText, profileData.gender === 'other' && styles.genderTextSelected]}>Other</Text>
                  </TouchableOpacity>
                </View>
              </View>



              <View style={styles.photoSection}>
                <Text style={styles.label}>Photos (4 required)</Text>
                <Text style={styles.helperText}>First photo will be taken with camera, others can be uploaded</Text>
                
                <View style={styles.photoGrid}>
                  <TouchableOpacity
                    style={[styles.photoSlot, styles.cameraSlot]}
                    onPress={handleTakePhoto}
                  >
                    {profileData.photos[0] ? (
                      <View style={styles.photoPreview}>
                        <Text style={styles.photoText}>Camera Photo</Text>
                      </View>
                    ) : (
                      <>
                        <Camera color={Colors.primary} size={32} />
                        <Text style={styles.photoSlotText}>Take Photo</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {[1, 2, 3].map((index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.photoSlot}
                      onPress={() => handleUploadPhoto(index)}
                    >
                      {profileData.photos[index] ? (
                        <View style={styles.photoPreview}>
                          <Text style={styles.photoText}>Photo {index + 1}</Text>
                        </View>
                      ) : (
                        <>
                          <Upload color={Colors.textSecondary} size={24} />
                          <Text style={styles.photoSlotText}>Upload</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Continue</Text>
              <ArrowRight color={Colors.textOnPrimary} size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  datePlaceholder: {
    fontSize: 16,
    color: Colors.textLight,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  genderOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  genderText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  genderTextSelected: {
    color: Colors.primary,
  },
  photoSection: {
    marginTop: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  photoSlot: {
    width: '48%',
    aspectRatio: 3/4,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: Colors.surface,
  },
  cameraSlot: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  photoSlotText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  photoPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 16,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textOnPrimary,
    marginRight: 8,
  },
});