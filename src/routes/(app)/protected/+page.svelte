<script lang="ts">
	import { user } from '$lib/auth';
</script>

<svelte:head>
	<title>Protected Page</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="mx-auto max-w-3xl">
		<div class="rounded-lg bg-white p-8 shadow-md">
			<h1 class="mb-6 text-3xl font-bold text-gray-900">Protected Page</h1>

			<div class="mb-6 rounded-md bg-green-100 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg
							class="h-5 w-5 text-green-400"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-green-800">Authenticated Successfully</h3>
						<div class="mt-2 text-sm text-green-700">
							<p>You have successfully authenticated and can now access protected content.</p>
						</div>
					</div>
				</div>
			</div>

			{#if $user}
				<div class="mb-6 space-y-4">
					<h2 class="text-xl font-semibold text-gray-900">User Information</h2>

					<div class="flex items-center space-x-4">
						{#if $user.avatarUrl}
							<img src={$user.avatarUrl} alt="Profile" class="h-16 w-16 rounded-full" />
						{:else}
							<div
								class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-200 text-2xl font-semibold text-blue-600"
							>
								{$user.fullName.charAt(0).toUpperCase()}
							</div>
						{/if}

						<div>
							<h3 class="font-medium text-gray-900">{$user.fullName}</h3>
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

					{#if $user.providers && $user.providers.length > 0}
						<div class="mt-4">
							<h4 class="text-sm font-medium text-gray-700">Connected Accounts</h4>
							<div class="mt-2 flex space-x-2">
								{#each $user.providers as provider}
									<span
										class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 capitalize"
									>
										{provider}
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<div class="border-t border-gray-200 pt-6">
				<h2 class="mb-4 text-xl font-semibold text-gray-900">What's Next?</h2>
				<p class="mb-4 text-gray-600">
					This is a protected page that only authenticated users can access. You can now integrate
					other secure features into your application.
				</p>
				<ul class="ml-6 list-disc space-y-2 text-gray-600">
					<li>Modify your user profile</li>
					<li>Create and manage content</li>
					<li>Access additional protected API endpoints</li>
					<li>Manage account settings and security</li>
				</ul>
			</div>

			<div class="mt-8 flex justify-center">
				<a
					href="/"
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Back to Home
				</a>
			</div>
		</div>
	</div>
</div>
