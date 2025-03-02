import type { LayoutServerLoad } from './$types';
import { authStore } from '$lib/auth/store';

export const load: LayoutServerLoad = async ({ locals }) => {
  console.log('layout.server.ts load function called with locals:', {
    isAuthenticated: locals.isAuthenticated,
    hasUser: !!locals.user
  });
  
  // Najprv explicitne resetujeme loading stav
  authStore.setLoading(false);
  
  // Na serveri inicializujeme authStore so správnymi údajmi
  if (locals.isAuthenticated && locals.user) {
    // Nastavíme užívateľa do store už na serveri
    authStore.setUser({
      userId: locals.user.userId || locals.user.userId,
      email: locals.user.email,
      fullName: locals.user.fullName || locals.user.fullName,
      isVerified: locals.user.isVerified
    });
  } else {
    // Vyčistíme store, ak užívateľ nie je autentifikovaný
    authStore.clearUser();
  }
  
  // Ešte raz explicitne nastavíme loading na false
  authStore.setLoading(false);
  
  // Vrátime dáta pre klienta
  return {
    user: locals.user,
    isAuthenticated: locals.isAuthenticated
  };
};
