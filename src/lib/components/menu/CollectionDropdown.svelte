<script lang="ts">
	import Check from 'svelte-radix/Check.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { tick } from 'svelte';
	import * as Command from '$lib/shacdn/components/ui/command/index.js';
	import * as Popover from '$lib/shacdn/components/ui/popover/index.js';
	import { Button } from '$lib/shacdn/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	import type { Collections } from '$stores/collections.svelte';

	interface Props {
		collections: Collections | undefined;
	}

	const { collections = $bindable() }: Props = $props();

	let open = $state(false);
	let value = $state('');
	let search = $state('');

	const selectedValue = $derived.by(() => {
		if (!collections || !collections.List) return '';
		let sel = collections.List.find((s) => s.id === value);
		return sel ? sel.Name : 'Alle Sammlungen';
	});

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
		if (collections?.List) collections.Selected = collections.List.find((s) => s.id == value) ?? null;
	}
</script>

{#if collections && collections.List}
	<Popover.Root bind:open let:ids>
		<Popover.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline" role="combobox" aria-expanded={open} class="w-[200px] justify-between">
				<i class="ri-archive-2-line"></i>
				{selectedValue}
				<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[200px] p-0">
			<Command.Root>
				<Command.Input placeholder="Suchen" class="h-9" bind:value={search} />
				<Command.Empty>Keine Sammlung gefunden.</Command.Empty>
				{#key search}
					<Command.Group>
						<Command.Item
							value={''}
							onSelect={(_) => {
								value = '';
								closeAndFocusTrigger(ids.trigger);
							}}>
							<Check class={cn('mr-2 h-4 w-4', value !== '' && 'text-transparent')} />
							{#if value === ''}<b>Alle</b>{:else}Alle{/if}
						</Command.Item>
						{#each collections.List as c (c.Name)}
							<Command.Item
								value={c.id}
								onSelect={(currentValue) => {
									value = currentValue;
									closeAndFocusTrigger(ids.trigger);
								}}>
								<Check class={cn('mr-2 h-4 w-4', value !== c.id && 'text-transparent')} />
								{#if value === c.id}<b>{c.Name}</b>{:else}{c.Name}{/if}
							</Command.Item>
						{/each}
					</Command.Group>
				{/key}
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
{/if}
