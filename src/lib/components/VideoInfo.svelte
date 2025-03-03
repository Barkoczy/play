<script lang="ts">
    const { 
        name = '', 
        description = '', 
        isLive = false,
        channel = { name: '', desc: '', subscribers: 0 }
    } = $props();

    function formatSubscribers(count: number): string {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }
</script>

<!-- Video information panel -->
<div class="mx-auto max-w-6xl px-4">
    <div class="mt-4 rounded-lg bg-zinc-900 p-4 shadow-lg">
        <div class="flex flex-col space-y-4">
            <!-- Title and status -->
            <div class="flex items-start justify-between">
                <div>
                    <h2 class="flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
                        {#if isLive}
                            <span class="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">LIVE</span>
                        {/if}
                        <span>{name}</span>
                    </h2>
                    <p class="mt-1 text-sm text-gray-400">
                        <span>{description}</span>
                    </p>
                </div>
            </div>

            <!-- Channel info -->
            <div class="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-4">
                <div class="flex items-center space-x-3">
                    <div class="h-10 w-10 overflow-hidden rounded-full bg-zinc-700">
                        <div class="flex h-full w-full items-center justify-center bg-red-600 text-white">
                            <span class="text-lg font-bold">{channel.name.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold text-white">{channel.name}</h3>
                        <p class="text-xs text-gray-400">
                            {formatSubscribers(channel.subscribers)} odberateľov · {channel.desc}
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