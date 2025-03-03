/* eslint-disable @typescript-eslint/no-namespace */
import { PUBLIC_AUTH_API_URL } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { AuthApi } from '$lib/auth/api';
import { getTokens } from '$lib/auth/store';

const API_URL = PUBLIC_AUTH_API_URL || '';

/**
 * Auth hook to handle server-side authentication
 * Validates tokens and sets user data in locals for server routes
 */
const authHook: Handle = async ({ event, resolve }) => {
	// Get access token from cookies or headers
	const { accessToken } = getTokens(event.cookies);
	const headerToken = event.request.headers.get('Authorization')?.replace('Bearer ', '');
	const token = accessToken || headerToken;

	if (token) {
		try {
			// Validate token with auth server
			const response = await AuthApi.validateToken(token);

			if (response.success && response.valid && response.data?.userId) {
				// Set user data in locals for server routes
				event.locals.user = {
					userId: response.data.userId!,
					email: response.data.email!,
					fullName: response.data.fullName!,
					isVerified: response.data.isVerified!
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

	// Array of allowed URLs
	const allowedUrls = [
		API_URL,
		'https://stream.homelab.quickbiteschronicles.com',
		'https://placehold.co'
	];

	// Permissive Content-Security-Policy for development
	// In production, this should be more restrictive
	response.headers.set(
        'Content-Security-Policy',
        `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: ${allowedUrls.join(' ')}; connect-src 'self' ${allowedUrls.join(' ')}`
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
				userId: string;
				email: string;
				fullName: string;
				isVerified: boolean;
			} | null;
			isAuthenticated: boolean;
		}
	}
}
