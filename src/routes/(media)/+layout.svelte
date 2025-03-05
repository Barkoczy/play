<script lang="ts">
	import '@/app.css';
	let { children } = $props();

	import Header from '$lib/components/MediaNavbar.svelte';
</script>

<Header />

<div class="min-h-screen pt-[58px] bg-black text-white">
	<main class="mx-auto">
		{@render children()}
	</main>
</div>

<footer class="border-t  bg-black border-neutral-800 py-6">
	<div class="container mx-auto px-4">
		<div class="text-center text-sm text-neutral-400">
			&copy; {new Date().getFullYear()} <span class="text-red-600">Play</span> @ Slovenská video stream platforma
		</div>
	</div>
</footer>
