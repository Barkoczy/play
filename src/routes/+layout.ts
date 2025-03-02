import type { LayoutLoad } from './$types';
import { authStore } from '$lib/auth/store';

export const load: LayoutLoad = async ({ data }) => {
  if (data.isAuthenticated && data.user) {
    authStore.setUser({
      userId: data.user.userId,
      email: data.user.email,
      fullName: data.user.fullName,
      isVerified: data.user.isVerified
    });
  } else {
    authStore.clearUser();
  }
  authStore.setLoading(false);
  
  return {
    ...data
  };
};