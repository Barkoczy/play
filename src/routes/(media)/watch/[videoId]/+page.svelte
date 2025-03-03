<script lang="ts">
    import { page } from '$app/stores';
    import HLSPlayer from '$lib/components/HLSPlayer.svelte';
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
        videoId = $page.params.videoId || '';
        // Tu je zmena - loadVideoData musí byť volaná ako normálna funkcia, nie ako metóda
        loadVideoData();
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
            <div class="flex justify-center items-center h-64">
                <div class="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
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
            <HLSPlayer videoUrl={videoData.videoUrl} autoplay={true} />
            
            <!-- Video information -->
            <div class="mx-auto max-w-6xl px-4">
                <div class="mt-4 rounded-lg bg-zinc-900 p-4 shadow-lg">
                    <div class="flex flex-col space-y-4">
                        <!-- Title and status -->
                        <div class="flex items-start justify-between">
                            <div>
                                <h2 class="text-xl font-bold text-white md:text-2xl">{videoData.name}</h2>
                                <p class="mt-1 text-sm text-gray-400">
                                    {#if videoData.live}
                                        <span class="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">LIVE</span>
                                    {/if}
                                    <span class="ml-2">{videoData.desc}</span>
                                </p>
                            </div>
                        </div>

                        <!-- Channel info -->
                        <div class="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-4">
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 overflow-hidden rounded-full bg-zinc-700">
                                    <div class="flex h-full w-full items-center justify-center bg-red-600 text-white">
                                        <span class="text-lg font-bold">{videoData.channel.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 class="font-bold text-white">{videoData.channel.name}</h3>
                                    <p class="text-xs text-gray-400">
                                        {formatSubscribers(videoData.channel.subscribers)} odberateľov · {videoData.channel.desc}
                                    </p>
                                </div>
                            </div>
                            
                            <button class="rounded-full bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>