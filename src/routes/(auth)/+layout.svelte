<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<Navbar />

<main>{@render children()}</main>

<footer class="bg-gray-50 py-6">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<p class="text-center text-sm text-gray-500">
			&copy; {new Date().getFullYear()} YourApp. All rights reserved.
		</p>
	</div>
</footer>
