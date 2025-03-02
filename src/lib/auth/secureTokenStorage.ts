import { browser } from '$app/environment';

// Secure token storage mechanism
export class SecureTokenStorage {
    private static STORAGE_PREFIX = 'auth_';

    // Encrypt token before storing
    private static encrypt(token: string): string {
        try {
            // Basic encoding to prevent casual reading
            return btoa(token);
        } catch (error) {
            console.error('Token encryption failed', error);
            return token;
        }
    }

    // Decrypt token when retrieving
    private static decrypt(encryptedToken: string): string {
        try {
            return atob(encryptedToken);
        } catch (error) {
            console.error('Token decryption failed', error);
            return encryptedToken;
        }
    }

    // Store token securely
    static setToken(key: string, token: string): void {
        if (!browser) return;
        
        try {
            const encryptedToken = this.encrypt(token);
            sessionStorage.setItem(`${this.STORAGE_PREFIX}${key}`, encryptedToken);
        } catch (error) {
            console.error('Failed to store token', error);
        }
    }

    // Retrieve token
    static getToken(key: string): string | null {
        if (!browser) return null;
        try {
            const encryptedToken = sessionStorage.getItem(`${this.STORAGE_PREFIX}${key}`);
            return encryptedToken ? this.decrypt(encryptedToken) : null;
        } catch (error) {
            console.error('Failed to retrieve token', error);
            return null;
        }
    }

    // Remove specific token
    static removeToken(key: string): void {
        if (!browser) return;
        
        sessionStorage.removeItem(`${this.STORAGE_PREFIX}${key}`);
    }

    // Clear all tokens
    static clearAllTokens(): void {
        if (!browser) return;
        
        Object.keys(sessionStorage)
            .filter(key => key.startsWith(this.STORAGE_PREFIX))
            .forEach(key => sessionStorage.removeItem(key));
    }
}
