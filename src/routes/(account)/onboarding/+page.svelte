<script lang="ts">
	import { user } from '$lib/auth';
	import { goto } from '$app/navigation';

	$: userData = $user || { userId: '', email: '', fullName: '', avatarUrl: null, isVerified: false };

	// Nastavenia používateľa
	let settings = {
		theme: 'system', // 'light', 'dark', 'system'
		language: 'sk', // 'sk', 'en', 'cs', atď.
		notifications: {
			email: true,
			push: true
		}
	};

	// Stav nahrávania avatara
	let avatarFile: File | null = null;
	let isUploading = false;
	let uploadError: string | null = null;
	let avatarPreview: string | ArrayBuffer | null = null;

	// Stav formulára
	let isSaving = false;
	let formError: string | null = null;
	let formSuccess = false;

	// Zoznam dostupných jazykov
	const languages = [
		{ code: 'sk', name: 'Slovenčina' },
		{ code: 'en', name: 'English' },
		{ code: 'cs', name: 'Čeština' }
	];

	// Funkcia na spracovanie nahratia avatara
	function handleAvatarChange(event: Event) {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput && fileInput.files && fileInput.files[0]) {
			avatarFile = fileInput.files[0];

			// Zobrazenie náhľadu
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target) {
					avatarPreview = (e.target as FileReader).result;
				}
			};
			reader.readAsDataURL(avatarFile);
		}
	}

	// Funkcia na nahratie avatara na server
	async function uploadAvatar() {
		if (!avatarFile) return null;

		isUploading = true;
		uploadError = null;

		try {
			const formData = new FormData();
			formData.append('avatar', avatarFile);

			const response = await fetch('/api/users/avatar', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Nahrávanie avatara zlyhalo');
			}

			const data = await response.json();
			return data.avatarUrl;
		} catch (err) {
			if (err instanceof Error) {
				uploadError = err.message || 'Nepodarilo sa nahrať avatar';
			} else {
				uploadError = 'Nepodarilo sa nahrať avatar';
			}
			return null;
		} finally {
			isUploading = false;
		}
	}

	// Funkcia na uloženie kompletného profilu a nastavení
	async function saveProfile() {
		isSaving = true;
		formError = null;
		formSuccess = false;

		try {
			// Najprv nahráme avatar ak existuje
			let avatarUrl = userData.avatarUrl;
			if (avatarFile) {
				avatarUrl = await uploadAvatar();
				if (uploadError) throw new Error(uploadError);
			}

			// Aktualizujeme profil
			const profileData = {
				fullName: userData.fullName,
				avatarUrl,
				settings: {
					theme: settings.theme,
					language: settings.language,
					notifications: settings.notifications
				}
			};

			const response = await fetch('/api/users/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(profileData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Aktualizácia profilu zlyhala');
			}

			formSuccess = true;

			// Presmerovanie na protected po úspešnom onboardingu
			setTimeout(() => {
				goto('/protected');
			}, 1500);
		} catch (err) {
			formError = (err instanceof Error ? err.message : 'Nepodarilo sa uložiť nastavenia');
		} finally {
			isSaving = false;
		}
	}

	// Funkcia na preskočenie onboardingu
	function skipOnboarding() {
		goto('/protected');
	}
</script>

