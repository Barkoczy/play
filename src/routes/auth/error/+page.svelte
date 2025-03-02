<!-- /src/routes/auth/error/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let errorMessage: string = 'An unknown error occurred during authentication.';

	onMount(() => {
		// Získanie parametrov z URL
		const urlMessage = $page.url.searchParams.get('message');
		if (urlMessage) {
			errorMessage = urlMessage;
		}
	});
</script>

<div class="error-container">
	<h1>Authentication Error</h1>

	<div class="error-box">
		<h2>Login Failed</h2>
		<p>{errorMessage}</p>

		<div class="actions">
			<a href="/login" class="button">Back to Login</a>
			<a href="/" class="button secondary">Go to Homepage</a>
		</div>
	</div>
</div>

<style>
	.error-container {
		max-width: 600px;
		margin: 40px auto;
		padding: 20px;
	}

	.error-box {
		background-color: #f8f9fa;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 30px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	}

	h1 {
		color: #333;
		margin-bottom: 20px;
		font-size: 1.8rem;
	}

	h2 {
		color: #dc3545;
		margin-bottom: 15px;
		font-size: 1.3rem;
	}

	p {
		color: #666;
		margin-bottom: 25px;
		line-height: 1.5;
	}

	.actions {
		display: flex;
		gap: 15px;
		margin-top: 20px;
	}

	.button {
		display: inline-block;
		padding: 10px 20px;
		background-color: #0d6efd;
		color: white;
		text-decoration: none;
		border-radius: 5px;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.button:hover {
		background-color: #0b5ed7;
	}

	.button.secondary {
		background-color: #6c757d;
	}

	.button.secondary:hover {
		background-color: #5c636a;
	}
</style>
