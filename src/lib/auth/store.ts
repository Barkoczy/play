import { writable, derived } from 'svelte/store';
import type { UserProfile } from './types';
import { browser } from '$app/environment';

// Define initial state
type AuthState = {
	user: UserProfile | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
};

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: true,
	error: null
};

// Create the store
function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,

		// Set authenticated user
		setUser: (user: UserProfile) => {
			update((state) => ({
				...state,
				user,
				isAuthenticated: true,
				isLoading: false,
				error: null
			}));
		},

		// Clear authentication state
		clearUser: () => {
			update((state) => ({
				...state,
				user: null,
				isAuthenticated: false,
				isLoading: false
			}));
		},

		// Set loading state
		setLoading: (isLoading: boolean) => {
			update((state) => ({ ...state, isLoading }));
		},

		// Set error state
		setError: (error: string | null) => {
			update((state) => ({ ...state, error, isLoading: false }));
		},

		// Reset to initial state
		reset: () => {
			set(initialState);
		}
	};
}

// Create the auth store
export const authStore = createAuthStore();

// Derived stores for convenience
export const user = derived(authStore, ($authStore) => $authStore.user);
export const isAuthenticated = derived(authStore, ($authStore) => $authStore.isAuthenticated);
export const isLoading = derived(authStore, ($authStore) => $authStore.isLoading);
export const authError = derived(authStore, ($authStore) => $authStore.error);

// Helper function to persist tokens in localStorage if needed
export const storeTokens = (tokens: { accessToken: string; refreshToken?: string }) => {
	if (browser) {
		if (tokens.accessToken) {
			localStorage.setItem('accessToken', tokens.accessToken);
		}
		if (tokens.refreshToken) {
			localStorage.setItem('refreshToken', tokens.refreshToken);
		}
	}
};

// Helper function to clear tokens from localStorage
export const clearTokens = () => {
	if (browser) {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
	}
};

// Helper function to get tokens from localStorage
export const getTokens = () => {
	if (browser) {
		return {
			accessToken: localStorage.getItem('accessToken'),
			refreshToken: localStorage.getItem('refreshToken')
		};
	}
	return {
		accessToken: null,
		refreshToken: null
	};
};
