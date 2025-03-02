import { browser } from '$app/environment';
import { authStore, getTokens, storeTokens, clearTokens } from './store';
import { AuthApi } from './api';
import type { UserProfile, LoginCredentials, RegisterCredentials, UpdateProfileData } from './types';

/**
 * Initialize the auth session
 * Checks for existing tokens and tries to fetch the user profile
 */
/**
 * Authentication service to handle all auth-related operations
 */
export const AuthService = {
  /**
   * Login a user with email and password
   */
  async login(credentials: LoginCredentials): Promise<UserProfile | null> {
    authStore.setLoading(true);
    
    try {
      const response = await AuthApi.login(credentials);
      
      if (response.success && response.data) {
        // Store tokens
        storeTokens(response.data);
        
        // Get user profile
        const profileResponse = await AuthApi.getProfile(response.data.accessToken);
        
        if (profileResponse.success && profileResponse.data) {
          authStore.setUser(profileResponse.data);
          return profileResponse.data;
        } else {
          throw new Error(profileResponse.error || 'Failed to get user profile');
        }
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      authStore.setError(error instanceof Error ? error.message : 'Login failed');
      return null;
    } finally {
      authStore.setLoading(false);
    }
  },
  
  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<UserProfile | null> {
    authStore.setLoading(true);
    
    try {
      const response = await AuthApi.register(credentials);
      
      if (response.success && response.data) {
        // Store tokens
        storeTokens(response.data);
        
        // Get user profile
        const profileResponse = await AuthApi.getProfile(response.data.accessToken);
        
        if (profileResponse.success && profileResponse.data) {
          authStore.setUser(profileResponse.data);
          return profileResponse.data;
        } else {
          throw new Error(profileResponse.error || 'Failed to get user profile');
        }
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      authStore.setError(error instanceof Error ? error.message : 'Registration failed');
      return null;
    } finally {
      authStore.setLoading(false);
    }
  },
  
  /**
   * Logout the current user
   */
  async logout(): Promise<boolean> {
    authStore.setLoading(true);
    
    try {
      const { accessToken } = getTokens();
      await AuthApi.logout(accessToken);
      
      // Clear local auth state regardless of API response
      authStore.clearUser();
      clearTokens();
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear local auth state on error
      authStore.clearUser();
      clearTokens();
      
      return true;
    } finally {
      authStore.setLoading(false);
    }
  },
  
  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile | null> {
    authStore.setLoading(true);
    
    try {
      const { accessToken } = getTokens();
      const response = await AuthApi.updateProfile(data, accessToken);
      
      if (response.success && response.data) {
        authStore.setUser(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      authStore.setError(error instanceof Error ? error.message : 'Failed to update profile');
      return null;
    } finally {
      authStore.setLoading(false);
    }
  },
  
  /**
   * Initiate OAuth login flow
   */
  async startOAuthLogin(provider: 'google' | 'discord' | 'github'): Promise<string | null> {
    try {
      const response = await AuthApi.getOAuthUrl(provider);
      
      if (response.success && response.data) {
        return response.data.url;
      } else {
        throw new Error(response.error || `Failed to start ${provider} login`);
      }
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      authStore.setError(error instanceof Error ? error.message : `Failed to start ${provider} login`);
      return null;
    }
  },
  
  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<boolean> {
    try {
      const { refreshToken } = getTokens();
      
      if (!refreshToken) {
        return false;
      }
      
      const response = await AuthApi.refreshToken(refreshToken);
      
      if (response.success && response.data) {
        storeTokens(response.data);
        
        // Get user profile with new token
        const profileResponse = await AuthApi.getProfile(response.data.accessToken);
        
        if (profileResponse.success && profileResponse.data) {
          authStore.setUser(profileResponse.data);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Session refresh error:', error);
      return false;
    }
  },
  
  /**
   * Get the current user's profile
   */
  async getProfile(): Promise<UserProfile | null> {
    try {
      const { accessToken } = getTokens();
      
      if (!accessToken) {
        return null;
      }
      
      const response = await AuthApi.getProfile(accessToken);
      
      if (response.success && response.data) {
        // Update stored user data
        authStore.setUser(response.data);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  },
};

/**
 * Initialize the auth session
 * Checks for existing tokens and tries to fetch the user profile
 */
export async function initAuthSession(): Promise<void> {
  if (!browser) return;
  
  // Set loading state
  authStore.setLoading(true);
  
  try {
    // Check for existing tokens
    const { accessToken, refreshToken } = getTokens();
    
    if (!accessToken) {
      authStore.clearUser();
      return;
    }
    
    // Try to get user profile with existing token
    const response = await AuthApi.getProfile(accessToken);
    
    if (response.success && response.data) {
      // User is authenticated
      authStore.setUser(response.data);
    } else if (refreshToken) {
      // Try to refresh token
      const refreshResponse = await AuthApi.refreshToken(refreshToken);
      
      if (refreshResponse.success && refreshResponse.data) {
        // Store new tokens
        storeTokens(refreshResponse.data);
        
        // Get user profile with new token
        const profileResponse = await AuthApi.getProfile(refreshResponse.data.accessToken);
        
        if (profileResponse.success && profileResponse.data) {
          authStore.setUser(profileResponse.data);
        } else {
          // Failed to get profile even with new token
          authStore.clearUser();
          clearTokens();
        }
      } else {
        // Failed to refresh token
        authStore.clearUser();
        clearTokens();
      }
    } else {
      // No refresh token available
      authStore.clearUser();
      clearTokens();
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
    authStore.setError(error instanceof Error ? error.message : 'Authentication failed');
    clearTokens();
  } finally {
    authStore.setLoading(false);
  }
}