import { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { TrendingUp, Heart, MessageCircle, Clock } from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-store';
import { useChat } from '@/hooks/chat-store';
import InsightCard from '@/components/InsightCard';
import { ChatInsight } from '@/types/user';
import { Colors } from '@/constants/colors';

export default function InsightsScreen() {
  const { user } = useAuth();
  const { generateDailyInsight, currentChatId } = useChat();
  const [insights, setInsights] = useState<ChatInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    if (!currentChatId) return;
    
    try {
      // Generate demo insights
      const demoInsights: ChatInsight[] = [
        {
          id: '1',
          chatId: currentChatId,
          date: new Date().toISOString(),
          engagementScore: 87,
          emotionalTone: 'positive',
          responseTime: 2500,
          messageLength: 45,
          editFrequency: 0.1,
          compatibilityScore: 92,
          insights: [
            'You both respond quickly, showing high engagement',
            'Your conversation style is becoming more casual and comfortable',
            'Shared interests in travel are creating strong connection points',
          ],
        },
        {
          id: '2',
          chatId: currentChatId,
          date: new Date(Date.now() - 86400000).toISOString(),
          engagementScore: 73,
          emotionalTone: 'positive',
          responseTime: 3200,
          messageLength: 38,
          editFrequency: 0.2,
          compatibilityScore: 85,
          insights: [
            'Your response times are getting faster as you get more comfortable',
            'Both of you use similar humor styles',
            'Questions about future plans show mutual interest',
          ],
        },
      ];
      
      setInsights(demoInsights);
    } catch (error) {
      console.log('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const overallScore = insights.length > 0 
    ? Math.round(insights.reduce((acc, insight) => acc + insight.compatibilityScore, 0) / insights.length)
    : 0;

  const kpis = useMemo(() => {
    if (insights.length === 0) return null;
    const avg = (key: keyof ChatInsight) => {
      const vals = insights.map(i => i[key] as unknown as number);
      const sum = vals.reduce((a, b) => a + b, 0);
      return Math.round(sum / vals.length);
    };
    return {
      engagementScore: avg('engagementScore'),
      messageLength: avg('messageLength'),
      responseTime: avg('responseTime'),
    };
  }, [insights]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Insights</Text>
          <Text style={styles.subtitle}>AI-powered analysis of your conversations</Text>
        </View>

        <View style={styles.overallScore}>
          <View style={styles.scoreRing}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{overallScore}%</Text>
              <Text style={styles.scoreLabel}>Overall Compatibility</Text>
            </View>
          </View>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <TrendingUp color={Colors.success} size={18} />
              <Text style={styles.kpiTitle}>Engagement</Text>
              <Text style={styles.kpiValue}>{kpis ? kpis.engagementScore : 0}</Text>
            </View>
            <View style={styles.kpiCard}>
              <MessageCircle color={Colors.primary} size={18} />
              <Text style={styles.kpiTitle}>Msg length</Text>
              <Text style={styles.kpiValue}>{kpis ? kpis.messageLength : 0}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Clock color={Colors.warning} size={18} />
              <Text style={styles.kpiTitle}>Resp. time</Text>
              <Text style={styles.kpiValue}>{kpis ? `${kpis.responseTime}ms` : '0ms'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Daily Reports</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Analyzing your conversations...</Text>
            </View>
          ) : insights.length > 0 ? (
            insights.map((insight) => (
              <View key={insight.id} style={styles.insightWrapper}>
                <InsightCard insight={insight} />
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Clock color="#9ca3af" size={48} />
              <Text style={styles.emptyTitle}>No insights yet</Text>
              <Text style={styles.emptySubtitle}>
                Start chatting to see AI-powered insights about your conversations
              </Text>
            </View>
          )}
        </View>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            🔒 Your privacy is protected. All analysis is done locally and anonymously.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  overallScore: {
    backgroundColor: Colors.surface,
    margin: 24,
    marginTop: 8,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  scoreRing: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: Colors.primaryLight,
    marginBottom: 16,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  kpiTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  insightsSection: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  insightWrapper: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 12,
  },
  privacyNote: {
    margin: 24,
    padding: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  privacyText: {
    fontSize: 14,
    color: '#059669',
    textAlign: 'center',
    lineHeight: 20,
  },
});