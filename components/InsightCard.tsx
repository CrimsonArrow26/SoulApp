import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Heart, MessageCircle, Clock } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { ChatInsight } from '@/types/user';

interface InsightCardProps {
  insight: ChatInsight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4ade80';
    if (score >= 60) return '#fbbf24';
    return '#f87171';
  };

  const getToneIcon = () => {
    switch (insight.emotionalTone) {
      case 'positive':
        return <Heart color="#4ade80" size={20} />;
      case 'neutral':
        return <MessageCircle color="#fbbf24" size={20} />;
      case 'negative':
        return <TrendingUp color="#f87171" size={20} />;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.date}>{new Date(insight.date).toLocaleDateString()}</Text>
          <View style={styles.scores}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Engagement</Text>
              <Text style={[styles.scoreValue, { color: getScoreColor(insight.engagementScore) }]}>
                {Math.round(insight.engagementScore)}%
              </Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Compatibility</Text>
              <Text style={[styles.scoreValue, { color: getScoreColor(insight.compatibilityScore) }]}>
                {Math.round(insight.compatibilityScore)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Clock color="#6b7280" size={16} />
            <Text style={styles.metricText}>
              {Math.round(insight.responseTime / 1000)}s avg response
            </Text>
          </View>
          <View style={styles.metric}>
            {getToneIcon()}
            <Text style={styles.metricText}>
              {insight.emotionalTone} tone
            </Text>
          </View>
        </View>

        <View style={styles.insights}>
          <Text style={styles.insightsTitle}>Key Insights</Text>
          {insight.insights.map((item, index) => (
            <View key={index} style={styles.insightItem}>
              <View style={styles.insightBullet} />
              <Text style={styles.insightText}>{item}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  scores: {
    flexDirection: 'row',
    gap: 16,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metrics: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 14,
    color: '#6b7280',
  },
  insights: {
    gap: 8,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  insightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667eea',
    marginTop: 6,
  },
  insightText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
    lineHeight: 20,
  },
});