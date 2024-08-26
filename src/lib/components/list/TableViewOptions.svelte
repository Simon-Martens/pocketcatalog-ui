<script lang="ts">
	import { pushUser, api } from '$stores/pocketbase';
	import type { RecordsList } from '$stores/records.svelte';
	import type { Table } from '$lib/newtypes';
	import * as Popover from '$lib/shacdn/components/ui/popover';
	import ScrollArea from '$lib/shacdn/components/ui/scroll-area/scroll-area.svelte';
	import { Checkbox } from '$lib/shacdn/components/ui/checkbox/index';
	import { Label } from '$lib/shacdn/components/ui/label/index';
	import * as Tooltip from '$lib/shacdn/components/ui/tooltip';

	interface Props {
		records: RecordsList;
		scheme: Table;
	}

	const { records = $bindable(), scheme }: Props = $props();

	let open: boolean = $state(false);

	const updateUserdata = function () {
		// We need to check for hidden so that we don't update userdata when the component is first mounted
		// Sorry, I know this is ugly, but I don't know how to do it better because of the way Svelte works
		// if (!hidden && api.authStore.model) {
		//	let copy = structuredClone(api.authStore.model) as UserType;
		//	copy.settings = copy.settings || {};
		//	copy.settings.VisibleFields = copy.settings.VisibleFields || {};
		//	copy.settings.VisibleFields[schema.TableName] = visible;
		//	pushUser(copy);
		// }
	};

	function initSettings() {
		//	if (api.authStore.model?.settings?.VisibleFields && api.authStore.model.settings.VisibleFields[schema.TableName]) {
		//		visible = api.authStore.model.settings.VisibleFields[schema.TableName];
		//	} else if (schema.Columns) {
		//		visible = schema.Columns.filter((s) => s.DefaultVisible).map((s) => s.Name);
		// 	}
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<button type="button" class="w-6 h-6 my-0.5 rounded-full hover:bg-slate-300 justify-center items-center text-center" class:bg-slate-300={open}>
					{#if !open}
						<i class="ri-eye-line"></i>
					{:else}
						<i class="ri-eye-fill"></i>
					{/if}
				</button>
				<Tooltip.Content side="bottom">
					<p class="text-base">Spalten ein-/ausblenden</p>
				</Tooltip.Content>
			</Tooltip.Trigger>
		</Tooltip.Root>
	</Popover.Trigger>
	<Popover.Content class="!p-2 !px-2">
		<ScrollArea class="h-96">
			<div class="">
				{#each records.Showables() as column (column.Name)}
					<div class="block mb-1.5">
						<Checkbox id={column.Name} checked={records.Shown(column.Name)} onCheckedChange={(_) => records.Toggle(column.Name)} />
						<Label for={column.Name} class="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-1">{column.friendlyName ?? column.Name}</Label>
					</div>
				{/each}
			</div>
		</ScrollArea>
	</Popover.Content>
</Popover.Root>

<style>
	@keyframes refresh {
		100% {
			transform: rotate(180deg);
		}
	}
	.refreshing i {
		animation: refresh 300ms ease-out;
	}

	i {
		display: inline-block;
	}
</style>
