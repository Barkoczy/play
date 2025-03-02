import { browser } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';
import { writable, derived } from 'svelte/store';
import type { UserProfile } from './types';

// Cookie configuration
const COOKIE_CONFIG = {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 1 day in seconds
} as const;

// Cookie names
const COOKIE_NAMES = {
    accessToken: 'auth_token',
    refreshToken: 'refresh_token'
};

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

// Helper function to persist tokens using cookies
export const storeTokens = (tokens: { accessToken: string; refreshToken?: string }, cookies?: Cookies) => {
    if (browser && !cookies) {
        // Client-side storage using document.cookie
        if (tokens.accessToken) {
            const secureFlag = window.location.protocol === 'https:' ? 'Secure;' : '';
            document.cookie = `${COOKIE_NAMES.accessToken}=${encodeURIComponent(
                tokens.accessToken
            )};Path=/;${secureFlag}SameSite=Lax;Max-Age=${COOKIE_CONFIG.maxAge}`;
        }
        
        if (tokens.refreshToken) {
            const secureFlag = window.location.protocol === 'https:' ? 'Secure;' : '';
            document.cookie = `${COOKIE_NAMES.refreshToken}=${encodeURIComponent(
                tokens.refreshToken
            )};Path=/;${secureFlag}SameSite=Lax;Max-Age=${COOKIE_CONFIG.maxAge}`;
        }
    } else if (cookies) {
        // Server-side storage using SvelteKit cookies
        if (tokens.accessToken) {
            cookies.set(COOKIE_NAMES.accessToken, tokens.accessToken, COOKIE_CONFIG);
        }
        
        if (tokens.refreshToken) {
            cookies.set(COOKIE_NAMES.refreshToken, tokens.refreshToken, COOKIE_CONFIG);
        }
    }
};

// Helper function to clear tokens using cookies
export const clearTokens = (cookies?: Cookies) => {
    if (browser && !cookies) {
        // Client-side
        document.cookie = `${COOKIE_NAMES.accessToken}=;Path=/;Max-Age=0`;
        document.cookie = `${COOKIE_NAMES.refreshToken}=;Path=/;Max-Age=0`;
    } else if (cookies) {
        // Server-side
        cookies.delete(COOKIE_NAMES.accessToken, { path: '/' });
        cookies.delete(COOKIE_NAMES.refreshToken, { path: '/' });
    }
};

// Helper function to get tokens from cookies
export const getTokens = (cookies?: Cookies) => {
    if (browser && !cookies) {
        // Client-side
        const getCookieValue = (name: string) => {
            const value = document.cookie
                .split('; ')
                .find(row => row.startsWith(`${name}=`))
                ?.split('=')[1];
            return value ? decodeURIComponent(value) : null;
        };
        
        return {
            accessToken: getCookieValue(COOKIE_NAMES.accessToken),
            refreshToken: getCookieValue(COOKIE_NAMES.refreshToken)
        };
    } else if (cookies) {
        // Server-side
        return {
            accessToken: cookies.get(COOKIE_NAMES.accessToken) || null,
            refreshToken: cookies.get(COOKIE_NAMES.refreshToken) || null
        };
    }
    
    return { accessToken: null, refreshToken: null };
};
