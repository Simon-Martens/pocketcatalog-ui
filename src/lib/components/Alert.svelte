<script lang="ts">
	import { alerts, reset, removeAlert, pauseTimeout, resumeTimeout } from '$stores/alerts';
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';
	import { loggedIn, loading } from '$stores/pocketbase';
	import 'remixicon/fonts/remixicon.css';
	import { fly } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';

	let mouseover = false;
	let debounceclose = false;

	onMount(() => {
		const unsubscribe = navigating.subscribe((navigating) => {
			if (navigating) {
				mouseover = false;
				reset();
			}
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="" on:mouseenter={() => (mouseover = true)} on:mouseleave={() => (mouseover = false)}>
	<div
		class:rounded-full={!mouseover && $alerts.length === 0 && $loggedIn}
		class:shadow-xl={mouseover || $alerts.length !== 0 || !$loggedIn}
		class="box-border border text-xl w-10 h-10 rounded-l-full bg-slate-50 justify-center items-center text-center m-0 z-50">
		{#if $alerts.length > 0}
			{#if $alerts[0].type === 'error'}
				<i class="ri-notification-2-line text-red-600 align-middle leading-[2.5rem]"></i>
			{:else if $alerts[0].type === 'success'}
				<i class="ri-information-2-line text-green-700 align-middle leading-[2.5rem]"></i>
			{:else if $alerts[0].type === 'info'}
				<i class="ri-notification-2-line text-blue-600 align-middle leading-[2.5rem]"></i>
			{/if}
		{:else if $loading}
			<i class="ri-database-2-fill text-orange-400 align-middle leading-[2.5rem]"></i>
		{:else if $loggedIn}
			<i class="ri-database-2-fill text-indigo-600 align-middle leading-[2.5rem]"></i>
		{:else}
			<i class="ri-server-line align-middle leading-[2.5rem]"></i>
		{/if}
	</div>

	{#if $alerts.length > 0}
		{#each $alerts as alert (alert.id)}
			{#if alert.type === 'error'}
				<div
					class="alert bg-red-200 text-red-900 !border-red-200 !border-l-red-700"
					in:fly|global={{ x: 30, duration: 450, easing: sineInOut }}
					out:fly|global={{ x: 30, duration: 450, easing: sineInOut }}
					on:mouseenter={() => pauseTimeout(alert.id)}
					on:mouseleave={() => resumeTimeout(alert.id)}>
					<!-- <i class="ri-information-2-line mr-2"></i> -->
					<span class="font-bold mr-1.5">Fehler!</span>
					<span class="block font-bolder">{alert.message}</span>
					<button
						on:click={() => {
							removeAlert(alert.id);
							debounceclose = true;
							setTimeout(() => (debounceclose = false), 600);
						}}
						title="Schließen">
						<i class="ri-close-line p-0.5 hover:bg-red-300 rounded hover:text-red-900 ml-1"></i></button>
				</div>
			{/if}

			{#if alert.type === 'success'}
				<div
					class=" alert bg-emerald-100 text-green-800 border-green-200 !border-l-green-700"
					in:fly|global={{ x: 30, duration: 450, easing: sineInOut }}
					out:fly|global={{ x: 30, duration: 450, easing: sineInOut }}
					on:mouseenter={() => pauseTimeout(alert.id)}
					on:mouseleave={() => resumeTimeout(alert.id)}>
					<!-- <i class="ri-information-2-line mr-2"></i> -->
					<span class="block font-bolder">{alert.message}</span>
					<button
						on:click={() => {
							removeAlert(alert.id);
							debounceclose = true;
							setTimeout(() => (debounceclose = false), 600);
						}}
						title="Schließen">
						<i class="ri-close-line p-0.5 hover:bg-green-300 rounded hover:text-green-900 ml-1"></i></button>
				</div>
			{/if}

			{#if alert.type === 'info'}
				<div
					class="alert text-sky-800 border-sky-700"
					in:fly|global={{ y: -30, duration: 450, easing: sineInOut }}
					out:fly|global={{ y: -30, duration: 450, easing: sineInOut }}
					on:mouseenter={() => pauseTimeout(alert.id)}
					on:mouseleave={() => resumeTimeout(alert.id)}>
					<!-- <i class="ri-information-2-line mr-2"></i> -->
					<span class="block font-bolder">{alert.message}</span>
					{#if alert.ok_button && alert.callback}
						<button
							on:click={() => {
								alert.callback(true);
								removeAlert(alert.id);
								debounceclose = true;
								setTimeout(() => (debounceclose = false), 600);
							}}
							title={alert.ok_button}>
							<span
								class="underline decoration-dotted hover:decoration-solid px-1 p-0.5 hover:bg-sky-300 rounded hover:text-sky-900 ml-1"
								>{alert.ok_button}</span
							></button>
					{/if}
					{#if alert.cancel_button && alert.callback}
						<button
							on:click={() => {
								alert.callback(false);
								removeAlert(alert.id);
								debounceclose = true;
								setTimeout(() => (debounceclose = false), 600);
							}}
							title={alert.cancel_button}>
							<span
								class="underline decoration-dotted hover:decoration-solid px-1 p-0.5 hover:bg-sky-300 rounded hover:text-sky-900 ml-1"
								>{alert.cancel_button}</span
							></button>
					{/if}
					<button
						on:click={() => {
							removeAlert(alert.id);
							debounceclose = true;
							setTimeout(() => (debounceclose = false), 600);
						}}
						title="Schließen">
						<i class="ri-close-line p-0.5 hover:bg-sky-300 rounded hover:text-sky-900 ml-1"></i></button>
				</div>
			{/if}
		{/each}
	{:else if (mouseover && !debounceclose) || !$loggedIn}
		<div class="alert bg-slate-100" in:fly={{ x: 30, duration: 450 }} out:fly={{ x: 30, duration: 450 }}>
			{#if $loading}
				Daten werden geladen...
			{:else if $loggedIn}
				Server verbunden; keine Meldungen. <a
					class="underline decoration-dotted hover:decoration-solid px-1 p-0.5 text-slate-700 hover:text-slate-900 ml-1"
					href="/login"
					data-sveltekit-preload-data="off">Abmelden</a>
			{:else}
				Bitte loggen Sie sich ein.
			{/if}
		</div>
	{/if}
</div>

<style>
	.alert {
		@apply z-[10000] absolute top-0 left-12 box-border transition-all duration-150 leading-[2.5rem] pr-5 pl-3 whitespace-nowrap rounded-r-full border border-slate-300 border-l-slate-400 border-l-2 shadow-xl flex flex-row flex-nowrap;
	}
</style>
