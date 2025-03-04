/* eslint-disable @typescript-eslint/no-namespace */
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { allowedUrls, securityConfig } from '$lib/conf/securityConfig';
import { AuthApi } from '$lib/auth/api';
import { getTokens } from '$lib/auth/store';

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
    response.headers.set('X-Frame-Options', securityConfig.frameOptions);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', securityConfig.referrerPolicy);
   
    // Join allowed URLs
    const allowedUrlsString = allowedUrls.join(' ');
   
    // Set Content-Security-Policy based on mode
    if (securityConfig.cspMode === 'strict') {
        // Strict CSP for production, ale s povolením inlinových štýlov a skriptov
        response.headers.set(
            'Content-Security-Policy',
            `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; style-src-attr 'unsafe-inline'; img-src 'self' data: ${allowedUrlsString}; connect-src 'self' ${allowedUrlsString}; media-src 'self' ${allowedUrlsString}`
        );
    } else {
        // Permissive CSP for development (nezmenené)
        response.headers.set(
            'Content-Security-Policy',
            `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; style-src-attr 'unsafe-inline'; img-src 'self' data: ${allowedUrlsString}; connect-src 'self' ${allowedUrlsString}; media-src 'self' ${allowedUrlsString}`
        );
    }
   
    return response;
};

/**
 * SEO optimization hook
 */
const seoHook: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.endsWith('/') && event.url.pathname !== '/') {
        return new Response(null, {
            status: 301,
            headers: {
                location: event.url.pathname.slice(0, -1) + event.url.search
            }
        });
    }
    
    if (event.url.pathname.startsWith('/watch/')) {
        event.setHeaders({
            'Cache-Control': 'public, max-age=60, s-maxage=60'
        });
    }
    
    return resolve(event);
};

// Export the combined hooks
export const handle = sequence(authHook, securityHook, seoHook);

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
