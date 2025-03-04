import type { Handle } from '@sveltejs/kit';
import { allowedUrls, securityConfig } from '$lib/conf/securityConfig';

/**
 * Security headers hook
 */
const securityHook: Handle = async ({ event, resolve }) => {
    // SEO optimalizácia - normalizácia URL (odstránenie lomítka na konci)
    if (event.url.pathname.endsWith('/') && event.url.pathname !== '/') {
        return new Response(null, {
            status: 301,
            headers: {
                location: event.url.pathname.slice(0, -1) + event.url.search
            }
        });
    }
    
    // Predvoľba prerendering pre SEO stránky
    if (event.url.pathname.startsWith('/watch/')) {
        event.setHeaders({
            'Cache-Control': 'public, max-age=60, s-maxage=60'
        });
    }
    
    // Pokračuj s pôvodnou logikou
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

// Export the combined hooks
export const handle: Handle = securityHook;