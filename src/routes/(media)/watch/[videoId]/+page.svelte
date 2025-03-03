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
    
    // Základné URL stránky
    const siteUrl = 'https://tvoj-web.sk'; // Nahraď svojou doménou
    
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
    
    // Generovanie SEO meta informácií
    $effect(() => {
        if (videoData) {
            // Aktualizácia title, ak máme dáta
            document.title = `${videoData.name} | Play`;
        }
    });
    
    // Generovanie opisu pre meta description
    function getMetaDescription() {
        if (!videoData) return 'Prehrávač videí - sledujte obľúbené videá online';
        
        let description = videoData.desc || '';
        // Skrátenie na max 160 znakov pre meta description
        if (description.length > 157) {
            description = description.substring(0, 157) + '...';
        }
        return description;
    }
    
    // Generovanie URL pre zdieľanie
    function getShareUrl() {
        return `${siteUrl}/video/${videoId}`;
    }
    
    // Získanie náhľadového obrázka pre video
    function getThumbnailUrl() {
        if (!videoData || !videoData.thumbnail) {
            // Vráť placeholder, ak nemáme obrázok
            return `${siteUrl}/images/default-thumbnail.jpg`;
        }
        return videoData.thumbnail;
    }
    
    // Funkcia na vytvorenie Scheme.org dát pre video
    function getSchemaOrgData() {
        if (!videoData) return {};
        
        return {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": videoData.name || 'Video',
            "description": videoData.desc || '',
            "thumbnailUrl": getThumbnailUrl(),
            "uploadDate": videoData.uploadDate || new Date().toISOString(),
            "contentUrl": videoData.videoUrl || '',
            "embedUrl": getShareUrl(),
            "duration": videoData.duration || '',
            "author": {
                "@type": "Person",
                "name": videoData.channel?.name || ''
            }
        };
    }
</script>

<svelte:head>
    <!-- Základné SEO meta tagy -->
    <title>{videoData?.name ? `${videoData.name} | Play` : 'Video prehrávač | Play'}</title>
    <meta name="description" content={getMetaDescription()} />
    
    <!-- Kanonická URL adresa - dôležité pre SEO -->
    <link rel="canonical" href={getShareUrl()} />
    
    <!-- Open Graph meta tagy pre Facebook -->
    <meta property="og:site_name" content="Play" />
    <meta property="og:url" content={getShareUrl()} />
    <meta property="og:title" content={videoData?.name || 'Video prehrávač'} />
    <meta property="og:description" content={getMetaDescription()} />
    <meta property="og:image" content={getThumbnailUrl()} />
    <meta property="og:type" content="video.other" />
    {#if videoData?.videoUrl}
        <meta property="og:video" content={videoData.videoUrl} />
        <meta property="og:video:secure_url" content={videoData.videoUrl} />
        <meta property="og:video:type" content="application/x-mpegURL" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />
    {/if}
    
    <!-- Twitter Card meta tagy -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={videoData?.name || 'Video prehrávač'} />
    <meta name="twitter:description" content={getMetaDescription()} />
    <meta name="twitter:image" content={getThumbnailUrl()} />
    
    <!-- Ďalšie užitočné meta tagy -->
    <meta name="keywords" content={`video, play, ${videoData?.name || ''}, ${videoData?.channel?.name || ''}`} />
    
    <!-- Štruktúrované dáta pre Google (Schema.org) - OPRAVENÉ s podmienkovým vykreslením -->
    {#if videoData}
        {@html `<script type="application/ld+json">${JSON.stringify(getSchemaOrgData())}</script>`}
    {/if}
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
            
            <!-- Social Sharing Buttons - OPRAVENÉ s konzistentným štýlom -->
            <div class="mx-auto max-w-6xl py-8">
                <div class="flex justify-center gap-3">
                    <!-- Facebook share button -->
                    <button 
                        class="inline-flex items-center justify-center rounded-full bg-black py-2 px-4 text-white border border-neutral-700 hover:bg-neutral-800 transition"
                        onclick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`, '_blank')}
                        title="Zdieľať na Facebooku"
                    >
                        <svg class="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                        </svg>
                        <span>Zdieľať</span>
                    </button>
                    
                    <!-- Twitter share button -->
                    <button 
                        class="inline-flex items-center justify-center rounded-full bg-black py-2 px-4 text-white border border-neutral-700 hover:bg-neutral-800 transition"
                        onclick={() => {
                            if (videoData) {
                                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(videoData.name)}`, '_blank');
                            }
                        }}
                        title="Zdieľať na Twitteri"
                    >
                        <svg class="h-5 w-5 text-sky-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        <span>Tweetovať</span>
                    </button>
                    
                    <!-- General share button -->
                    <button 
                        class="inline-flex items-center justify-center rounded-full bg-black py-2 px-4 text-white border border-neutral-700 hover:bg-neutral-800 transition"
                        onclick={() => {
                            if (navigator.share) {
                                if (videoData) {
                                    navigator.share({
                                        title: videoData.name,
                                        text: videoData.desc,
                                        url: getShareUrl(),
                                    });
                                }
                            } else {
                                navigator.clipboard.writeText(getShareUrl());
                                alert('URL skopírovaná do schránky!');
                            }
                        }}
                        title="Zdieľať video"
                    >
                        <svg class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Zdieľať</span>
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>