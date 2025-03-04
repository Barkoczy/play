<script lang="ts">
	let isMenuOpen = $state(false);
	let isUserMenuOpen = $state(false);
	let isDarkMode = $state(true);
	let searchQuery = $state('');
	
	function toggleMenu() {
		console.log("Menu pred:", isMenuOpen);
		isMenuOpen = !isMenuOpen;
		console.log("Menu po:", isMenuOpen);
	}
	
	function toggleUserMenu() {
		isUserMenuOpen = !isUserMenuOpen;
	}
	
	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		document.documentElement.classList.toggle('dark');
	}
</script>

<header class="sticky top-0 z-10 w-full border-b border-neutral-800 bg-black text-white">
	<div class="mx-auto flex items-center justify-between px-4 py-3">
		<!-- Left section with logo and menu -->
		{@render hamburger()}

		<!-- Center section with search -->
		<div class="w-1/2">
			<div class="relative flex w-full items-center">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Hľadať"
					class="w-full rounded-l-full border border-neutral-700 bg-neutral-900 px-4 py-2 focus:border-neutral-600 focus:outline-none"
				/>
				<button
					class="rounded-r-full border border-l-0 border-neutral-700 bg-neutral-800 px-4 h-[42px] hover:bg-neutral-700"
					aria-label="Vyhľadať"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Right section with user controls -->
		<div class="flex items-center gap-2">
			<button
				class="hidden rounded-full p-2 transition-colors hover:bg-neutral-800 md:block"
				onclick={toggleDarkMode}
				aria-label="Prepnúť tmavý režim"
			>
				{#if isDarkMode}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						/>
					</svg>
				{/if}
			</button>

			<button
				class="rounded-full p-2 transition-colors hover:bg-neutral-800"
				aria-label="Nahrať video"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
			</button>

			<button
				class="rounded-full p-2 transition-colors hover:bg-neutral-800"
				aria-label="Notifikácie"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					/>
				</svg>
			</button>

			<div class="relative">
				<button
					class="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 font-bold text-white transition-colors hover:bg-red-700"
					onclick={toggleUserMenu}
					aria-label="Používateľské menu"
				>
					U
				</button>

				{#if isUserMenuOpen}
					<div
						class="user-menu absolute right-0 z-10 mt-2 w-48 rounded-md border border-neutral-800 bg-neutral-900 py-1 shadow-lg"
					>
						<a href="/profile" class="block px-4 py-2 hover:bg-neutral-800">Môj profil</a>
						<a href="/settings" class="block px-4 py-2 hover:bg-neutral-800">Nastavenia</a>
						<div class="my-1 border-t border-neutral-800"></div>
						<a href="/logout" class="block px-4 py-2 hover:bg-neutral-800">Odhlásiť sa</a>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Live banner -->
	<div class="border-t border-neutral-800 bg-black py-2 text-white">
		<div class="container mx-auto px-4">
			<div class="flex items-center">
				<span class="mr-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white"
					>LIVE</span
				>
				<span class="text-sm">Nová filmová premiéra - Zaklínač: Sirény z hlbín 2025</span>
			</div>
		</div>
	</div>
</header>

{#if isMenuOpen}
  <div class="fixed left-0 top-0 bottom-0 z-50 flex">
    <div class="w-64 h-screen overflow-y-auto border-r border-neutral-800 bg-black">
      <div class="p-4">
        <div class="mb-6 flex items-center gap-2 text-white">
          {@render hamburger()}
        </div>

        <nav>
          <ul class="space-y-1 text-white">
            <li>
              <a
                href="/"
                class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Domov</span>
              </a>
            </li>
            <li>
              <a
                href="/trending"
                class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span>Trending</span>
              </a>
            </li>
            <li>
              <a
                href="/subscriptions"
                class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span>Odbery</span>
              </a>
            </li>
            <li>
              <a
                href="/library"
                class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
                <span>Knižnica</span>
              </a>
            </li>
            <li>
              <a
                href="/history"
                class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>História</span>
              </a>
            </li>
          </ul>

          <div class="my-4 border-t border-neutral-800"></div>

          <div class="px-3 py-2 text-sm text-neutral-400">Kategórie</div>
          <ul class="space-y-1 text-white">
            <li>
              <a
                href="/category/movies"
                class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
                <span>Filmy</span>
              </a>
            </li>
            <li>
              <a
                href="/category/gaming"
                class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                  />
                </svg>
                <span>Gaming</span>
              </a>
            </li>
            <li>
              <a
                href="/category/music"
                class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <span>Hudba</span>
              </a>
            </li>
            <li>
              <a
                href="/category/live"
                class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Živé vysielanie</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    
    <!-- Overlay na zatvorenie -->
    <button 
      class="flex-1 bg-black bg-opacity-50"
      onclick={toggleMenu}
      onkeydown={(e) => e.key === 'Enter' && toggleMenu()}
      aria-label="Close menu"
    ></button>
  </div>
{/if}


{#snippet hamburger()}
  <div class="flex items-center gap-4">
    <button
      class="rounded-full p-2 transition-colors hover:bg-neutral-800"
      onclick={toggleMenu}
      aria-label="Menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <a href="/" class="flex items-center gap-1 text-xl font-bold">
      <span class="text-red-600">Play</span>
    </a>
  </div>
{/snippet}