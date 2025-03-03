import { PUBLIC_AUTH_API_URL } from '$env/static/public';

/**
 * List of URLs allowed in security policies
 * This centralizes allowed external domains for easier management
 */
export const allowedUrls = [
    PUBLIC_AUTH_API_URL,
    'https://stream.homelab.quickbiteschronicles.com',
    'https://cdn.homelab.quickbiteschronicles.com',
    'https://placehold.co'
];

/**
 * Additional security configuration options
 */
export const securityConfig = {
    // Content Security Policy mode - 'strict' for production, 'permissive' for development
    cspMode: import.meta.env.PROD ? 'strict' : 'permissive',
    
    // Frame options - 'DENY', 'SAMEORIGIN', or 'ALLOW-FROM uri'
    frameOptions: 'DENY',
    
    // Referrer policy
    referrerPolicy: 'strict-origin-when-cross-origin',
    
    // Cache control max age for static assets (in seconds)
    staticAssetsCacheMaxAge: 86400 // 24 hours
};