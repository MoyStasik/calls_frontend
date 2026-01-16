import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock API
jest.mock('../utils/api', () => ({
  api: {
    getToken: jest.fn(),
    getProfile: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    updateProfile: jest.fn(),
    setToken: jest.fn(),
    clearToken: jest.fn(),
  },
}));

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isLoading, login, register, logout, updateUser } = useAuth();

  return (
    <div>
      <div data-testid="user">{user?.nickname || 'No user'}</div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not loading'}</div>
      <button data-testid="login-btn" onClick={() => login('test@example.com', 'password')}>Login</button>
      <button data-testid="register-btn" onClick={() => register({ nickname: 'Test', login: 'test@example.com', password: '123', confirmPassword: '123' })}>Register</button>
      <button data-testid="logout-btn" onClick={() => logout()}>Logout</button>
      <button data-testid="update-btn" onClick={() => updateUser({ nickname: 'Updated' })}>Update</button>
    </div>
  );
};

describe('AuthContext', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage mock
    (window.localStorage.getItem as jest.Mock).mockClear();
    (window.localStorage.setItem as jest.Mock).mockClear();
    (window.localStorage.removeItem as jest.Mock).mockClear();
    (window.localStorage.clear as jest.Mock).mockClear();
  });

  it('should provide auth context to children', async () => {
    // Mock API responses
    (api.getToken as jest.Mock).mockReturnValue(null);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
  });

  it('should load user profile when token exists', async () => {
    const mockUser = {
      id: '1',
      nickname: 'Test User',
      login: 'test@example.com',
      avatar: '/avatars/default.png',
      status: 'Online',
      isOnline: true,
    };

    // Mock API responses
    (api.getToken as jest.Mock).mockReturnValue('mock-token');
    (api.getProfile as jest.Mock).mockResolvedValue(mockUser);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
    });

    // Check that user was loaded
    expect(api.getProfile).toHaveBeenCalled();
  });

  it('should handle login', async () => {
    const mockUser = {
      id: '1',
      nickname: 'Test User',
      login: 'test@example.com',
      avatar: '/avatars/default.png',
      status: 'Online',
      isOnline: true,
    };

    // Mock API responses
    (api.getToken as jest.Mock).mockReturnValue(null);
    (api.login as jest.Mock).mockResolvedValue({ token: 'new-token', user: mockUser });

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Click login button
    const loginButton = screen.getByTestId('login-btn');
    await act(async () => {
      loginButton.click();
    });

    // Verify API was called
    expect(api.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should handle register', async () => {
    const mockUser = {
      id: '1',
      nickname: 'Test User',
      login: 'test@example.com',
      avatar: '/avatars/default.png',
      status: 'Online',
      isOnline: true,
    };

    // Mock API responses
    (api.getToken as jest.Mock).mockReturnValue(null);
    (api.register as jest.Mock).mockResolvedValue({ token: 'new-token', user: mockUser });

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Click register button
    const registerButton = screen.getByTestId('register-btn');
    await act(async () => {
      registerButton.click();
    });

    // Verify API was called
    expect(api.register).toHaveBeenCalledWith({
      nickname: 'Test',
      login: 'test@example.com',
      password: '123',
      confirmPassword: '123',
    });
  });
});

// Import api after jest.mock to get the mocked version
const { api } = require('../utils/api');
