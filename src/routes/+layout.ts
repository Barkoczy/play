import { initAuthSession } from '$lib/auth';
import type { LayoutLoad } from './$types';

/**
 * Root layout load function
 * Initializes auth session on client side
 */
export const load: LayoutLoad = async ({ data }) => {
  // Initialize auth session in the browser
  if (typeof window !== 'undefined') {
    await initAuthSession();
  }
  
  return {
    ...data
  };
};