import type { PageLoad } from './$types';
import { protectedLoad } from '$lib/auth/guards';

export const load: PageLoad = protectedLoad;