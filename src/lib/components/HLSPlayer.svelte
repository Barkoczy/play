<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Hls from 'hls.js';
	import {
		Play,
		Pause,
		Volume2,
		VolumeX,
		Maximize,
		Minimize,
		RefreshCw,
		AlertTriangle
	} from 'lucide-svelte';
	import type { QualityLevel, RecoveryAttempts } from '../types/videoPlayer';

	// Props
	const { videoUrl = '', autoplay = true, live = false } = $props();

	// Player states
	let videoRef: HTMLVideoElement;
	let videoContainer: HTMLDivElement;
	let hlsInstance: Hls | null = $state(null);
	let isLoading = $state(true);
	let hasError = $state(false);
	let recoveryAttempts: RecoveryAttempts = $state({});
	let errorMessage = $state('');
	let isPlaying = $state(false);
	let isMuted = $state(false);
	let volume = $state(1);
	let isFullscreen = $state(false);
	let isBuffering = $state(false);
	let progress = $state(0);
	let duration = $state(0);
	let currentTime = $state(0);
	let bufferEnd = $state(0);
	let qualityLevels: QualityLevel[] = $state([]);
	let currentQuality = $state('auto');
	let containerWidth = $state(0);
	let previousVideoUrl = $state('');
	let isInitializing = false;
	
	// Nové premenné pre vlastný dropdown
	let displayQuality = $state('Auto');
	let selectedQualityId = $state('auto');
	let isQualityMenuOpen = $state(false);

	const formatTime = (seconds: number) => {
		if (isNaN(seconds) || seconds < 0) return '00:00';
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	function initPlayer() {
		if (!videoUrl || !videoRef || isInitializing) return;

		isInitializing = true;
		isLoading = true;
		hasError = false;

		// Check if HLS.js is supported
		if (Hls.isSupported()) {
			// Destroy previous instance if exists
			if (hlsInstance) {
				hlsInstance.destroy();
				hlsInstance = null;
			}

			// Create new HLS instance with optimized stability settings
			hlsInstance = new Hls({
				enableWorker: true,
				lowLatencyMode: false,
				backBufferLength: 120,
				liveSyncDuration: 12,
				liveMaxLatencyDuration: 60,
				liveDurationInfinity: true,
				highBufferWatchdogPeriod: 8,
				fragLoadingTimeOut: 90000,
				manifestLoadingTimeOut: 90000,
				levelLoadingTimeOut: 90000,
				maxBufferLength: 300,
				maxBufferSize: 150 * 1000 * 1000,
				startLevel: -1,
				autoStartLoad: true,
				maxMaxBufferLength: 600,
				abrEwmaDefaultEstimate: 1000000,
				abrEwmaFastLive: 2.0,
				abrEwmaSlowLive: 15.0,
				startFragPrefetch: true,
				nudgeMaxRetry: 20,
				nudgeOffset: 0.5,
				maxFragLookUpTolerance: 0.5,
				maxLoadingDelay: 8,
				maxStarvationDelay: 8000,
				fragLoadPolicy: {
					default: {
						maxTimeToFirstByteMs: 30000,
						maxLoadTimeMs: 180000,
						timeoutRetry: { maxNumRetry: 3, retryDelayMs: 1000, maxRetryDelayMs: 5000 },
						errorRetry: { maxNumRetry: 3, retryDelayMs: 1000, maxRetryDelayMs: 5000 }
					}
				},
				appendErrorMaxRetry: 5
			});

			// Add event listeners
			hlsInstance.on(Hls.Events.MEDIA_ATTACHED, () => {
				console.log('HLS media attached');
			});

			hlsInstance.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
				console.log('HLS manifest parsed');
				isLoading = false;

				// Get available quality levels
				if (data.levels && data.levels.length > 0) {
					qualityLevels = data.levels.map((level, index) => ({
						id: index,
						height: level.height,
						bitrate: level.bitrate
					}));
				}

				// Mobile device detection
				const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				);

				// Set initial quality for mobile devices
				if (isMobile && hlsInstance) {
					hlsInstance.startLevel = 2; // Set the lowest quality for mobile devices
					if (videoRef) videoRef.volume = 0.5;
				}

				if (autoplay) {
					videoRef.play().catch((error) => {
						console.error('Auto-play failed:', error);
						// Try with muted if autoplay fails
						videoRef.muted = true;
						isMuted = true;
						videoRef.play().catch((e) => console.error('Muted autoplay failed too:', e));
					});
				}
			});

			hlsInstance.on(Hls.Events.ERROR, (event, data) => {
				console.error('HLS error:', data);

				// If not fatal, just log and continue
				if (!data.fatal) {
					// Special handling for bufferStalledError
					if (data.details === 'bufferStalledError') {
						setTimeout(() => {
							isBuffering = false;
						}, 1000);
					}
					console.log('Non-fatal error, continuing playback');
					return;
				}

				// Set recovery attempt counter for different error types
				const maxRecoveryAttempts = 3;
				const recoveryKey = `${data.type}_${data.details}`;
				recoveryAttempts[recoveryKey] = (recoveryAttempts[recoveryKey] || 0) + 1;

				if (recoveryAttempts[recoveryKey] <= maxRecoveryAttempts) {
					switch (data.type) {
						case Hls.ErrorTypes.NETWORK_ERROR:
							console.log(
								`Recovery attempt ${recoveryAttempts[recoveryKey]}/${maxRecoveryAttempts} for network error`
							);
							hlsInstance?.startLoad();
							break;
						case Hls.ErrorTypes.MEDIA_ERROR:
							console.log(
								`Recovery attempt ${recoveryAttempts[recoveryKey]}/${maxRecoveryAttempts} for media error`
							);
							hlsInstance?.recoverMediaError();
							break;
						default:
							// Unrecoverable error
							hasError = true;
							errorMessage = `Fatal error: ${data.details}`;
							hlsInstance?.destroy();
							break;
					}
				} else {
					// We've exhausted recovery attempts
					hasError = true;
					errorMessage = `Could not recover after ${maxRecoveryAttempts} attempts: ${data.details}`;
					hlsInstance?.destroy();
				}
			});

			hlsInstance.on(Hls.Events.BUFFER_APPENDING, () => {
				isBuffering = true;
			});

			hlsInstance.on(Hls.Events.FRAG_BUFFERED, () => {
				isBuffering = false;
				if (videoRef && videoRef.buffered.length) {
					bufferEnd = videoRef.buffered.end(videoRef.buffered.length - 1);
				}
			});

			// Attach media and load source
			hlsInstance.attachMedia(videoRef);
			hlsInstance.loadSource(videoUrl);
		} else if (videoRef.canPlayType('application/vnd.apple.mpegurl')) {
			// For Safari which has native HLS support
			videoRef.src = videoUrl;
			videoRef.addEventListener('loadedmetadata', () => {
				isLoading = false;
				if (autoplay) {
					videoRef.play().catch((error) => {
						console.error('Auto-play failed:', error);
						// Try with muted if autoplay fails
						videoRef.muted = true;
						isMuted = true;
						videoRef.play().catch((e) => console.error('Muted autoplay failed too:', e));
					});
				}
			});

			videoRef.addEventListener('error', () => {
				hasError = true;
				errorMessage = 'Video loading failed';
				isLoading = false;
			});
		} else {
			hasError = true;
			errorMessage = 'HLS is not supported in your browser';
			isLoading = false;
		}

		setTimeout(() => {
			isInitializing = false;
		}, 500);
	}

	function togglePlay() {
		if (!videoRef) return;

		if (videoRef.paused) {
			videoRef.play();
		} else {
			videoRef.pause();
		}
	}

	function toggleMute() {
		if (!videoRef) return;

		videoRef.muted = !videoRef.muted;
		isMuted = videoRef.muted;
	}

	function handleVolumeChange(event: Event) {
		if (!videoRef) return;

		const target = event.target as HTMLInputElement;
		if (target) {
			volume = parseFloat(target.value);
		}
		videoRef.volume = volume;

		// Auto-unmute when increasing volume from zero
		if (volume > 0 && isMuted) {
			toggleMute();
		}
	}

	function toggleFullscreen() {
		if (!videoContainer) return;

		if (!document.fullscreenElement) {
			videoContainer.requestFullscreen().catch((err) => {
				console.error(`Error attempting to enable fullscreen: ${err.message}`);
			});
		} else {
			document.exitFullscreen();
		}
	}

	// Upravená funkcia na nastavenie kvality videa
	function setQualityLevel(level: string | number) {
		if (!hlsInstance) return;
		
		// Konvertovanie level na string pre konzistentnosť
		const levelStr = String(level);
		
		if (levelStr === 'auto') {
			hlsInstance.currentLevel = -1; // Auto
			displayQuality = 'Auto';
			selectedQualityId = 'auto';
			currentQuality = 'auto';
		} else {
			// Konvertovanie na číslo pre HLS.js API
			const levelNum = parseInt(levelStr);
			hlsInstance.currentLevel = levelNum;
			
			// Nájdi zvolený level a aktualizuj zobrazovanú kvalitu
			const selectedLevel = qualityLevels.find(q => q.id === levelNum);
			if (selectedLevel) {
				displayQuality = `${selectedLevel.height}p`;
			}
			
			// Aktualizácia ID pre select element
			selectedQualityId = levelStr;
			currentQuality = levelStr;
			
			console.log(`Kvalita nastavená na: ${displayQuality}`);
		}
	}

	function handleTimeUpdate() {
		if (!videoRef) return;

		currentTime = videoRef.currentTime;
		duration = videoRef.duration || 0;

		if (duration > 0) {
			progress = (currentTime / duration) * 100;
		}
	}

	function refreshStream() {
		if (hlsInstance) {
			isLoading = true;
			hlsInstance.stopLoad();
			hlsInstance.startLoad();

			// Force reload after a short delay if the stream doesn't recover
			setTimeout(() => {
				if (isLoading) {
					initPlayer();
				}
			}, 3000);
		} else {
			initPlayer();
		}

		// Reset recovery attempts counter
		recoveryAttempts = {};
	}

	// Event handlers
	function handlePlayEvent() {
		isPlaying = true;
	}

	function handlePauseEvent() {
		isPlaying = false;
	}

	function handleFullscreenChange() {
		isFullscreen = !!document.fullscreenElement;
	}

	function handleWaiting() {
		isBuffering = true;
	}

	function handlePlaying() {
		isBuffering = false;
	}

	function handleCanPlay() {
		isLoading = false;
	}

	// Funkcia na zatvorenie dropdown menu pri kliknutí mimo
	function handleClickOutside(event: MouseEvent) {
		if (isQualityMenuOpen && videoContainer) {
			const target = event.target as HTMLElement;
			const qualityDropdown = videoContainer.querySelector('.quality-dropdown');
			if (qualityDropdown && !qualityDropdown.contains(target)) {
				isQualityMenuOpen = false;
			}
		}
	}

	function setupEventListeners() {
		if (!videoRef) return;

		videoRef.addEventListener('play', handlePlayEvent);
		videoRef.addEventListener('pause', handlePauseEvent);
		videoRef.addEventListener('timeupdate', handleTimeUpdate);
		videoRef.addEventListener('waiting', handleWaiting);
		videoRef.addEventListener('playing', handlePlaying);
		videoRef.addEventListener('canplay', handleCanPlay);
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		document.addEventListener('click', handleClickOutside);
	}

	function cleanupEventListeners() {
		if (!videoRef) return;

		videoRef.removeEventListener('play', handlePlayEvent);
		videoRef.removeEventListener('pause', handlePauseEvent);
		videoRef.removeEventListener('timeupdate', handleTimeUpdate);
		videoRef.removeEventListener('waiting', handleWaiting);
		videoRef.removeEventListener('playing', handlePlaying);
		videoRef.removeEventListener('canplay', handleCanPlay);
		document.removeEventListener('fullscreenchange', handleFullscreenChange);
		document.removeEventListener('click', handleClickOutside);
	}

	onMount(() => {
		if (videoRef) {
			// Initialize player when component mounts
			initPlayer();
			setupEventListeners();
		}
	});

	onDestroy(() => {
		// Clean up when component is destroyed
		if (hlsInstance) {
			hlsInstance.destroy();
		}

		cleanupEventListeners();
	});

	// Watch for videoUrl changes and re-initialize player
	$effect(() => {
		if (videoUrl && videoRef && videoUrl !== previousVideoUrl) {
			previousVideoUrl = videoUrl;
			initPlayer();
		}
	});
