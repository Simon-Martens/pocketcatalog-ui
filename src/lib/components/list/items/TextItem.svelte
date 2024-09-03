<script lang="ts">
	import type { Schema, Table } from '$lib/newtypes';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';

	interface Props {
		M: RecordModel;
		T: Table;
		F: Schema;
		G: boolean;
	}

	const { M, T, F, G }: Props = $props();

	let divided: boolean = $state.raw(false);
	let parts: string[] = [];

	onMount(() => {
		if (F.Options?.Divider) {
			divided = true;
			parts = M[F.Name] ? M[F.Name].split(F.Options.Divider) : [];
		}
	});
</script>

{#if !divided}
	<div class="">
		{M[F.Name]}
	</div>
{:else}
	{#each parts as part}
		<div class="">
			{part}
		</div>
	{/each}
{/if}
