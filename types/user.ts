export interface User {
  id: string;
  firstName: string;
  nickname: string;
  age: number;
  bio: string;
  photos: string[];
  interests: { [key: string]: string };
  mode: 'mystery' | 'normal';
  isOnline: boolean;
  lastSeen: Date;
}

export interface Match {
  id: string;
  users: [string, string];
  status: 'pending' | 'accepted' | 'revealed' | 'active';
  createdAt: Date;
  revealedAt?: Date;
  chatId: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  readAt?: Date;
  editedAt?: Date;
  typingDuration?: number;
  pauseBeforeSend?: number;
}

export interface ChatInsight {
  id: string;
  chatId: string;
  date: string;
  engagementScore: number;
  emotionalTone: 'positive' | 'neutral' | 'negative';
  responseTime: number;
  messageLength: number;
  editFrequency: number;
  compatibilityScore: number;
  insights: string[];
}

export interface UserProfile {
  user: User;
  insights?: ChatInsight[];
  currentMatches: Match[];
}