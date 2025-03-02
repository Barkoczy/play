/* eslint-disable @typescript-eslint/no-namespace */
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { AuthApi } from '$lib/auth/api';
import { SecureTokenStorage } from './lib/auth/secureTokenStorage';
import { PUBLIC_AUTH_API_URL } from '$env/static/public';

const API_URL = PUBLIC_AUTH_API_URL || '';

/**
 * Auth hook to handle server-side authentication
 * Validates tokens and sets user data in locals for server routes
 */
const authHook: Handle = async ({ event, resolve }) => {
	// Get access token from cookies or headers
	const accessToken =
		SecureTokenStorage.getToken('accessToken') ||
		event.request.headers.get('Authorization')?.replace('Bearer ', '');

	if (accessToken) {
		try {
			// Validate token with auth server
			const response = await AuthApi.validateToken(accessToken);

			if (response.success && response.data?.valid) {
				// Set user data in locals for server routes
				event.locals.user = {
					id: response.data.userId!,
					email: response.data.email!,
					name: response.data.name!,
					isVerified: response.data.verified!
				};
				event.locals.isAuthenticated = true;
			}
		} catch (error) {
			console.error('Token validation error:', error);
		}
	}

	// Set default values if not authenticated
	if (!event.locals.user) {
		event.locals.user = null;
		event.locals.isAuthenticated = false;
	}

	return resolve(event);
};

/**
 * Security headers hook
 */
const securityHook: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Add security headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	// Permissive Content-Security-Policy for development
	// In production, this should be more restrictive
	response.headers.set(
		'Content-Security-Policy',
		`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ${API_URL}`
	);

	return response;
};

// Export the combined hooks
export const handle = sequence(authHook, securityHook);

// Type declarations for locals
declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				email: string;
				name: string;
				isVerified: boolean;
			} | null;
			isAuthenticated: boolean;
		}
	}
}
