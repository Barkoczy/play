import type {
	LoginCredentials,
	RegisterCredentials,
	UpdateProfileData,
	UserProfile,
	AuthTokens,
	ApiResponse,
	Session
} from './types';
import { PUBLIC_AUTH_API_URL } from '$env/static/public';

const API_URL = PUBLIC_AUTH_API_URL || 'http://localhost:3000';

/**
 * Helper function to handle API responses
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
	const contentType = response.headers.get('content-type');
	if (contentType && contentType.includes('application/json')) {
		const data = await response.json();
		return data as ApiResponse<T>;
	}

	throw new Error('Unexpected response format');
}

/**
 * Configure fetch options with authentication
 */
function getAuthOptions(method: string, body?: unknown, token?: string | null): RequestInit {
	const options: RequestInit = {
		method,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	if (body) {
		options.body = JSON.stringify(body);
	}

	if (token) {
		options.headers = {
			...options.headers,
			Authorization: `Bearer ${token}`
		};
	}

	return options;
}

/**
 * Auth API client
 */
export const AuthApi = {
	/**
	 * Register a new user
	 */
	async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthTokens>> {
		const response = await fetch(`${API_URL}/auth/register`, getAuthOptions('POST', credentials));
		return handleResponse<AuthTokens>(response);
	},

	/**
	 * Login a user
	 */
	async login(credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> {
		const response = await fetch(`${API_URL}/auth/login`, getAuthOptions('POST', credentials));
		return handleResponse<AuthTokens>(response);
	},

	/**
	 * Logout the current user
	 */
	async logout(token?: string | null): Promise<ApiResponse<void>> {
		const response = await fetch(
			`${API_URL}/auth/logout`,
			getAuthOptions('POST', undefined, token)
		);
		return handleResponse<void>(response);
	},

	/**
	 * Refresh the access token
	 */
	async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
		const response = await fetch(
			`${API_URL}/auth/refresh-token`,
			getAuthOptions('POST', { refreshToken })
		);
		return handleResponse<AuthTokens>(response);
	},

	/**
	 * Get the current user's profile
	 */
	async getProfile(token?: string | null): Promise<ApiResponse<UserProfile>> {
		const response = await fetch(
			`${API_URL}/auth/profile`,
			getAuthOptions('GET', undefined, token)
		);
		return handleResponse<UserProfile>(response);
	},

	/**
	 * Update the current user's profile
	 */
	async updateProfile(
		data: UpdateProfileData,
		token?: string | null
	): Promise<ApiResponse<UserProfile>> {
		const response = await fetch(`${API_URL}/auth/profile`, getAuthOptions('PUT', data, token));
		return handleResponse<UserProfile>(response);
	},

	/**
	 * Get all active sessions for the current user
	 */
	async getSessions(token?: string | null): Promise<ApiResponse<Session[]>> {
		const response = await fetch(
			`${API_URL}/auth/sessions`,
			getAuthOptions('GET', undefined, token)
		);
		return handleResponse<Session[]>(response);
	},

	/**
	 * Revoke a specific session
	 */
	async revokeSession(sessionId: string, token?: string | null): Promise<ApiResponse<void>> {
		const response = await fetch(
			`${API_URL}/auth/sessions/${sessionId}`,
			getAuthOptions('DELETE', undefined, token)
		);
		return handleResponse<void>(response);
	},

	/**
	 * Revoke all other sessions except the current one
	 */
	async revokeOtherSessions(token?: string | null): Promise<ApiResponse<void>> {
		const response = await fetch(
			`${API_URL}/auth/sessions`,
			getAuthOptions('DELETE', undefined, token)
		);
		return handleResponse<void>(response);
	},

	/**
	 * Get OAuth authorization URL
	 */
	async getOAuthUrl(
		provider: 'google' | 'discord' | 'github'
	): Promise<ApiResponse<{ url: string }>> {
		const response = await fetch(`${API_URL}/auth/oauth/${provider}`, getAuthOptions('GET'));
		return handleResponse<{ url: string }>(response);
	},

	/**
	 * Unlink an OAuth provider
	 */
	async unlinkProvider(
		provider: 'google' | 'discord' | 'github',
		token?: string | null
	): Promise<ApiResponse<void>> {
		const response = await fetch(
			`${API_URL}/auth/oauth/unlink/${provider}`,
			getAuthOptions('DELETE', undefined, token)
		);
		return handleResponse<void>(response);
	},

	/**
	 * Check if a token is valid
	 */
	async validateToken(token: string): Promise<
		ApiResponse<{
			valid: boolean;
			userId?: string;
			email?: string;
			name?: string;
			verified?: boolean;
		}>
	> {
		const response = await fetch(
			`${API_URL}/auth/validate`,
			getAuthOptions('GET', undefined, token)
		);
		return handleResponse<{
			valid: boolean;
			userId?: string;
			email?: string;
			name?: string;
			verified?: boolean;
		}>(response);
	}
};
