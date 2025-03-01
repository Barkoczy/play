<script lang="ts">
	import '@/app.css';
	import { isLoading } from '$lib/auth';
	let { children } = $props();
</script>

{#if $isLoading}
	<div class="flex h-[calc(100vh-4rem)] items-center justify-center">
		<div
			class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
		></div>
		<span class="ml-3 text-lg font-medium">Loading...</span>
	</div>
{:else}
	{@render children()}
{/if}
