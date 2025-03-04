<script lang="ts">
	import HLSPlayer from '$lib/components/HLSPlayer.svelte';
	import VideoInfo from '@/lib/components/VideoInfo.svelte';
	import type { PageData } from './$types';

	// Server-side injected data
	export let data: PageData;

	// SEO meta tagy a dáta videa
	$: seo = data.seo || {
		title: 'Video prehrávač | Play',
		metaDescription: 'Prehrávač videí - sledujte obľúbené videá online',
		thumbnailUrl: '/images/default-thumbnail.jpg',
		shareUrl: window.location.href,
		schemaOrg: '{}'
	};

	const videoData = data.video;
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.metaDescription} />

	<!-- Kanonická URL -->
	<link rel="canonical" href={seo.shareUrl} />

	<!-- Open Graph meta tagy pre Facebook -->
	<meta property="og:site_name" content="Play" />
	<meta property="og:url" content={seo.shareUrl} />
	<meta property="og:title" content={videoData?.name || 'Video prehrávač'} />
	<meta property="og:description" content={seo.metaDescription} />
	<meta property="og:image" content={seo.thumbnailUrl} />
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
	<meta name="twitter:description" content={seo.metaDescription} />
	<meta name="twitter:image" content={seo.thumbnailUrl} />

	<!-- Ďalšie užitočné meta tagy -->
	<meta
		name="keywords"
		content={`video, play, ${videoData?.name || ''}, ${videoData?.channel?.name || ''}`}
	/>

	<!-- Štruktúrované dáta pre Google (Schema.org) -->
	{@html `<script type="application/ld+json">${seo.schemaOrg}</script>`}
</svelte:head>

<div class="w-full max-w-none bg-black">
	{#if !videoData}
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
			<div class="video-wrapper aspect-w-16 aspect-h-9 mx-auto">
				<HLSPlayer videoUrl={videoData.videoUrl} autoplay={true} live={videoData.live} />
			</div>

			<!-- Video information -->
			<VideoInfo
				name={videoData.name}
				description={videoData.desc}
				isLive={videoData.live}
				channel={videoData.channel}
			/>

			<!-- Social Sharing Buttons -->
			<div class="mx-auto max-w-6xl py-8">
				<div class="flex justify-center gap-3">
					<!-- Facebook share button -->
					<button
						class="inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black px-4 py-2 text-white transition hover:bg-neutral-800"
						onclick={() =>
							window.open(
								`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(seo.shareUrl)}`,
								'_blank'
							)}
						title="Zdieľať na Facebooku"
					>
						<svg class="mr-2 h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"
							/>
						</svg>
						<span>Zdieľať</span>
					</button>

					<!-- Twitter share button -->
					<button
						class="inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black px-4 py-2 text-white transition hover:bg-neutral-800"
						onclick={() =>
							window.open(
								`https://twitter.com/intent/tweet?url=${encodeURIComponent(seo.shareUrl)}&text=${encodeURIComponent(videoData.name)}`,
								'_blank'
							)}
						title="Zdieľať na Twitteri"
					>
						<svg class="mr-2 h-5 w-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
							/>
						</svg>
						<span>Tweetovať</span>
					</button>

					<!-- General share button -->
					<button
						class="inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black px-4 py-2 text-white transition hover:bg-neutral-800"
						onclick={() => {
							if (navigator.share) {
								navigator.share({
									title: videoData.name,
									text: videoData.desc,
									url: seo.shareUrl
								});
							} else {
								navigator.clipboard.writeText(seo.shareUrl);
								alert('URL skopírovaná do schránky!');
							}
						}}
						title="Zdieľať video"
					>
						<svg
							class="mr-2 h-5 w-5 text-green-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
							/>
						</svg>
						<span>Zdieľať</span>
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.video-wrapper {
		max-width: 1200px;
	}
	@media screen and (min-height: 1200px) {
		.video-wrapper {
			max-width: 1536px;
		}
	}
</style>
