<script lang="ts">
	import type { Schema, Table } from '$lib/newtypes';
	import type { RecordModel } from 'pocketbase';

	interface Props {
		M: RecordModel;
		T: Table;
		F: Schema;
		G: boolean;
	}

	const { M, T, F, G }: Props = $props();
</script>
