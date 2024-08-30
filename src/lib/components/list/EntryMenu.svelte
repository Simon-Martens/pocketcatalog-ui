<script lang="ts">
	import type { Collection, Table } from '$lib/newtypes';
	import type { RecordsList } from '$stores/records.svelte';
	import * as Tooltip from '$lib/shacdn/components/ui/tooltip';
	import TableFoot from '$lib/components/list/TableFoot.svelte';
	import TableViewOptions from './TableViewOptions.svelte';
	import { onMount, tick } from 'svelte';
	import type { Collections } from '$stores/collections.svelte';

	interface Props {
		perPage: number;
		scheme: Table;
		records: RecordsList;
		collection: Collection | null;
	}
	const { perPage, scheme, records = $bindable(), collection = $bindable() }: Props = $props();

	let el: HTMLDivElement;
	let pinned = $state(false);
	const observer = new IntersectionObserver(
		([e]) => {
			if (e.intersectionRatio < 1) {
				pinned = true;
			} else {
				pinned = false;
			}
		},
		{ threshold: [1] }
	);

	onMount(() => {
		observer.observe(el);
	});
</script>

<div class="px-8 py-2.5 border-b bg-slate-50 flex flex-row sticky -top-[1px] gap-x-1 transition-all duration-100" bind:this={el} class:is-pinned={pinned}>
	<h2 class="text-slate-500 py-0.5">
		<span class=""
			>{#if !collection}Alle Sammlungen{:else}{collection.Name}{/if}&nbsp;&middot;&nbsp;</span>
		<span class="text-slate-900 font-bold">{scheme.friendlyName ?? scheme.Name}</span>
	</h2>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<button type="button" aria-label="Refresh" class="w-6 h-6 !ml-2 my-0.5 rounded-full hover:bg-slate-300 justify-center items-center text-center" onclick={() => records.Refresh()}>
				<i class="ri-refresh-line" class:refreshing={records.Refreshing}></i>
			</button>
		</Tooltip.Trigger>
		<Tooltip.Content side="bottom">
			<p class="text-base">Neu laden</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<TableViewOptions {records} {scheme} />

	<div class="grow"></div>
	<div class="">
		{#if records.Loading || records.Refreshing || !records.List}
			<i class="ri-hourglass-2-fill inline-block align-middle !text-base refreshing-infinite"></i>
		{:else}
			<TableFoot {records} {perPage} />
		{/if}
	</div>
</div>

<style>
	@keyframes refresh {
		100% {
			transform: rotate(360deg);
		}
	}
	i.refreshing {
		animation: refresh 600ms ease-out;
	}

	i.refreshing-infinite {
		animation: refresh 900ms infinite;
	}

	i {
		display: inline-block;
	}

	.is-pinned {
		@apply shadow;
	}
</style>
