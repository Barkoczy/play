<script lang="ts">
	import AuthTestComponent from '$lib/components/AuthTestComponent.svelte';
</script>

<div class="container">
	<h1>Authentication Debug Page</h1>

	<p>
		Táto stránka slúži na testovanie a debugging autentifikácie v aplikácii. Nižšie vidíš komponent,
		ktorý zobrazuje aktuálny stav autentifikácie.
	</p>

	<AuthTestComponent />

	<div class="manual-test">
		<h2>Manuálne testovanie cookies</h2>

		<button
			on:click={() => {
				// Vypíš všetky cookies
				console.log('All document cookies:', document.cookie);

				// Vypíš jednotlivé cookies
				const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
				console.log('Individual cookies:', cookies);

				// Skontroluj, či existuje auth_token a refresh_token
				const hasAuthToken = cookies.some((cookie) => cookie.startsWith('auth_token='));
				const hasRefreshToken = cookies.some((cookie) => cookie.startsWith('refresh_token='));

				console.log('Cookie presence:', { hasAuthToken, hasRefreshToken });
			}}
		>
			Vypísať cookies do konzoly
		</button>

		<button
			on:click={() => {
				// Nastav testovacie cookies
				document.cookie = `auth_token=test-token;Path=/;SameSite=Lax;Max-Age=86400`;
				document.cookie = `refresh_token=test-refresh;Path=/;SameSite=Lax;Max-Age=86400`;

				alert('Testovacie cookies nastavené. Obnov stránku pre ich načítanie.');
			}}
		>
			Nastaviť testovacie cookies
		</button>

		<button
			on:click={() => {
				// Vymaž cookies
				document.cookie = 'auth_token=;Path=/;Max-Age=0';
				document.cookie = 'refresh_token=;Path=/;Max-Age=0';

				alert('Cookies vymazané. Obnov stránku pre potvrdenie.');
			}}
		>
			Vymazať cookies
		</button>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.manual-test {
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background-color: #f9f9f9;
	}

	button {
		margin-right: 1rem;
		margin-bottom: 1rem;
		padding: 0.5rem 1rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}
</style>
