const API_URL = 'http://localhost:4000';

export interface User {
  id: string;
  nickname: string;
  login: string;
  avatar: string;
  status: string;
  isOnline: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  unreadCount: number;
  lastMessageTime: string;
  participants: string[];
  type: 'direct' | 'group';
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  sender?: {
    id: string;
    nickname: string;
    avatar: string;
  };
}

export interface Friend {
  id: string;
  nickname: string;
  avatar: string;
  status: string;
  statusText: string;
  isOnline: boolean;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Ошибка запроса: ${response.status}`);
    }

    return response?.json();
  }

  // Auth endpoints
  async login(login: string, password: string) {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    });
  }

  async register(data: {
    nickname: string;
    login: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.clearToken();
    }
  }

  async getProfile() {
    return this.request<User>('/auth/me');
  }

  // Users endpoints
  async updateProfile(data: { nickname?: string; status?: string; avatar?: string }) {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async searchUsers(query: string) {
    return this.request<User[]>('/users/search', {
      method: 'GET',
    });
  }

  // Chats endpoints
  async getUserChats() {
    return this.request<Chat[]>('/chats/my');
  }

  async getChatMessages(chatId: string, page = 1, limit = 50) {
    return this.request<{
      messages: Message[];
      total: number;
      page: number;
      limit: number;
      hasMore: boolean;
    }>(`/chats/${chatId}/messages?page=${page}&limit=${limit}`);
  }

  async sendMessage(chatId: string, text: string) {
    return this.request<Message>(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async createChat(data: { name?: string; avatar?: string; participantIds: string[]; type?: 'direct' | 'group' }) {
    return this.request<Chat>('/chats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Friends endpoints
  async getUserFriends() {
    return this.request<Friend[]>('/friends/my');
  }

  async addFriend(friendId: string) {
    return this.request<{ success: boolean }>(`/friends/${friendId}`, {
      method: 'POST',
    });
  }

  async removeFriend(friendId: string) {
    return this.request<{ success: boolean }>(`/friends/${friendId}`, {
      method: 'DELETE',
    });
  }

  async searchFriends(query: string): Promise<Friend[]> {
    return this.request<Friend[]>(`/friends/search?q=${encodeURIComponent(query)}`);
  }
}

export const api = new ApiService();
