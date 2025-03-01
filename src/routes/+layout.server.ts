import type { LayoutServerLoad } from './$types';

/**
 * Root layout server load function
 * Provides server-side authentication data to all routes
 */
export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user,
		isAuthenticated: locals.isAuthenticated
	};
};