</script>

<!-- Video container with 16:9 aspect ratio -->
<div class="relative w-full pb-[56.25%]">
	<div
		class="video-container absolute inset-0 bg-black"
		bind:this={videoContainer}
		bind:clientWidth={containerWidth}
	>
		<!-- Video Player -->
		<!-- svelte-ignore a11y_media_has_caption -->
		<video
			bind:this={videoRef}
			class="h-full w-full cursor-pointer"
			playsinline
			onclick={togglePlay}
			class:opacity-0={isLoading || hasError}
		></video>

		<!-- Loading Indicator -->
		{#if isLoading}
			<div class="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
				<div
					class="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"
				></div>
				<p class="text-gray-200">Načítavanie streamu...</p>
			</div>
		{/if}

		<!-- Buffering Indicator -->
		{#if isBuffering && !isLoading}
			<div
				class="absolute right-4 bottom-20 flex items-center gap-1.5 rounded-lg bg-black/80 px-3 py-1.5 text-sm"
			>
				<div
					class="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-red-500"
				></div>
				<span>Buffering...</span>
			</div>
		{/if}

		<!-- Error Message -->
		{#if hasError}
			<div
				class="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center"
			>
				<AlertTriangle size={48} class="mb-4 text-red-500" />
				<h3 class="mb-2 text-xl font-bold text-white">Chyba pri načítaní streamu</h3>
				<p class="mb-6 text-gray-300">{errorMessage}</p>
				<button
					onclick={refreshStream}
					class="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700"
				>
					<RefreshCw size={16} />
					Skúsiť znova
				</button>
			</div>
		{/if}

		<!-- Player Controls -->
		<div
			class="player-controls absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-12 pb-4"
		>
			<!-- Progress bar -->
			<div class="relative mb-4 h-1 w-full cursor-pointer rounded-full bg-gray-700 overflow-hidden">
				<div
					class="absolute top-0 left-0 h-full rounded-full bg-red-600"
					style="width: {progress}%"
				></div>
				<div
					class="absolute top-0 left-0 h-full rounded-full bg-gray-600/50"
					style="width: {(bufferEnd / (duration || 1)) * 100}%"
				></div>
			</div>

			<div class="flex items-center gap-4">
				<!-- Play/Pause button -->
				<button
					class="text-white transition-colors hover:text-red-500"
					onclick={togglePlay}
					aria-label={isPlaying ? 'Pozastaviť' : 'Prehrať'}
				>
					{#if isPlaying}
						<Pause size={24} />
					{:else}
						<Play size={24} />
					{/if}
				</button>

				<!-- Volume control -->
				<div class="flex items-center gap-2">
					<button
						class="text-white transition-colors hover:text-red-500"
						onclick={toggleMute}
						aria-label={isMuted ? 'Zapnúť zvuk' : 'Stlmiť'}
					>
						{#if isMuted || volume === 0}
							<VolumeX size={20} />
						{:else}
							<Volume2 size={20} />
						{/if}
					</button>

					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						class="slider w-20 md:w-32"
						value={volume}
						oninput={handleVolumeChange}
						disabled={isMuted}
					/>
				</div>

				<!-- Time display -->
				<div class="ml-auto hidden text-sm text-gray-300 sm:block">
					<span>{formatTime(currentTime)}</span>
					{#if live}
						<span class="mx-1">/</span>
						<span class="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">LIVE</span>
					{/if}
				</div>

				<!-- Custom Quality selector dropdown -->
				{#if qualityLevels.length > 0}
					<div class="relative hidden sm:block quality-dropdown">
						<button
							type="button"
							class="flex items-center rounded bg-gray-800 px-2 py-1 text-sm"
							onclick={() => isQualityMenuOpen = !isQualityMenuOpen}
						>
							<span>{displayQuality}</span>
							<svg
								class="ml-1 h-4 w-4 transform transition-transform"
								class:rotate-180={isQualityMenuOpen}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
							</svg>
						</button>
						
						{#if isQualityMenuOpen}
							<div class="absolute right-0 top-full z-50 mt-1 w-24 overflow-hidden rounded bg-gray-800 shadow-lg">
								<button
									class="block w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
									class:bg-gray-700={selectedQualityId === 'auto'}
									onclick={() => {
										setQualityLevel('auto');
										isQualityMenuOpen = false;
									}}
								>
									Auto
								</button>
								
								{#each qualityLevels as level}
									<button
										class="block w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
										class:bg-gray-700={selectedQualityId === String(level.id)}
										onclick={() => {
											setQualityLevel(level.id);
											isQualityMenuOpen = false;
										}}
									>
										{level.height}p
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/if}

				<!-- Refresh button -->
				<button
					class="text-white transition-colors hover:text-red-500"
					onclick={refreshStream}
					aria-label="Obnoviť stream"
				>
					<RefreshCw size={20} />
				</button>

				<!-- Fullscreen button -->
				<button
					class="text-white transition-colors hover:text-red-500"
					onclick={toggleFullscreen}
					aria-label={isFullscreen ? 'Ukončiť celú obrazovku' : 'Celá obrazovka'}
				>
					{#if isFullscreen}
						<Minimize size={20} />
					{:else}
						<Maximize size={20} />
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.video-container:hover .player-controls {
		opacity: 1;
	}

	.player-controls {
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	/* YouTube-like slider styles */
	.slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 3px;
		border-radius: 5px;
		background: #4d4d4d;
		outline: none;
		transition: height 0.2s ease;
	}

	.slider:hover {
		height: 5px;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #ff0000;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.slider:hover::-webkit-slider-thumb {
		transform: scale(1.2);
	}

	.slider::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #ff0000;
		cursor: pointer;
		border: none;
		transition: transform 0.2s ease;
	}

	.slider:hover::-moz-range-thumb {
		transform: scale(1.2);
	}
</style>