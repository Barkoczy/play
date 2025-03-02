import { NODE_ENV, CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_AUTH_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createHmacSignature } from '$lib/utils/crypto';

// Handle OAuth callback
export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
	// Clear existing tokens
	cookies.delete('auth_token', { path: '/' });

	// Check for success and key parameters
	const success = url.searchParams.get('success');
	const error_message = url.searchParams.get('error_message');
	const key = url.searchParams.get('key');

	// Validate input parameters
	if (!success) {
		return redirect(303, `/auth/error?message=No state parameter provided`);
	}

	if (!key) {
		return redirect(303, `/auth/error?message=No key parameter provided`);
	}

	// Check for unsuccessful authentication
	if (success === 'false') {
		const message = error_message || 'Authentication failed';
		return redirect(303, `/auth/error?message=${encodeURIComponent(message)}`);
	}

	// Exchange the key for the token_hash
	const response = await fetch(`${PUBLIC_AUTH_API_URL}/auth/exchange-token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			key,
			clientKey: CLIENT_SECRET
		})
	});

	if (!response.ok) {
		const responseData = await response.json();
		return redirect(
			303,
			`/auth/error?message=${encodeURIComponent(responseData.error || 'Failed to exchange token')}`
		);
	}

	const result = await response.json();

	if (!result.success || !result.data.token_hash) {
		return redirect(303, `/auth/error?message=Invalid token response`);
	}

	// Process the token_hash
	const [dataBase64, signature] = result.data.token_hash.split('.');
	const decodedData = JSON.parse(atob(dataBase64));

	// Verify signature
	const expectedSignature = createHmacSignature(JSON.stringify(decodedData), CLIENT_SECRET);

	// If the signatures do not match, the token is invalid
	if (signature !== expectedSignature) {
		return redirect(303, `/auth/error?message=Invalid signature`);
	}

	// Store tokens in cookies
	if (decodedData.accessToken) {
		cookies.set('auth_token', decodedData.accessToken, {
			path: '/',
			httpOnly: true,
			secure: NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24, // 1 day
		});
	}

	// Redirect based on whether it's a new user or not
	const redirectUrl = decodedData.isNewUser ? '/onboarding' : '/protected';

	return redirect(303, redirectUrl);
};
