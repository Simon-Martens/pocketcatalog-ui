<script lang="ts">
	import type { Schema, Table } from '$lib/newtypes';
	import type { RecordModel } from 'pocketbase';
	import TextItem from './items/TextItem.svelte';
	import BooleanItem from './items/BooleanItem.svelte';
	import EditorItem from './items/EditorItem.svelte';
	import NumberItem from './items/NumberItem.svelte';
	import SelectManyItem from './items/SelectManyItem.svelte';
	import SelectOneItem from './items/SelectOneItem.svelte';
	import RelationItem from './items/RelationItem.svelte';
	import BackRelationItem from './items/BackRelationItem.svelte';
	import StateItem from './items/StateItem.svelte';
	import CollectionItem from './items/CollectionItem.svelte';
	import FieldsItem from './items/FieldsItem.svelte';
	import SymbolItem from './items/SymbolItem.svelte';
	import DateItem from './items/DateItem.svelte';
	import TagsItem from './items/TagsItem.svelte';
	import IdentifierItem from './items/IdentifierItem.svelte';
	import ItemItem from './items/ItemItem.svelte';

	interface Props {
		M: RecordModel;
		T: Table;
		F: Schema;
		G: boolean;
	}

	const { M, T, F, G }: Props = $props();
</script>

{#if F.Group && F.Group === 'State'}
	<StateItem {M} {T} {F} {G} />
{:else if F.Group && F.Group === 'Tag'}
	<TagsItem {M} {T} {F} {G} />
{:else if F.Group && F.Group === 'Collections'}
	<CollectionItem {M} {T} {F} {G} />
{:else if F.Group && F.Group === 'Identifier'}
	<IdentifierItem {M} {T} {F} {G} />
{:else if F.Group && F.Group === 'Date'}
	<DateItem {M} {T} {F} {G} />
{:else if F.Group && F.Group === 'Symbol'}
	<SymbolItem {M} {T} {F} {G} />
{:else if F.Group && F.Group === 'Fields'}
	<FieldsItem {M} {T} {F} {G} />
{:else if F.Group && F.Group === 'Items'}
	<ItemItem {M} {T} {F} {G} />
{:else if F.Type === 'Text'}
	<TextItem {M} {T} {F} {G} />
{:else if F.Type === 'Boolean'}
	<BooleanItem {M} {T} {F} {G} />
{:else if F.Type === 'Editor'}
	<EditorItem {M} {T} {F} {G} />
{:else if F.Type === 'Number'}
	<NumberItem {M} {T} {F} {G} />
{:else if F.Type === 'SelectUnlimited'}
	<SelectManyItem {M} {T} {F} {G} />
{:else if F.Type === 'SelectOne'}
	<SelectOneItem {M} {T} {F} {G} />
	<!-- TODO: Maybe we classify Serials, Agents, Places by group, (just as with Collections or Items) -->
{:else if F.Type.startsWith('Relation') || F.Type === 'BackRelationOne' || F.Type === 'BackRelationUnlimited'}
	<RelationItem {M} {T} {F} {G} />
{:else if F.Type.startsWith('BackRelation')}
	<BackRelationItem {M} {T} {F} {G} />
{/if}
