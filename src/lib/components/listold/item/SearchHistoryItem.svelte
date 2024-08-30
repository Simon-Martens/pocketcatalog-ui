<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let name: string = '';
	export let item: string;
	export let pinned = false;

	let hover: boolean = false;
	let dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="min-w-[400px] max-w-[920px] flex flex-row pl-3.5 pr-2 gap-x-2"
	on:mouseenter={() => {
		hover = true;
	}}
	on:mouseleave={() => {
		hover = false;
	}}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-missing-attribute -->
	<a
		class="grow whitespace-nowrap overflow-hidden overflow-ellipsis cursor-pointer font-mono text-slate-700 hover:text-slate-950"
		title={item}
		on:click={() => {
			dispatch('selecthistory', item);
		}}
		>{#if name}
			{name}
		{:else}
			{item}
		{/if}
	</a>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<button
		class="-top-1 cursor-pointer relative align-middle text-center text-slate-400 text-xs leading-none hover:bg-slate-200 px-1.5 py-0.5 rounded-md hover:text-slate-800"
		class:opacity-0={!hover && !pinned}
        class:bg-slate-200={pinned}
        class:text-slate-800={pinned}
        class:hover:bg-slate-300={pinned}
        on:click={() => {
			if (pinned) dispatch('unpin', item);
			else dispatch('pin', item);
		}}>
		{#if (pinned)}
            <i class="relative align-middle text-center ri-unpin-line"></i>
        {:else}
            <i class="relative align-middle text-center ri-pushpin-2-line"></i>
        {/if}
	</button>
</div>
