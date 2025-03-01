<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { AuthService } from '$lib/auth';

	// State
	let isLoggingOut = true;
	let error = '';

	onMount(async () => {
		try {
			// Perform logout
			const success = await AuthService.logout();

			if (success) {
				// Redirect to login page after a short delay
				setTimeout(() => {
					goto('/login');
				}, 1500);
			} else {
				error = 'Failed to logout. Please try again.';
			}
		} catch (err) {
			console.error('Logout error:', err);
			error = err instanceof Error ? err.message : 'An error occurred during logout';
		} finally {
			isLoggingOut = false;
		}
	});
</script>

<svelte:head>
	<title>Logging out...</title>
</svelte:head>

<div class="flex h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		{#if isLoggingOut}
			<div class="flex flex-col items-center justify-center space-y-4">
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
				></div>
				<p class="text-lg text-gray-700">Logging out...</p>
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
				<p class="text-center text-lg font-medium text-gray-900">Logout Failed</p>
				<p class="text-center text-gray-600">{error}</p>
				<a
					href="/"
					class="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Return Home
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
				<p class="text-center text-lg font-medium text-gray-900">Logout Successful</p>
				<p class="text-center text-gray-600">You have been logged out successfully.</p>
				<p class="text-center text-sm text-gray-500">Redirecting to login page...</p>
			</div>
		{/if}
	</div>
</div>
