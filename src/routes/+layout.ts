import { initAuthSession } from '$lib/auth';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

/**
 * Root layout load function
 * Initializes auth session on client side
 */
export const load: LayoutLoad = async ({ data }) => {
  // Initialize auth session in the browser
  if (browser) {
    try {
      await initAuthSession();
    } catch (error) {
      console.error('Failed to initialize auth session:', error);
    }
  }
 
  return {
    ...data
  };
};