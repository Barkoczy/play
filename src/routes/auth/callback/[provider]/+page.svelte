<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { AuthApi } from '$lib/auth/api';
	import { authStore, storeTokens } from '$lib/auth/store';

	// States
	let error = '';
	let isLoading = true;

	onMount(async () => {
		try {
			// Get provider from route parameter
			const provider = $page.params.provider;

			// Get code and state from URL parameters
			const code = $page.url.searchParams.get('code');
			const state = $page.url.searchParams.get('state');

			// If no code, show error
			if (!code) {
				error = 'Authentication failed: No authorization code received';
				isLoading = false;
				return;
			}

			// Process the OAuth callback on the backend
			const response = await fetch(
				`/api/auth/oauth/callback/${provider}?code=${code}&state=${state}`,
				{
					method: 'GET',
					credentials: 'include'
				}
			);

			if (!response.ok) {
				throw new Error(`OAuth callback failed with status: ${response.status}`);
			}

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			if (data.accessToken) {
				// Store tokens if the authentication was successful
				storeTokens({
					accessToken: data.accessToken,
					refreshToken: data.refreshToken
				});

				// Get user profile
				const profileResponse = await AuthApi.getProfile(data.accessToken);

				if (profileResponse.success && profileResponse.data) {
					// Update auth store
					authStore.setUser(profileResponse.data);

					// Redirect to the stored redirect URL or home
					const redirectUrl = sessionStorage.getItem('oauth_redirect') || '/';
					sessionStorage.removeItem('oauth_redirect');
					goto(redirectUrl);
				} else {
					throw new Error(profileResponse.error || 'Failed to get user profile');
				}
			} else {
				throw new Error('No access token received');
			}
		} catch (err) {
			console.error('OAuth callback error:', err);
			error = err instanceof Error ? err.message : 'Authentication failed';
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Authentication</title>
</svelte:head>

<div class="flex h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		{#if isLoading}
			<div class="flex flex-col items-center justify-center space-y-4">
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
				></div>
				<p class="text-lg text-gray-700">Processing authentication...</p>
			</div>
		{:else if error}
			<div class="flex flex-col items-center justify-center space-y-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</div>
				<p class="text-center text-lg font-medium text-gray-900">Authentication Failed</p>
				<p class="text-center text-gray-600">{error}</p>
				<a
					href="/login"
					class="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Return to Login
				</a>
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center space-y-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-500"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<p class="text-center text-lg font-medium text-gray-900">Authentication Successful</p>
				<p class="text-center text-gray-600">You are being redirected...</p>
			</div>
		{/if}
	</div>
</div>
