import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import LeftSidebar from './LeftSidebar';

// Mock hooks and API
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../utils/api', () => ({
  api: {
    getUserChats: jest.fn(),
  },
}));

const mockUser = {
  id: '1',
  nickname: 'Стас',
  login: 'test@example.com',
  avatar: '/avatars/default.png',
  status: 'В сети',
  isOnline: true,
};

const mockChats = [
  {
    id: '1',
    name: 'Андрей Картрайт',
    avatar: '/avatars/andy.png',
    lastMessage: 'Привет! Как дела?',
    unreadCount: 3,
    lastMessageTime: '10:30',
  },
];

describe('LeftSidebar Component', () => {
  const mockOnProfileClick = jest.fn();
  const mockOnHomeClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('should render user profile information', async () => {
    (api.getUserChats as jest.Mock).mockResolvedValue(mockChats);

    await act(async () => {
      render(<LeftSidebar onProfileClick={mockOnProfileClick} onHomeClick={mockOnHomeClick} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Стас')).toBeInTheDocument();
      expect(screen.getByText('В сети')).toBeInTheDocument();
    });
  });

  it('should load and display chats', async () => {
    (api.getUserChats as jest.Mock).mockResolvedValue(mockChats);

    await act(async () => {
      render(<LeftSidebar onProfileClick={mockOnProfileClick} onHomeClick={mockOnHomeClick} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Андрей Картрайт')).toBeInTheDocument();
    });

    expect(screen.getByText('Привет! Как дела?')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should handle profile click', async () => {
    (api.getUserChats as jest.Mock).mockResolvedValue(mockChats);

    await act(async () => {
      render(<LeftSidebar onProfileClick={mockOnProfileClick} onHomeClick={mockOnHomeClick} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Стас')).toBeInTheDocument();
    });

    const profileSection = screen.getByText('Стас').closest('.userProfile');

    await act(async () => {
      fireEvent.click(profileSection!);
    });

    expect(mockOnProfileClick).toHaveBeenCalled();
  });

  it('should show loading when chats are loading', () => {
    (api.getUserChats as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<LeftSidebar onProfileClick={mockOnProfileClick} onHomeClick={mockOnHomeClick} />);

    expect(screen.getByText('Загрузка чатов...')).toBeInTheDocument();
  });
});

// Mock references
const { useAuth } = require('../../contexts/AuthContext');
const { api } = require('../../utils/api');
