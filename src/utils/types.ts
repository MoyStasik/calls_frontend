// utils/types.ts
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  status: string;
  isOnline: boolean;
  login?: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  unreadCount: number;
  lastMessageTime: string;
  participants: string[];
  type?: 'direct' | 'group';
}

export interface Friend {
  id: string;
  nickname: string;
  avatar: string;
  status: string;
  statusText: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  readBy?: string[];
  sender?: {
    id: string;
    nickname: string;
    avatar: string;
  };
}
