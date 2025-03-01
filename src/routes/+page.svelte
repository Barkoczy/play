<script lang="ts">
	import { isAuthenticated, user } from '$lib/auth';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="bg-white">
	<div class="relative isolate px-6 pt-14 lg:px-8">
		<div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
			<div
				class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-purple-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			></div>
		</div>

		<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
			<div class="text-center">
				<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
					Secure Authentication for Your Applications
				</h1>
				<p class="mt-6 text-lg leading-8 text-gray-600">
					A complete authentication solution with OAuth social logins, secure session management,
					and easy integration.
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
					{#if $isAuthenticated}
						<a
							href="/protected"
							class="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
						>
							View Protected Page
						</a>
						<a href="/account" class="text-sm leading-6 font-semibold text-gray-900">
							Manage Account <span aria-hidden="true">→</span>
						</a>
					{:else}
						<a
							href="/register"
							class="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
						>
							Get Started
						</a>
						<a href="/login" class="text-sm leading-6 font-semibold text-gray-900">
							Sign In <span aria-hidden="true">→</span>
						</a>
					{/if}
				</div>
			</div>
		</div>

		<div
			class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
		>
			<div
				class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-500 to-purple-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
				style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
			></div>
		</div>
	</div>

	<!-- Features section -->
	<div class="py-24 sm:py-32">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-2xl lg:text-center">
				<h2 class="text-base leading-7 font-semibold text-blue-600">Authentication Made Easy</h2>
				<p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					Everything you need for secure user authentication
				</p>
				<p class="mt-6 text-lg leading-8 text-gray-600">
					Our authentication system provides a complete solution for user authentication, with
					multiple login options, secure session management, and easy integration.
				</p>
			</div>
			<div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
				<dl
					class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
				>
					<div class="relative pl-16">
						<dt class="text-base leading-7 font-semibold text-gray-900">
							<div
								class="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600"
							>
								<svg
									class="h-6 w-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
									/>
								</svg>
							</div>
							Social Logins
						</dt>
						<dd class="mt-2 text-base leading-7 text-gray-600">
							Enable users to log in using their Google, Discord, or GitHub accounts with OAuth 2.0
							integration.
						</dd>
					</div>
					<div class="relative pl-16">
						<dt class="text-base leading-7 font-semibold text-gray-900">
							<div
								class="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600"
							>
								<svg
									class="h-6 w-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
									/>
								</svg>
							</div>
							Secure Session Management
						</dt>
						<dd class="mt-2 text-base leading-7 text-gray-600">
							JWT tokens, refresh tokens, and secure cookies for seamless and secure session
							management across devices.
						</dd>
					</div>
					<div class="relative pl-16">
						<dt class="text-base leading-7 font-semibold text-gray-900">
							<div
								class="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600"
							>
								<svg
									class="h-6 w-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
									/>
								</svg>
							</div>
							Enhanced Security
						</dt>
						<dd class="mt-2 text-base leading-7 text-gray-600">
							Protected against CSRF, XSS, and session hijacking with secure headers, HTTPS
							enforcement, and token validation.
						</dd>
					</div>
					<div class="relative pl-16">
						<dt class="text-base leading-7 font-semibold text-gray-900">
							<div
								class="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600"
							>
								<svg
									class="h-6 w-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
									/>
								</svg>
							</div>
							Easy Integration
						</dt>
						<dd class="mt-2 text-base leading-7 text-gray-600">
							Simple to integrate with your existing Svelte applications using our pre-built
							components and middleware.
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</div>
</div>
