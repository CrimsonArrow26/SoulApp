import { LinearGradient } from 'expo-linear-gradient';
import { EyeOff, Heart, Sparkles } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModeCardProps {
  mode: 'mystery' | 'normal';
  title: string;
  description: string;
  features: string[];
  onSelect: () => void;
  isSelected: boolean;
}

export default function ModeCard({ 
  mode, 
  title, 
  description, 
  features, 
  onSelect, 
  isSelected 
}: ModeCardProps) {
  const gradientColors = mode === 'mystery' 
    ? ['#667eea', '#764ba2'] as const
    : ['#f093fb', '#f5576c'] as const;

  const Icon = mode === 'mystery' ? EyeOff : Heart;

  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selected]} 
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Icon color="white" size={32} />
            <Sparkles color="white" size={20} style={styles.sparkle} />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          
          <View style={styles.features}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.bullet} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  selected: {
    transform: [{ scale: 1.02 }],
  },
  gradient: {
    padding: 24,
    minHeight: 200,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sparkle: {
    marginLeft: 8,
    opacity: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    lineHeight: 22,
  },
  features: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
});