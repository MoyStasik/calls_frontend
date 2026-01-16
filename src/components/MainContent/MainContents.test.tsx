import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import MainContent from './MainContent';

// Mock the API
jest.mock('../../utils/api', () => ({
  api: {
    getUserFriends: jest.fn(),
    searchFriends: jest.fn(),
    addFriend: jest.fn(),
  },
}));

const mockFriends = [
  {
    id: '1',
    nickname: 'Andy Cartwright',
    avatar: '/avatars/andy.png',
    status: 'В пути',
    statusText: 'В пути',
    isOnline: true,
  },
];

const mockSearchResults = [
  {
    id: '3',
    nickname: 'Новый друг',
    avatar: '/avatars/default.png',
    status: 'Онлайн',
    isOnline: true,
  },
];

describe('MainContent Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the main content with correct elements', async () => {
    // Сначала настраиваем mock
    (api.getUserFriends as jest.Mock).mockResolvedValue(mockFriends);

    await act(async () => {
      render(<MainContent />);
    });

    // Wait for friends to load
    await waitFor(() => {
      expect(screen.getByText('АлёГараж')).toBeInTheDocument();
    });

    // Check main elements
    expect(screen.getByText('AG')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Поиск друзей...')).toBeInTheDocument();
    expect(screen.getByText('Создать чат')).toBeInTheDocument();
  });

  it('should load and display friends list', async () => {
    (api.getUserFriends as jest.Mock).mockResolvedValue(mockFriends);

    await act(async () => {
      render(<MainContent />);
    });

    // Wait for friends to load
    await waitFor(() => {
      expect(screen.getByText('Andy Cartwright')).toBeInTheDocument();
    });

    expect(screen.getByText('Ваши друзья')).toBeInTheDocument();
    expect(screen.getByText('Всего друзей: 1')).toBeInTheDocument();
  });

  it('should search for friends when typing in search field', async () => {
    (api.getUserFriends as jest.Mock).mockResolvedValue(mockFriends);
    (api.searchFriends as jest.Mock).mockResolvedValue(mockSearchResults);

    await act(async () => {
      render(<MainContent />);
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Andy Cartwright')).toBeInTheDocument();
    });

    // Type in search field
    const searchInput = screen.getByPlaceholderText('Поиск друзей...');

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Новый' } });
    });

    // Wait for search to complete
    await waitFor(() => {
      expect(api.searchFriends).toHaveBeenCalledWith('Новый');
    }, { timeout: 1000 });
  });

  it('should handle adding a friend', async () => {
    (api.getUserFriends as jest.Mock).mockResolvedValue(mockFriends);
    (api.searchFriends as jest.Mock).mockResolvedValue(mockSearchResults);
    (api.addFriend as jest.Mock).mockResolvedValue({ success: true });

    await act(async () => {
      render(<MainContent />);
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Andy Cartwright')).toBeInTheDocument();
    });

    // Type in search field
    const searchInput = screen.getByPlaceholderText('Поиск друзей...');

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Новый' } });
    });

    // Wait for search results
    await waitFor(() => {
      expect(api.searchFriends).toHaveBeenCalled();
    });

    // Add friend button should appear for search results
    await waitFor(() => {
      expect(screen.getByText('Добавить')).toBeInTheDocument();
    });

    // Click add friend button
    const addButton = screen.getByText('Добавить');

    await act(async () => {
      fireEvent.click(addButton);
    });

    // Verify addFriend was called
    expect(api.addFriend).toHaveBeenCalledWith('3');
  });

  it('should display status codes correctly', async () => {
    (api.getUserFriends as jest.Mock).mockResolvedValue(mockFriends);

    await act(async () => {
      render(<MainContent />);
    });

    // Wait for friends to load
    await waitFor(() => {
      expect(screen.getByText('Andy Cartwright')).toBeInTheDocument();
    });

    // Check status codes are displayed
    expect(screen.getByText('gps')).toBeInTheDocument();
  });
});

// Mock API reference
const { api } = require('../../utils/api');
