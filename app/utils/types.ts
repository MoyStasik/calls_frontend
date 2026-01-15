export interface User {
  id: string;
  nickname: string;
  avatar: string;
  status: string;
  isOnline: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
}

export interface Friend extends User {
  statusText: string;
}
