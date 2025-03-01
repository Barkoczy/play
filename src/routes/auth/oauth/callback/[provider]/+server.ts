import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_AUTH_API_URL } from '$env/static/public';
import { NODE_ENV } from '$env/static/private';

// Handle OAuth callback
export const GET: RequestHandler = async ({ params, url, cookies }) => {
  // Get provider, code, and state from URL
  const provider = params.provider;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  // Validate provider
  if (!['google', 'discord', 'github'].includes(provider)) {
    throw error(400, { message: 'Invalid OAuth provider' });
  }
  
  // Validate code
  if (!code) {
    throw error(400, { message: 'No authorization code provided' });
  }
  
  // Validate state (usually done by comparing with a stored state)
  if (!state) {
    throw error(400, { message: 'No state parameter provided' });
  }
  
  try {
    // Forward the OAuth callback to the auth server
    const response = await fetch(
      `${PUBLIC_AUTH_API_URL || 'http://localhost:3000'}/auth/oauth/callback/${provider}?code=${code}&state=${state}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw error(response.status, { 
        message: errorData.error || 'OAuth authentication failed' 
      });
    }
    
    const data = await response.json();
    
    // If successful, set cookies from the response
    if (data.success && data.data) {
      // Set auth cookies if server didn't already set them
      if (data.data.accessToken) {
        cookies.set('auth_token', data.data.accessToken, {
          path: '/',
          httpOnly: true,
          secure: NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 1 day
        });
        
        if (data.data.refreshToken) {
          cookies.set('refresh_token', data.data.refreshToken, {
            path: '/',
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
        }
      }
      
      return json(data.data);
    }
    
    return json({ error: 'Authentication failed' }, { status: 400 });
  } catch (err) {
    console.error('OAuth callback error:', err);
    return json(
      { error: err instanceof Error ? err.message : 'Authentication failed' },
      { status: 500 }
    );
  }
};