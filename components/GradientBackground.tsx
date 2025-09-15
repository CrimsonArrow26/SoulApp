import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

interface GradientBackgroundProps {
  children: ReactNode;
  colors?: readonly [string, string, ...string[]];
  style?: any;
}

export default function GradientBackground({ 
  children, 
  colors = ['#667eea', '#764ba2'] as const,
  style 
}: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={colors}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});