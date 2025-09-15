import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { MessageCircle, Send, BarChart3 } from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-store';
import { useChat } from '@/hooks/chat-store';
import { router } from 'expo-router';

export default function ChatsScreen() {
  const { user } = useAuth();
  const { messages, sendMessage, startTyping, currentChatId, setCurrentChatId } = useChat();
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!messageText.trim() || !user) return;
    
    sendMessage(messageText.trim(), user.id);
    setMessageText('');
    setIsTyping(false);
  };

  const handleTyping = (text: string) => {
    setMessageText(text);
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      startTyping();
    }
  };

  // Demo chat setup
  useEffect(() => {
    if (!currentChatId) {
      setCurrentChatId('demo-chat-1');
    }
  }, [currentChatId, setCurrentChatId]);

  const chatMessages = messages.filter(m => m.chatId === currentChatId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.mode === 'mystery' ? '🎭' : '💖'}
            </Text>
          </View>
          <View>
            <Text style={styles.chatName}>
              {user?.mode === 'mystery' ? 'Mystery Match' : 'Sarah'}
            </Text>
            <Text style={styles.chatStatus}>Online now</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.insightsButton}
          onPress={() => router.push('/insights')}
        >
          <BarChart3 color="#667eea" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {chatMessages.length === 0 && (
          <View style={styles.emptyState}>
            <MessageCircle color="#9ca3af" size={48} />
            <Text style={styles.emptyTitle}>Start the conversation!</Text>
            <Text style={styles.emptySubtitle}>
              {user?.mode === 'mystery' 
                ? 'Your profiles will be revealed once you both show interest'
                : 'Say hello and see where the conversation goes'
              }
            </Text>
          </View>
        )}

        {chatMessages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.senderId === user?.id ? styles.myMessage : styles.theirMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.senderId === user?.id ? styles.myMessageText : styles.theirMessageText
            ]}>
              {message.content}
            </Text>
            <Text style={styles.messageTime}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={messageText}
          onChangeText={handleTyping}
          placeholder="Type a message..."
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Send color="white" size={20} />
        </TouchableOpacity>
      </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  chatStatus: {
    fontSize: 12,
    color: '#10b981',
  },
  insightsButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    padding: 12,
    borderRadius: 16,
  },
  myMessageText: {
    backgroundColor: '#667eea',
    color: 'white',
  },
  theirMessageText: {
    backgroundColor: 'white',
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});