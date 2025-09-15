import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Polygon, Ellipse } from 'react-native-svg';
import { Colors } from '@/constants/colors';

interface ArtworkBackgroundProps {
  style?: any;
}

export default function ArtworkBackground({ style }: ArtworkBackgroundProps) {
  return (
    <View style={[styles.container, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 400" style={StyleSheet.absoluteFillObject}>
        {/* Paper airplane */}
        <Polygon
          points="120,80 180,100 120,120 140,100"
          fill="none"
          stroke={Colors.primary}
          strokeWidth="2"
          opacity={0.6}
        />
        <Path
          d="M120 80 L180 100 L120 120 L140 100 Z"
          fill={Colors.primaryLight}
          opacity={0.3}
        />
        
        {/* Notebook/Paper */}
        <Path
          d="M200 150 L320 150 L320 280 L200 280 Z"
          fill="white"
          stroke={Colors.text}
          strokeWidth="2"
          opacity={0.8}
        />
        <Path d="M220 170 L300 170" stroke={Colors.textLight} strokeWidth="1" opacity={0.5} />
        <Path d="M220 190 L300 190" stroke={Colors.textLight} strokeWidth="1" opacity={0.5} />
        <Path d="M220 210 L300 210" stroke={Colors.textLight} strokeWidth="1" opacity={0.5} />
        <Path d="M220 230 L300 230" stroke={Colors.textLight} strokeWidth="1" opacity={0.5} />
        <Path d="M220 250 L300 250" stroke={Colors.textLight} strokeWidth="1" opacity={0.5} />
        
        {/* Geometric shapes */}
        <Circle cx="350" cy="80" r="4" fill={Colors.secondary} opacity={0.7} />
        <Circle cx="80" cy="200" r="6" fill={Colors.primary} opacity={0.5} />
        <Circle cx="320" cy="320" r="3" fill={Colors.accent} opacity={0.6} />
        
        {/* Diamond shapes */}
        <Polygon
          points="370,120 380,130 370,140 360,130"
          fill="none"
          stroke={Colors.secondary}
          strokeWidth="2"
          opacity={0.6}
        />
        <Polygon
          points="50,350 60,360 50,370 40,360"
          fill={Colors.primaryLight}
          opacity={0.4}
        />
        
        {/* Abstract triangular shapes */}
        <Polygon
          points="80,300 120,320 100,360"
          fill={Colors.surfaceVariant}
          stroke={Colors.primary}
          strokeWidth="2"
          opacity={0.5}
        />
        <Polygon
          points="280,300 320,280 340,320"
          fill={Colors.accent}
          opacity={0.4}
        />
        
        {/* Dashed circles */}
        <Circle
          cx="150"
          cy="250"
          r="40"
          fill="none"
          stroke={Colors.textSecondary}
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity={0.4}
        />
        
        {/* Heart shape */}
        <Path
          d="M300,50 C290,40 270,40 260,50 C250,40 230,40 220,50 C220,65 260,90 260,90 C260,90 300,65 300,50 Z"
          fill={Colors.primary}
          opacity={0.3}
        />
        
        {/* Dots pattern */}
        <Circle cx="60" cy="60" r="2" fill={Colors.textSecondary} opacity={0.4} />
        <Circle cx="80" cy="50" r="2" fill={Colors.textSecondary} opacity={0.4} />
        <Circle cx="100" cy="40" r="2" fill={Colors.textSecondary} opacity={0.4} />
        
        {/* Large background shapes */}
        <Ellipse
          cx="100"
          cy="300"
          rx="80"
          ry="60"
          fill={Colors.primaryLight}
          opacity={0.2}
        />
        <Ellipse
          cx="320"
          cy="200"
          rx="70"
          ry="90"
          fill={Colors.accent}
          opacity={0.2}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
});