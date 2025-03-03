<script lang="ts">
    import { getAllVideos, getFeaturedVideos } from '$lib/api/videoApi';
    import type { Video } from '$lib/types/videoTypes';
    
    // Reaktívne stavy
    let videos: Video[] = $state([]);
    let featuredVideos: Video[] = $state([]);
    let loading = $state(true);
    let error = $state(false);
    
    // Funkcia na načítanie dát
    async function loadData() {
        try {
            loading = true;
            error = false;
            
            // Paralelné načítanie videí
            const [allVideos, featured] = await Promise.all([
                getAllVideos(),
                getFeaturedVideos()
            ]);
            
            videos = allVideos;
            featuredVideos = featured;
        } catch (e) {
            console.error('Error loading videos:', e);
            error = true;
        } finally {
            loading = false;
        }
    }
    
    // Načítanie dát pri inicializácii
    loadData();
</script>

<svelte:head>
    <title>Video Streaming</title>
</svelte:head>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Knižnica videí</h1>
    
    {#if loading}
        <div class="flex justify-center py-12">
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
        </div>
    {:else if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>Nastala chyba pri načítaní videí. Skúste to prosím neskôr.</p>
            <button 
                class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onclick={loadData}
            >
                Skúsiť znova
            </button>
        </div>
    {:else}
        <!-- Featured Videos Section -->
        {#if featuredVideos.length > 0}
            <section class="mb-10">
                <h2 class="text-2xl font-bold mb-4">Živé vysielania</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {#each featuredVideos as video}
                        <a href="/watch/{video.videoId}" class="bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div class="relative pb-[56.25%]">
                                <div class="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                                    <div class="text-5xl text-zinc-700">▶</div>
                                    <div class="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">LIVE</div>
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-bold text-lg">{video.name}</h3>
                                <p class="text-gray-400 text-sm mt-1">{video.channel.name}</p>
                            </div>
                        </a>
                    {/each}
                </div>
            </section>
        {/if}
        
        <!-- All Videos Section -->
        <section>
            <h2 class="text-2xl font-bold mb-4">Všetky videá</h2>
            {#if videos.length === 0}
                <p class="text-gray-400">Žiadne videá neboli nájdené.</p>
            {:else}
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {#each videos as video}
                        <a href="/watch/{video.videoId}" class="bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div class="relative pb-[56.25%]">
                                <div class="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                                    <div class="text-5xl text-zinc-700">▶</div>
                                    {#if video.live}
                                        <div class="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">LIVE</div>
                                    {/if}
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-bold text-lg">{video.name}</h3>
                                <p class="text-gray-400 text-sm mt-1">{video.channel.name}</p>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </section>
    {/if}
</div>