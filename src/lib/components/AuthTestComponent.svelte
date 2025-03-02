<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, isAuthenticated, isLoading, user, getTokens } from '$lib/auth/store';
	import { initAuthSession } from '$lib/auth/session';
	import type { UserProfile } from '$lib/auth/types';

	// Definovanie typov pre stav
	interface AuthStoreValues {
		isAuthenticated: boolean;
		isLoading: boolean;
		user: UserProfile | null;
	}

	interface TokenData {
		accessToken: string | null;
		refreshToken: string | null;
	}

	// Inicializácia s typmi
	let tokens: TokenData = { accessToken: null, refreshToken: null };
	let storeValues: AuthStoreValues = { isAuthenticated: false, isLoading: true, user: null };
	let authInitialized = false;

	// Subscribe na zmeny v store
	isAuthenticated.subscribe((value: boolean) => (storeValues.isAuthenticated = value));
	isLoading.subscribe((value: boolean) => (storeValues.isLoading = value));
	user.subscribe((value: UserProfile | null) => (storeValues.user = value));

	onMount(() => {
		(async () => {
			// Inicializuj autentifikáciu a získaj tokeny
			authInitialized = true;
			tokens = getTokens() as TokenData;

			// Aktualizuj tokeny, keď sa zmení auth stav
			const unsubscribe = authStore.subscribe(() => {
				tokens = getTokens() as TokenData;
			});

			// Upratovanie pri zničení komponentu
			return () => {
				unsubscribe();
			};
		})();
	});

	// Funkcia na inicializáciu autentifikácie
	async function runInitAuth(): Promise<void> {
		try {
			await initAuthSession();
			tokens = getTokens() as TokenData;
		} catch (error) {
			console.error('Error initializing auth:', error);
		}
	}
</script>

<div class="auth-debug">
	<h2>Auth Debug</h2>

	<div class="section">
		<h3>Auth Store State</h3>
		<pre>{JSON.stringify(storeValues, null, 2)}</pre>
	</div>

	<div class="section">
		<h3>Tokens</h3>
		<pre>{JSON.stringify(tokens, null, 2)}</pre>
	</div>

	<div class="section">
		<h3>Actions</h3>
		<button on:click={runInitAuth}>Run initAuthSession()</button>
	</div>
</div>

<style>
	.auth-debug {
		border: 1px solid #ccc;
		padding: 1rem;
		margin: 1rem 0;
		background-color: #f8f8f8;
		border-radius: 4px;
	}

	.section {
		margin-bottom: 1rem;
	}

	h2 {
		margin-top: 0;
	}

	pre {
		background-color: #333;
		color: #fff;
		padding: 0.5rem;
		border-radius: 4px;
		overflow-x: auto;
	}

	button {
		padding: 0.5rem 1rem;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #45a049;
	}
</style>
