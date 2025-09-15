import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Message, ChatInsight } from '@/types/user';

export const [ChatProvider, useChat] = createContextHook(() => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [lastActionTime, setLastActionTime] = useState<number>(Date.now());
  const [insights, setInsights] = useState<ChatInsight[]>([]);

  const startTyping = () => {
    setTypingStartTime(Date.now());
  };

  const sendMessage = (content: string, senderId: string) => {
    if (!currentChatId) return;

    const now = Date.now();
    const typingDuration = typingStartTime ? now - typingStartTime : 0;
    const pauseBeforeSend = now - lastActionTime;

    const message: Message = {
      id: Date.now().toString(),
      chatId: currentChatId,
      senderId,
      content,
      timestamp: new Date(),
      typingDuration,
      pauseBeforeSend,
    };

    setMessages(prev => [...prev, message]);
    setTypingStartTime(null);
    setLastActionTime(now);

    // Simulate AI analysis
    analyzeMessage(message);
  };

  const analyzeMessage = async (message: Message) => {
    // Simulate AI analysis of micro-interactions
    const engagementScore = Math.random() * 100;
    const emotionalTone = message.content.includes('!') || message.content.includes('😊') 
      ? 'positive' as const
      : message.content.includes('?') 
      ? 'neutral' as const 
      : 'negative' as const;

    // This would normally call the AI API
    console.log('Analyzing message:', {
      typingDuration: message.typingDuration,
      pauseBeforeSend: message.pauseBeforeSend,
      messageLength: message.content.length,
      engagementScore,
      emotionalTone,
    });
  };

  const generateDailyInsight = async (chatId: string): Promise<ChatInsight> => {
    const chatMessages = messages.filter(m => m.chatId === chatId);
    const avgResponseTime = chatMessages.reduce((acc, m) => acc + (m.pauseBeforeSend || 0), 0) / chatMessages.length;
    const avgMessageLength = chatMessages.reduce((acc, m) => acc + m.content.length, 0) / chatMessages.length;

    return {
      id: Date.now().toString(),
      chatId,
      date: new Date().toISOString().split('T')[0],
      engagementScore: Math.random() * 100,
      emotionalTone: 'positive',
      responseTime: avgResponseTime,
      messageLength: avgMessageLength,
      editFrequency: 0,
      compatibilityScore: Math.random() * 100,
      insights: [
        'You both respond quickly, showing high engagement',
        'Your conversation style is becoming more casual and comfortable',
        'Shared interests in travel are creating strong connection points',
      ],
    };
  };

  return {
    messages,
    currentChatId,
    insights,
    setCurrentChatId,
    startTyping,
    sendMessage,
    generateDailyInsight,
    setLastActionTime,
  };
});