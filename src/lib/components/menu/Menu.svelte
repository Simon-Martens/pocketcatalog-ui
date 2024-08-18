<script lang="ts">
	import { page } from '$app/stores';
	import Alert from '$lib/components/Alert.svelte';
	import { loggedIn } from '$stores/pocketbase';
	import { fly } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';
</script>

<div
	class="flex flex-col gap-x-2 max-h-screen sticky top-0 border-r px-4 py-4 border-slate-300"
	class:border-r={$loggedIn}>
	<div class="w-12 h-12 border border-slate-500 mb-8"></div>
	{#if $loggedIn}
		<nav
			class="flex flex-col gap-y-3 grow"
			in:fly|global={{ x: -30, duration: 450, easing: sineInOut }}
			out:fly|global={{ x: -30, duration: 450, easing: sineInOut }}>
			<a href="/entities/reihen" aria-current={$page.url.pathname.toLowerCase().startsWith('/entities/reihen')}>
				<i class="ri-organization-chart" />
			</a>
			<a href="/entities/aufnahme" aria-current={$page.url.pathname.toLowerCase().startsWith('/entities/aufnahme')}>
				<i class="ri-book-2-line"></i>
			</a>
			<a href="/entities/inhalte" aria-current={$page.url.pathname.toLowerCase().startsWith('/entities/inhalte')}>
				<i class="ri-article-line"></i>
			</a>
			<a href="/entities/akteure" aria-current={$page.url.pathname.toLowerCase().startsWith('/entities/akteure')}>
				<i class="ri-group-line" />
			</a>
		</nav>
	{:else}
		<div class="grow"></div>
	{/if}

	<Alert />
</div>

<style>
	nav a {
		@apply text-center w-full text-2xl;
	}

	nav a:hover {
		@apply text-zinc-900 border-zinc-400;
	}

	nav a {
		@apply p-1.5 text-zinc-600 hover:text-zinc-900 rounded-lg box-border border-2 border-transparent transition-all duration-100;
	}

	nav a[aria-current='true'] {
		@apply border-2 shadow border-zinc-800 text-zinc-900 pointer-events-none;
	}
</style>
