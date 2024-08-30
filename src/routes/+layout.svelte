<script lang="ts">
	import '../app.css';
	import Menu from '$lib/components/menu/Menu.svelte';
	import 'remixicon/fonts/remixicon.css';
	import { setContext } from 'svelte';
	import { Collections } from '$stores/collections.svelte';
	import { PUBLIC_PB_API } from '$env/static/public';
	let collections = new Collections();
	if (collections) collections.Fetch();
	setContext('collections', collections);
</script>

<Menu {collections} />
<div class="relative min-h-screen flex w-full">
	<div class="min-h-screen w-full">
		<slot />
	</div>
</div>

<svelte:head>
	<meta http-equiv="Content-Security-Policy" content="default-src 'self' {PUBLIC_PB_API} style-src 'self' 'unsafe-inline'" />
</svelte:head>
