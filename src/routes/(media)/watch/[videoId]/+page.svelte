<script lang="ts">
	import { page } from '$app/stores';
	import HLSPlayer from '$lib/components/HLSPlayer.svelte';
    import VideoInfo from '@/lib/components/VideoInfo.svelte';
	import { getVideoById } from '$lib/api/videoApi';
	import type { Video } from '$lib/types/videoTypes';

	// Reaktívne stavy
	let videoId = $state('');
	let videoData: Video | null = $state(null);
	let loading = $state(true);
	let error = $state(false);

	// Funkcia na načítanie dát videa
	async function loadVideoData() {
		if (!videoId) {
			videoData = null;
			loading = false;
			return;
		}

		loading = true;
		error = false;

		try {
			// Tu bol problém - getVideoById potrebuje byť volaný priamo, nie cez metódu
			const data = await getVideoById(videoId);

			if (data) {
				videoData = data;
			} else {
				videoData = null;
				error = true;
			}
		} catch (e) {
			console.error('Chyba pri načítaní dát videa:', e);
			error = true;
			videoData = null;
		} finally {
			loading = false;
		}
	}

	// Sledujeme zmeny v URL parametri
	$effect(() => {
		const newVideoId = $page.params.videoId || '';
		if (newVideoId !== videoId) {
			videoId = newVideoId;
			loadVideoData();
		}
	});

	// Formátovanie počtu odberateľov
	function formatSubscribers(count: number): string {
		if (count >= 1000000) {
			return (count / 1000000).toFixed(1) + 'M';
		} else if (count >= 1000) {
			return (count / 1000).toFixed(1) + 'K';
		}
		return count.toString();
	}
</script>

<svelte:head>
	<title>{videoData?.name || 'Video prehrávač'}</title>
</svelte:head>

<div class="w-full max-w-none bg-black">
	{#if loading}
		<!-- Loading indicator -->
		<div class="mx-auto max-w-6xl p-4">
			<div class="flex h-64 items-center justify-center">
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"
				></div>
			</div>
		</div>
	{:else if error || !videoData}
		<!-- Error message -->
		<div class="mx-auto max-w-6xl p-4">
			<div class="rounded-lg border border-red-800 bg-red-900/30 p-6">
				<h2 class="mb-2 text-xl font-semibold text-red-400">Video nenájdené</h2>
				<p class="text-gray-300">Prosím, zadajte platné ID videa.</p>
			</div>
		</div>
	{:else}
		<!-- Video player -->
		<div class="mx-auto w-full max-w-none">
			<!-- HLS Player component s použitím videoUrl -->
			<div class="mx-auto max-w-[1536px] aspect-w-16 aspect-h-9">
				<HLSPlayer videoUrl={videoData.videoUrl} autoplay={true} live={videoData.live} />
			</div>

			<!-- Video information -->
			<VideoInfo 
				name={videoData.name}
				description={videoData.desc}
				isLive={videoData.live}
				channel={videoData.channel}
			/>
		</div>
	{/if}
</div>
