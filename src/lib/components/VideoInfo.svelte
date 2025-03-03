<script lang="ts">
    let videoName: string = '';
    let isLive: boolean = true;
    let description: string = '';
    let channel = { 
        name: '', 
        desc: '',
        subscribers: 0
    };
    
    // Formátovanie počtu odberateľov (napr. 125,000 -> 125K)
    function formatSubscribers(count: number) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }
</script>

<!-- Video info section, YouTube-like styling -->
<div class="mx-auto max-w-6xl px-4">
    <div class="mt-4 rounded-lg bg-zinc-900 p-4 shadow-lg">
        <div class="flex flex-col space-y-4">
            <!-- Title and status -->
            <div class="flex items-start justify-between">
                <div>
                    <h2 class="text-xl font-bold text-white md:text-2xl">{videoName}</h2>
                    <p class="mt-1 text-sm text-gray-400">
                        {#if isLive}
                            <span class="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">LIVE</span>
                        {/if}
                        <span class="ml-2">{description || 'Low-latency HLS stream powered by NVIDIA NVENC'}</span>
                    </p>
                </div>
            </div>

            <!-- Channel info and buttons, YouTube-like -->
            <div class="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-4">
                <div class="flex items-center space-x-3">
                    <div class="h-10 w-10 overflow-hidden rounded-full bg-zinc-700">
                        <!-- Channel avatar placeholder -->
                        <div class="flex h-full w-full items-center justify-center bg-red-600 text-white">
                            <span class="text-lg font-bold">{channel.name?.charAt(0)?.toUpperCase() || 'C'}</span>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold text-white">{channel.name || 'Channel'}</h3>
                        <p class="text-xs text-gray-400">
                            {formatSubscribers(channel.subscribers)} odberateľov · {channel.desc || 'Hardware accelerated streaming'}
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