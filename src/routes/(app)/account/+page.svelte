<script lang="ts">
	import { user, AuthService, authError } from '$lib/auth';
	import { AuthApi } from '$lib/auth/api';
	import type { Session } from '$lib/auth/types';
	import { onMount } from 'svelte';
	import { formatDistanceToNow } from 'date-fns';

	// State for sessions
	let sessions: Session[] = [];
	let isLoadingSessions = true;
	let sessionsError = '';

	// Load sessions
	onMount(async () => {
		try {
			const response = await AuthApi.getSessions();
			if (response.success && response.data) {
				sessions = response.data;
			} else {
				sessionsError = response.error || 'Failed to load sessions';
			}
		} catch (error) {
			console.error('Error loading sessions:', error);
			sessionsError = error instanceof Error ? error.message : 'An error occurred';
		} finally {
			isLoadingSessions = false;
		}
	});

	// Format date for display
	function formatDate(dateString: string): string {
		try {
			const date = new Date(dateString);
			return formatDistanceToNow(date, { addSuffix: true });
		} catch (error) {
			return 'Invalid date';
		}
	}

	// Revoke a session
	async function revokeSession(sessionId: string) {
		try {
			const response = await AuthApi.revokeSession(sessionId);
			if (response.success) {
				// Remove session from list
				sessions = sessions.filter((session) => session.id !== sessionId);
			} else {
				sessionsError = response.error || 'Failed to revoke session';
			}
		} catch (error) {
			console.error('Error revoking session:', error);
			sessionsError = error instanceof Error ? error.message : 'An error occurred';
		}
	}

	// Revoke all other sessions
	async function revokeAllOtherSessions() {
		try {
			const response = await AuthApi.revokeOtherSessions();
			if (response.success) {
				// Reload sessions
				const sessionsResponse = await AuthApi.getSessions();
				if (sessionsResponse.success && sessionsResponse.data) {
					sessions = sessionsResponse.data;
				}
			} else {
				sessionsError = response.error || 'Failed to revoke sessions';
			}
		} catch (error) {
			console.error('Error revoking sessions:', error);
			sessionsError = error instanceof Error ? error.message : 'An error occurred';
		}
	}
</script>

<svelte:head>
	<title>Account</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-8 text-3xl font-bold text-gray-900">Account</h1>

		{#if $user}
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="px-4 py-5 sm:px-6">
					<div class="flex items-center space-x-4">
						{#if $user.avatarUrl}
							<img src={$user.avatarUrl} alt="Profile" class="h-16 w-16 rounded-full" />
						{:else}
							<div
								class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-semibold text-blue-600"
							>
								{$user.fullName.charAt(0).toUpperCase()}
							</div>
						{/if}

						<div>
							<h2 class="text-xl font-semibold text-gray-900">{$user.fullName}</h2>
							<p class="text-gray-600">{$user.email}</p>

							<div class="mt-1 flex items-center">
								{#if $user.isVerified}
									<span
										class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
									>
										Verified
									</span>
								{:else}
									<span
										class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800"
									>
										Not Verified
									</span>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="border-t border-gray-200 px-4 py-5 sm:px-6">
					<h3 class="text-lg leading-6 font-medium text-gray-900">Connected Accounts</h3>
					<div class="mt-4 space-y-4">
						<div class="flex items-center space-x-4">
							<div class="flex-shrink-0">
								<svg class="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
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
							</div>
							<div class="flex-grow">
								<p class="font-medium text-gray-900">Google</p>
							</div>
							{#if $user.providers.includes('google')}
								<button
									type="button"
									class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
								>
									Disconnect
								</button>
							{:else}
								<button
									type="button"
									class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
								>
									Connect
								</button>
							{/if}
						</div>

						<div class="flex items-center space-x-4">
							<div class="flex-shrink-0">
								<svg class="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.494C9.34 21.591 9.5 21.275 9.5 21.003V19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.811 5.03 16.497 5.03 16.497C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18.02 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.47C5.62 10.39 6 9.51 6.65 8.81C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.81C18 9.51 18.38 10.39 18.38 11.47C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26V21.03C14.5 21.3 14.66 21.62 15.17 21.52C19.138 20.16 22 16.42 22 12C22 6.477 17.523 2 12 2Z"
									></path>
								</svg>
							</div>
							<div class="flex-grow">
								<p class="font-medium text-gray-900">GitHub</p>
							</div>
							{#if $user.providers.includes('github')}
								<button
									type="button"
									class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
								>
									Disconnect
								</button>
							{:else}
								<button
									type="button"
									class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
								>
									Connect
								</button>
							{/if}
						</div>

						<div class="flex items-center space-x-4">
							<div class="flex-shrink-0">
								<svg class="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
									></path>
								</svg>
							</div>
							<div class="flex-grow">
								<p class="font-medium text-gray-900">Discord</p>
							</div>
							{#if $user.providers.includes('discord')}
								<button
									type="button"
									class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
								>
									Disconnect
								</button>
							{:else}
								<button
									type="button"
									class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
								>
									Connect
								</button>
							{/if}
						</div>
					</div>
				</div>

				<div class="border-t border-gray-200 px-4 py-5 sm:px-6">
					<h3 class="text-lg leading-6 font-medium text-gray-900">Active Sessions</h3>

					{#if isLoadingSessions}
						<div class="mt-4 flex items-center justify-center p-4">
							<div
								class="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
							></div>
							<span class="ml-2 text-gray-600">Loading sessions...</span>
						</div>
					{:else if sessionsError}
						<div class="mt-4 rounded-md bg-red-50 p-4">
							<div class="flex">
								<div class="flex-shrink-0">
									<svg
										class="h-5 w-5 text-red-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<div class="ml-3">
									<h3 class="text-sm font-medium text-red-800">Error loading sessions</h3>
									<div class="mt-2 text-sm text-red-700">
										<p>{sessionsError}</p>
									</div>
								</div>
							</div>
						</div>
					{:else if sessions.length === 0}
						<p class="mt-4 text-gray-600">No active sessions found.</p>
					{:else}
						<div class="mt-4 overflow-hidden rounded-md border border-gray-200">
							<ul class="divide-y divide-gray-200">
								{#each sessions as session (session.id)}
									<li class="flex items-center justify-between bg-white px-6 py-4 hover:bg-gray-50">
										<div class="flex items-center space-x-4">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
											>
												<svg
													class="h-6 w-6 text-gray-500"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
											</div>
											<div>
												<p class="font-medium text-gray-900">{session.device}</p>
												<p class="text-sm text-gray-500">{session.browser} on {session.os}</p>
												<p class="text-xs text-gray-400">
													Last activity: {formatDate(session.lastActivity)}
												</p>
											</div>
										</div>

										<button
											on:click={() => revokeSession(session.id)}
											class="ml-4 rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50"
										>
											Revoke
										</button>
									</li>
								{/each}
							</ul>
						</div>

						<div class="mt-4 flex justify-end">
							<button
								on:click={revokeAllOtherSessions}
								class="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50"
							>
								Revoke All Other Sessions
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
