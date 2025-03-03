<script lang="ts">
	import { isAuthenticated, user } from '$lib/auth';
	import { page } from '$app/stores';
	import { ChevronDown, Menu, X } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	// Mobile menu state
	let isMenuOpen = false;

	// Dropdown state
	let isProfileDropdownOpen = false;

	// Toggle mobile menu
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		// Close dropdown when opening/closing menu
		isProfileDropdownOpen = false;
	}

	// Toggle profile dropdown
	function toggleProfileDropdown() {
		isProfileDropdownOpen = !isProfileDropdownOpen;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (isProfileDropdownOpen) {
			const target = event.target as HTMLElement;
			const dropdown = document.getElementById('profile-dropdown');
			const button = document.getElementById('profile-button');

			if (dropdown && button && !dropdown.contains(target) && !button.contains(target)) {
				isProfileDropdownOpen = false;
			}
		}
	}

	// Navigation links
	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' }
	];

	// Protected links (only shown when authenticated)
	const protectedLinks = [
		{ href: '/protected', label: 'Protected Page' },
		{ href: '/account', label: 'Account' }
	];
</script>

<svelte:window on:click={handleClickOutside} />

<nav class="bg-white relative z-40 shadow">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex">
				<!-- Logo -->
				<div class="flex flex-shrink-0 items-center">
					<a href="/" class="text-xl font-bold text-blue-600">Play</a>
				</div>

				<!-- Desktop navigation -->
				<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
					{#each navLinks as link}
						<a
							href={link.href}
							class="inline-flex items-center border-b-2 {$page.url.pathname === link.href
								? 'border-blue-500 text-gray-900'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} px-1 pt-1 text-sm font-medium"
							aria-current={$page.url.pathname === link.href ? 'page' : undefined}
						>
							{link.label}
						</a>
					{/each}

					{#if $isAuthenticated}
						{#each protectedLinks as link}
							<a
								href={link.href}
								class="inline-flex items-center border-b-2 {$page.url.pathname === link.href
									? 'border-blue-500 text-gray-900'
									: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} px-1 pt-1 text-sm font-medium"
								aria-current={$page.url.pathname === link.href ? 'page' : undefined}
							>
								{link.label}
							</a>
						{/each}
					{/if}
				</div>
			</div>

			<div class="hidden sm:ml-6 sm:flex sm:items-center">
				{#if $isAuthenticated && $user}
					<!-- Profile dropdown -->
					<div class="relative ml-3">
						<button
							id="profile-button"
							type="button"
							class="flex rounded-full bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
							on:click={toggleProfileDropdown}
						>
							<span class="sr-only">Open user menu</span>
							{#if $user.avatarUrl}
								<img class="h-8 w-8 rounded-full" src={$user.avatarUrl} alt={$user.fullName} />
							{:else}
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600"
								>
									{$user.fullName.charAt(0).toUpperCase()}
								</div>
							{/if}
							<span class="ml-2 hidden items-center text-sm text-gray-700 md:flex">
								{$user.fullName}
								<ChevronDown class="ml-1 h-4 w-4" />
							</span>
						</button>

						{#if isProfileDropdownOpen}
							<div
								id="profile-dropdown"
								transition:slide={{ duration: 200 }}
								class="ring-opacity-5 absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-white focus:outline-none z-50"
							>
								<a href="/account" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
									Your Profile
								</a>
								<a
									href="/account/settings"
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									Settings
								</a>
								<a href="/logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
									Sign out
								</a>
							</div>
						{/if}
					</div>
				{:else}
					<div class="flex space-x-4">
						<a
							href="/login"
							class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
						>
							Sign in
						</a>
						<a
							href="/register"
							class="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							Sign up
						</a>
					</div>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<div class="flex items-center sm:hidden">
				<button
					type="button"
					on:click={toggleMenu}
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
				>
					<span class="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
					{#if isMenuOpen}
						<X class="h-6 w-6" />
					{:else}
						<Menu class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if isMenuOpen}
		<div class="sm:hidden" transition:slide={{ duration: 200 }}>
			<div class="space-y-1 pt-2 pb-3">
				{#each navLinks as link}
					<a
						href={link.href}
						class="block border-l-4 {$page.url.pathname === link.href
							? 'border-blue-500 bg-blue-50 text-blue-700'
							: 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'} py-2 pr-4 pl-3 text-base font-medium"
						aria-current={$page.url.pathname === link.href ? 'page' : undefined}
					>
						{link.label}
					</a>
				{/each}

				{#if $isAuthenticated}
					{#each protectedLinks as link}
						<a
							href={link.href}
							class="block border-l-4 {$page.url.pathname === link.href
								? 'border-blue-500 bg-blue-50 text-blue-700'
								: 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'} py-2 pr-4 pl-3 text-base font-medium"
							aria-current={$page.url.pathname === link.href ? 'page' : undefined}
						>
							{link.label}
						</a>
					{/each}
				{/if}
			</div>

			<div class="border-t border-gray-200 pt-4 pb-3">
				{#if $isAuthenticated && $user}
					<div class="flex items-center px-4">
						<div class="flex-shrink-0">
							{#if $user.avatarUrl}
								<img class="h-10 w-10 rounded-full" src={$user.avatarUrl} alt={$user.fullName} />
							{:else}
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600"
								>
									{$user.fullName.charAt(0).toUpperCase()}
								</div>
							{/if}
						</div>
						<div class="ml-3">
							<div class="text-base font-medium text-gray-800">{$user.fullName}</div>
							<div class="text-sm font-medium text-gray-500">{$user.email}</div>
						</div>
					</div>
					<div class="mt-3 space-y-1">
						<a
							href="/account"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
						>
							Your Profile
						</a>
						<a
							href="/account/settings"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
						>
							Settings
						</a>
						<a
							href="/logout"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
						>
							Sign out
						</a>
					</div>
				{:else}
					<div class="mt-3 space-y-1">
						<a
							href="/login"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
						>
							Sign in
						</a>
						<a
							href="/register"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
						>
							Sign up
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>
