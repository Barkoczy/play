import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { isAuthenticated, isLoading } from './store';
import { initAuthSession } from './session';
import type { CustomPageLoad } from './types';

/**
 * Guard for protected routes
 * Redirects to login page if user is not authenticated
 */
export function protectedGuard({ url }: { url: URL }) {
  const $isAuthenticated = get(isAuthenticated);
  const $isLoading = get(isLoading);

  // If still loading, don't redirect yet
  if ($isLoading) {
    return;
  }

  // If not authenticated, redirect to login
  if (!$isAuthenticated) {
    const from = url.pathname + url.search;
    throw redirect(307, `/login?redirect=${encodeURIComponent(from)}`);
  }
}

/**
 * Guard for public routes that should not be accessible when authenticated
 * (e.g., login, register pages)
 */
export function publicOnlyGuard() {
  const $isAuthenticated = get(isAuthenticated);
  const $isLoading = get(isLoading);

  // If still loading, don't redirect yet
  if ($isLoading) {
    return;
  }

  // If authenticated, redirect to home page
  if ($isAuthenticated) {
    throw redirect(307, '/');
  }
}

/**
 * Load function for pages that need authentication
 * Will initialize auth session if not already initialized
 */
export const protectedLoad = async ({ parent, url }: CustomPageLoad) => {
  if (!url) {
    throw new Error('URL is undefined');
  }
  // Initialize auth session if needed
  await initAuthSession();

  // Apply the protected guard
  protectedGuard({ url });

  // Return data from parent load function if any
  const data = await parent();
  return data;
};

/**
 * Load function for pages that should only be accessible when not authenticated
 */
export const publicOnlyLoad = async ({ parent }: CustomPageLoad) => {
  // Initialize auth session if needed
  await initAuthSession();

  // Apply the public only guard
  publicOnlyGuard();

  // Return data from parent load function if any
  const data = await parent();
  return data;
};
