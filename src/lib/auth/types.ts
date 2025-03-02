export interface UserProfile {
	userId: string;
	email: string;
	fullName: string;
	avatarUrl?: string | null;
	isVerified: boolean;
	providers?: Array<'google' | 'discord' | 'github'>;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	email: string;
	password: string;
	fullName: string;
}

export interface UpdateProfileData {
	fullName?: string;
	avatarUrl?: string | null;
	password?: string;
	currentPassword?: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken?: string;
	expiresIn: number;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	errors?: Record<string, string[]>;
}

export interface Session {
	id: string;
	createdAt: string;
	lastActivity: string;
	expiresAt: string;
	device: string;
	browser: string;
	os: string;
	ipAddress: string;
}

export type CustomPageLoad = {
	parent: () => Promise<Record<string, unknown>>;
	url?: URL;
};

export interface TokenValidationResponse {
    success: boolean;
    valid: boolean;
    data?: {
        userId: string;
        email: string;
        fullName: string;
        isVerified: boolean;
    };
    error?: string;
}