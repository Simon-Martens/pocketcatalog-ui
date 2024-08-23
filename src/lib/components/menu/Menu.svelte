<script lang="ts">
	import { page } from '$app/stores';
	import { loggedIn } from '$stores/pocketbase';
	import { fly } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';
</script>

<div class="flex flex-row gap-y-2 w-full sticky top-0 border-b px-8 border-slate-300" class:border-r={$loggedIn}>
	<div class="w-12 h-12 border border-slate-500 mr-4"></div>
	{#if $loggedIn}
		<nav
			class="flex flex-row gap-x-3 grow"
			in:fly|global={{ x: -30, duration: 450, easing: sineInOut }}
			out:fly|global={{ x: -30, duration: 450, easing: sineInOut }}>
			<a href="/Aufnahme" aria-current={$page.url.pathname.toLowerCase().startsWith('/aufnahme')}>
				<i class="ri-book-2-line"></i> <span class="name">Aufnahme</span>
			</a>
			<a href="/entities/Inhalte" aria-current={$page.url.pathname.toLowerCase().startsWith('/entities/inhalte')}>
				<i class="ri-article-line"></i> <span class="name">Inhalte</span>
			</a>
			<div class="grow"></div>
			<a href="/entities/Reihen" aria-current={$page.url.pathname.toLowerCase().startsWith('/entities/reihen')}>
				<i class="ri-organization-chart"></i> <span class="name">Reihen</span>
			</a>
			<a href="/entities/Akteure" aria-current={$page.url.pathname.toLowerCase().startsWith('/entities/akteure')}>
				<i class="ri-group-line"></i> <span class="name">Akteure</span>
			</a>
			<a href="/entities/Orte" aria-current={$page.url.pathname.toLowerCase().startsWith('/entities/orte')}>
				<i class="ri-map-pin-line"></i> <span class="name">Orte</span>
			</a>
		</nav>
	{:else}
		<div class="grow"></div>
	{/if}
</div>

<style>
	nav a {
		@apply text-center text-2xl pb-2 pt-3;
	}

	nav a:hover {
		@apply text-zinc-900 border-zinc-400;
	}

	nav a i {
		@apply mr-1;
	}

	nav a {
		@apply px-2 pt-2 text-zinc-600 hover:text-zinc-900 box-border border-b-2 border-transparent transition-all duration-100;
	}

	nav a .name {
		@apply hidden;
	}

	nav a[aria-current='true'] {
		@apply border-b-2 shadow border-zinc-800 text-zinc-900 pointer-events-none;
	}

	nav a[aria-current='true'] .name {
		@apply !inline-block;
	}
</style>
