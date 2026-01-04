export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}