<script lang="ts">
	import { type RecordsList, ViewGroups } from '$stores/records.svelte';
	import type { Table } from '$lib/newtypes';
	import * as Popover from '$lib/shacdn/components/ui/popover';
	import ScrollArea from '$lib/shacdn/components/ui/scroll-area/scroll-area.svelte';
	import { Label } from '$lib/shacdn/components/ui/label/index';
	import * as Tooltip from '$lib/shacdn/components/ui/tooltip';
	import { Trigger } from '$lib/shacdn/components/ui/dialog';

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
		<Tooltip.Root openDelay={1000} disableHoverableContent={true}>
			<Tooltip.Trigger>
				<button type="button" class="w-6 h-6 my-0.5 rounded-full hover:bg-slate-300 justify-center items-center text-center" class:bg-slate-300={open}>
					{#if !open}
						<i class="ri-eye-line"></i>
					{:else}
						<i class="ri-eye-fill"></i>
					{/if}
				</button>
			</Tooltip.Trigger>
			<Tooltip.Content side="bottom">
				<p class="text-base">Spalten ein-/ausblenden</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Popover.Trigger>
	<Popover.Content class="!px-0 !pt-0 !w-fit">
		<ScrollArea class="h-96 overflow-y-scroll">
			<div class="">
				{#each records.YieldGroups() as mg (mg.Group)}
					<div class="flex flex-row gap-x-3 mb-1 [&:not(:first-child)]:mt-1 [&:first-child]:pt-2 py-1 border-b mx-2">
						<div class="grow font-bold">{ViewGroups[mg.Group].friendlyName ?? ViewGroups[mg.Group].Name}</div>
						{#if !ViewGroups[mg.Group].NeverGroup}
							<Tooltip.Root openDelay={1000} disableHoverableContent={true}>
								<div class="justify-self-end">
									<Tooltip.Trigger>
										<i class="ri-list-view"></i>
										<input type="checkbox" class="!mx-1 w-4 h-4 !my-1 justify-center items-center text-center accent-black shadow-none" id={ViewGroups[mg.Group].Name} value={ViewGroups[mg.Group].Name} bind:group={records.Grouped} />
									</Tooltip.Trigger>
									<Tooltip.Content side="bottom">
										<p class="text-base">Spalten gruppieren</p>
									</Tooltip.Content>
								</div>
							</Tooltip.Root>
						{/if}
					</div>
					{#each Object.entries(mg.Fields) as [n, fg] (n)}
						{#each fg as f (f.Name)}
							<div class="block mb-1.5 px-1">
								<input type="checkbox" class="!mx-1 w-4 h-4 !my-1 justify-center items-center text-center accent-black shadow-none" id={f.Name} value={f.Name} bind:group={records.Visible} />
								<Label for={f.Name} class="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-1">{f.friendlyName ?? f.Name}</Label>
							</div>
						{/each}
					{/each}
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