<svelte:head>
	<title>Onboarding</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
	<!-- Navigačná lišta -->
	<header class="bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex">
					<div class="flex flex-shrink-0 items-center">
						<a href="/" class="text-xl font-bold text-blue-600">Play</a>
					</div>
				</div>
				<div class="flex items-center">
					<button
						type="button"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
						on:click={skipOnboarding}
					>
						Preskočiť
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Hlavný obsah -->
	<main class="flex-grow">
		<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
			<div class="overflow-hidden rounded-2xl bg-white shadow">
				<div class="p-6 sm:p-10">
					<!-- Nadpis -->
					<div class="mb-10 text-center">
						<h1 class="text-3xl font-bold text-gray-900">Dokončite nastavenie svojho profilu</h1>
						<p class="mt-2 text-sm text-gray-600">
							Prispôsobte si svoje prostredie podľa vašich preferencií
						</p>
					</div>

					<!-- Formulár -->
					<form on:submit|preventDefault={saveProfile} class="space-y-8">
						<!-- Avatar a meno -->
						<div class="flex flex-col items-start gap-8 md:flex-row">
							<!-- Avatar upload -->
							<div class="flex flex-shrink-0 flex-col items-center">
								<div class="relative">
									<div
										class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border bg-gray-100"
									>
										{#if avatarPreview}
											<img src={typeof avatarPreview === 'string' ? avatarPreview : ''} alt="Avatar" class="h-full w-full object-cover" />
										{:else}
											<span class="text-5xl text-gray-400"
												>{userData.fullName ? userData.fullName[0]?.toUpperCase() : '?'}</span
											>
										{/if}
									</div>
									<label
										for="avatar-upload"
										class="absolute right-0 bottom-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow-md hover:bg-blue-700"
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
												d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									</label>
									<input
										id="avatar-upload"
										type="file"
										accept="image/*"
										class="hidden"
										on:change={handleAvatarChange}
									/>
								</div>
								<p class="mt-2 text-sm text-gray-500">Nahrať fotografiu</p>
								{#if uploadError}
									<p class="mt-1 text-sm text-red-600">{uploadError}</p>
								{/if}
							</div>

							<!-- Nastavenia používateľa -->
							<div class="flex-grow space-y-6">
								<!-- Meno používateľa -->
								<div>
									<label for="fullName" class="block text-sm font-medium text-gray-700"
										>Celé meno</label
									>
									<input
										type="text"
										id="fullName"
										bind:value={userData.fullName}
										class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
									/>
								</div>

								<!-- Email (len na zobrazenie) -->
								<div>
									<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
									<input
										type="email"
										id="email"
										value={userData.email}
										disabled
										class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm sm:text-sm"
									/>
								</div>

								<!-- Prihlásenie cez -->
								<!-- {#if user.providers && user.providers.length > 0}
									<div>
										<label for="providers" class="block text-sm font-medium text-gray-700">Prihlásenie cez</label>
										<div class="mt-1 flex gap-2">
											{#each user.providers as provider}
												<div
													class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
												>
													{provider}
												</div>
											{/each}
										</div>
									</div>
								{/if} -->
							</div>
						</div>

						<hr class="my-8" />

						<!-- Nastavenia rozhrania -->
						<div>
							<h3 class="mb-4 text-lg font-medium text-gray-900">Nastavenia rozhrania</h3>

							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<!-- Téma -->
								<div>
									<label for="theme" class="block text-sm font-medium text-gray-700">Téma</label>
									<select
										id="theme"
										bind:value={settings.theme}
										class="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
									>
										<option value="system">Systémová</option>
										<option value="light">Svetlá</option>
										<option value="dark">Tmavá</option>
									</select>
								</div>

								<!-- Jazyk -->
								<div>
									<label for="language" class="block text-sm font-medium text-gray-700">Jazyk</label
									>
									<select
										id="language"
										bind:value={settings.language}
										class="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
									>
										{#each languages as language}
											<option value={language.code}>{language.name}</option>
										{/each}
									</select>
								</div>
							</div>
						</div>

						<!-- Nastavenia notifikácií -->
						<div>
							<h3 class="mb-4 text-lg font-medium text-gray-900">Nastavenia notifikácií</h3>

							<div class="space-y-4">
								<!-- Emailové notifikácie -->
								<div class="flex items-start">
									<div class="flex h-5 items-center">
										<input
											id="email-notifications"
											type="checkbox"
											bind:checked={settings.notifications.email}
											class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
									</div>
									<div class="ml-3 text-sm">
										<label for="email-notifications" class="font-medium text-gray-700"
											>Emailové notifikácie</label
										>
										<p class="text-gray-500">Dostávať dôležité aktualizácie a novinky na email</p>
									</div>
								</div>

								<!-- Push notifikácie -->
								<div class="flex items-start">
									<div class="flex h-5 items-center">
										<input
											id="push-notifications"
											type="checkbox"
											bind:checked={settings.notifications.push}
											class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
									</div>
									<div class="ml-3 text-sm">
										<label for="push-notifications" class="font-medium text-gray-700"
											>Push notifikácie</label
										>
										<p class="text-gray-500">Dostávať upozornenia priamo vo webovom prehliadači</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Chybové a úspešné hlásenia -->
						{#if formError}
							<div class="rounded-md bg-red-50 p-4">
								<div class="flex">
									<div class="flex-shrink-0">
										<svg
											class="h-5 w-5 text-red-400"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											aria-hidden="true"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
									<div class="ml-3">
										<p class="text-sm font-medium text-red-800">{formError}</p>
									</div>
								</div>
							</div>
						{/if}

						{#if formSuccess}
							<div class="rounded-md bg-green-50 p-4">
								<div class="flex">
									<div class="flex-shrink-0">
										<svg
											class="h-5 w-5 text-green-400"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											aria-hidden="true"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
									<div class="ml-3">
										<p class="text-sm font-medium text-green-800">
											Nastavenia boli úspešne uložené! Presmerovávam vás na protected...
										</p>
									</div>
								</div>
							</div>
						{/if}

						<!-- Tlačidlá -->
						<div class="flex justify-end gap-4">
							<button
								type="button"
								class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
								on:click={skipOnboarding}
							>
								Neskôr
							</button>
							<button
								type="submit"
								class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
								disabled={isSaving}
							>
								{#if isSaving}
									<svg
										class="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Ukladám...
								{:else}
									Uložiť a pokračovať
								{/if}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</main>

	<!-- Päta -->
	<footer class="bg-white">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<p class="text-center text-sm text-gray-500">&copy; 2025 Play. Všetky práva vyhradené.</p>
		</div>
	</footer>
</div>
