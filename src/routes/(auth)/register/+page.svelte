<script lang="ts">
	import { AuthService, authError, isLoading } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Form data
	let email = '';
	let password = '';
	let confirmPassword = '';
	let fullName = '';

	// Local states
	let isSubmitting = false;
	let formError = '';
	let passwordError = '';

	// Get redirect URL from query parameter
	$: redirectUrl = $page.url.searchParams.get('redirect') || '/';

	// Validate form
	function validateForm() {
		// Reset errors
		formError = '';
		passwordError = '';

		// Check passwords match
		if (password !== confirmPassword) {
			passwordError = 'Passwords do not match';
			return false;
		}

		// Check password complexity
		if (password.length < 8) {
			passwordError = 'Password must be at least 8 characters long';
			return false;
		}

		return true;
	}

	// Handle form submission
	async function handleSubmit() {
		// Validate form
		if (!validateForm()) {
			return;
		}

		isSubmitting = true;

		try {
			const user = await AuthService.register({
				email,
				password,
				fullName
			});

			if (user) {
				// Redirect to the requested page or home
				goto(redirectUrl);
			} else {
				formError = $authError || 'Registration failed. Please try again.';
			}
		} catch (error) {
			console.error('Registration error:', error);
			formError = error instanceof Error ? error.message : 'Registration failed';
		} finally {
			isSubmitting = false;
		}
	}

	// Start OAuth login flows
	async function startOAuthLogin(provider: 'google' | 'discord' | 'github') {
		const url = await AuthService.startOAuthLogin(provider);
		if (url) {
			// Save the redirect URL in session storage to retrieve after OAuth callback
			sessionStorage.setItem('oauth_redirect', redirectUrl);
			// Redirect to OAuth provider
			window.location.href = url;
		}
	}
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		<h1 class="mb-6 text-center text-2xl font-bold text-gray-900">Create an Account</h1>

		<!-- Error message -->
		{#if formError}
			<div class="mb-4 rounded-md bg-red-100 p-4 text-sm text-red-700">
				{formError}
			</div>
		{/if}

		<!-- Register form -->
		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div>
				<label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
				<input
					type="text"
					id="fullName"
					bind:value={fullName}
					required
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					required
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					required
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
				<p class="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
			</div>

			<div>
				<label for="confirmPassword" class="block text-sm font-medium text-gray-700"
					>Confirm Password</label
				>
				<input
					type="password"
					id="confirmPassword"
					bind:value={confirmPassword}
					required
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
				{#if passwordError}
					<p class="mt-1 text-xs text-red-600">{passwordError}</p>
				{/if}
			</div>

			<button
				type="submit"
				disabled={isSubmitting || $isLoading}
				class="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
			>
				{isSubmitting || $isLoading ? 'Creating account...' : 'Create Account'}
			</button>
		</form>

		<!-- Social login options -->
		<div class="mt-6">
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-white px-2 text-gray-500">Or continue with</span>
				</div>
			</div>

			<div class="mt-6 grid grid-cols-3 gap-3">
				<button
					on:click={() => startOAuthLogin('google')}
					class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
					aria-label="Prihlásiť sa cez Google"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12.545 12.151L12.542 12.147L12.545 12.151C12.545 12.151 12.545 12.151 12.545 12.151L12.545 12.151Z"
						></path>
						<path
							d="M11.6349 13.8969L16.2137 10.1469C15.9399 9.69319 15.1789 9.00019 13.9989 9.00019C12.3199 9.00019 10.9989 10.1212 10.9989 12.0002C10.9989 13.1042 11.5019 13.8252 11.6349 13.8969Z"
						></path>
						<path
							d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.1555 22 21.502 18.18 21.9765 13.188C22.001 12.8115 22.0125 12.455 22.0125 12.0725C22.0125 11.4295 21.931 10.7265 21.8055 10.0415Z"
						></path>
					</svg>
				</button>

				<button
					on:click={() => startOAuthLogin('github')}
					class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
					aria-label="Prihlásiť sa cez GitHub"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.494C9.34 21.591 9.5 21.275 9.5 21.003V19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.811 5.03 16.497 5.03 16.497C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18.02 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.47C5.62 10.39 6 9.51 6.65 8.81C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.81C18 9.51 18.38 10.39 18.38 11.47C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21.03C14.5 21.3 14.66 21.62 15.17 21.52C19.138 20.16 22 16.42 22 12C22 6.477 17.523 2 12 2Z"
						></path>
					</svg>
				</button>

				<button
					on:click={() => startOAuthLogin('discord')}
					class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
					aria-label="Prihlásiť sa cez Discord"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
						></path>
					</svg>
				</button>
			</div>
		</div>

		<div class="mt-6 text-center">
			<p class="text-sm text-gray-600">
				Already have an account?
				<a href="/login" class="font-medium text-blue-600 hover:text-blue-500"> Sign in </a>
			</p>
		</div>
	</div>
</div>
