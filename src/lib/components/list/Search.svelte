<script lang="ts">
	import CodeMirror from '$lib/components/CodeMirror.svelte';
	import type { SchemaType } from '$lib/types';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let schema: SchemaType;

	// This keeps track of the current string in the input field,
	// not the current filter value. The current filter value must
	// be saved one component up, if it is necessary to keep track.
	export let doc = '';
	export let suggestion =
		'Filter (wie Lebensdaten BEGINNT MIT 1744, Band ENTHÄLT Winter oder einen beliebigen anderen Ausdruck)';
	export let autoFocus = false;
	// This is the last generated filter string, and alos the active filter.
	// This is bound by the parent component and not set by the search
	// component itself.
	export let filter: string;
	export let searching: boolean;

	// TODO: Make it possible to use different verbs depending on the type of field.
	// Boolean: no verbs, only modified with ! or NICHT
	// Number: >, <, >=, <=, =
	// String: =, ~, ist, ist nicht, enthält, enthält nicht, beginnt mit, beginnt nicht mit
	// Date: >, <, >=, <=, =
	// Maybe we need to differetiate beween multiple and single select fields.
	// WARNING: longer matches must be before shorter matches, otherwise the shorter match will be matched first.
	export const verbs: Map<string, { begin: string; end: string }> = new Map<string, { begin: string; end: string }>([
		['=', { begin: '="', end: '"' }],
		['!=', { begin: '!="', end: '"' }],
		['!~', { begin: '!?~"', end: '"' }],
		['~', { begin: '?~"', end: '"' }],
		['>=', { begin: '>=', end: '' }],
		['<=', { begin: '<=', end: '' }],
		['>', { begin: '>', end: '' }],
		['<', { begin: '<', end: '' }],
		['ist nicht', { begin: '!="', end: '"' }],
		['IST NICHT', { begin: '!="', end: '"' }],
		['ist', { begin: '="', end: '"' }],
		['IST', { begin: '="', end: '"' }],
		['enthält nicht', { begin: '?!~"', end: '"' }],
		['ENTHÄLT NICHT', { begin: '?!~"', end: '"' }],
		['enthält', { begin: '?~"', end: '"' }],
		['ENTHÄLT', { begin: '?~"', end: '"' }],
		['beginnt mit', { begin: '?~"', end: '%"' }],
		['BEGINNT MIT', { begin: '?~"', end: '%"' }],
		['beginnt nicht mit', { begin: '!?~"', end: '%"' }],
		['BEGINNT NICHT MIT', { begin: '!?~"', end: '%"' }],
		['ENDET AUF', { begin: '?~"%', end: '"' }],
		['endet auf', { begin: '?~"%', end: '"' }],
		['ENDET NICHT AUF', { begin: '!?~"%', end: '"' }],
		['endet nicht auf', { begin: '!?~"%', end: '"' }]
	]);

	export const conjunctions: Map<string, string> = new Map([
		['UND', '&&'],
		['und', '&&'],
		['ODER', '||'],
		['oder', '||'],
		['&&', '&&'],
		['||', '||']
	]);

	export const modifiers: string[] = [];

	let dispatch = createEventDispatcher();

	let fields: Map<string, string[]>;
	let exp_fields: Map<string, string[]>;
	let cm: CodeMirror;

	export const focus = function () {
		cm.focus();
	};

	export const getValue = function () {
		return cm.getValue();
	};

	export const setValue = function (value: string) {
		cm.setValue(value);
	};

	export const search = function () {
		let val = getValue();
		if (!val || val == '') {
			filter = '';
			return;
		}

		dispatch('search', { filter: generatePropositionString(val, ''), input: val });
	};

	$: empty = doc == '';

	$: if (schema) {
		fields = new Map<string, string[]>();
		exp_fields = new Map<string, string[]>();
		for (const field of schema.Columns) {
			if (field.Fields.length > 1) {
				if (!!field.Searchable)
					if (!field.OnlyExplicitlySearchable)
						fields.set(field.ShortName ?? field.Name, field.Fields.map((f) => f.Field.split(',')).flat());
					else exp_fields.set(field.ShortName ?? field.Name, field.Fields.map((f) => f.Field.split(',')).flat());
				for (const f of field.Fields) {
					if (f.ShortName && !fields.has(f.ShortName)) {
						fields.set(f.ShortName, f.Field.split(','));
					} else if (f.Name && !fields.has(f.Name)) {
						fields.set(f.Name, f.Field.split(','));
					} else {
						for (const sf of f.Field.split(',')) {
							if (!fields.has(sf)) fields.set(sf, [sf]);
						}
					}
				}
			} else if (field.Fields.length === 1) {
				if (!field.OnlyExplicitlySearchable)
					fields.set(field.ShortName ?? field.Name, field.Fields[0].Field.split(','));
				else exp_fields.set(field.ShortName ?? field.Name, field.Fields[0].Field.split(','));
			}
		}

		if (autoFocus) {
			setTimeout(() => {
				focus();
			}, 400);
		}
	}

	const change = function (event: { detail: { value: string } }) {
		doc = event.detail.value;
	};

	export const clear = function (fetch: boolean = true) {
		// doc is set by the resulting change event, so it down't need to be set here.
		cm.setValue('');
		if (fetch) filter = '';
		if (autoFocus) focus();
	};

	const combine = function* (...iterators: Iterable<any>[]) {
		for (let it of iterators) yield* it;
	};

	const generatePropositionString = function (string: string, result: string): string {
		string = string.trim();
		let immediateResult = '';
		for (const [key, value] of combine(fields.entries(), exp_fields.entries())) {
			if (string.startsWith(key + ' ')) {
				let rest = string.slice(key.length + 1).trimStart();
				for (const [verb, operator] of verbs.entries()) {
					if (rest.startsWith(verb + ' ')) {
						rest = rest.slice(verb.length + 1).trimStart();
						let stringUntil = stringUntilConjunction(rest, false);
						if (stringUntil.remaining) {
							immediateResult +=
								value.map((x: string) => x + operator.begin + stringUntil.result + operator.end).join('||') +
								stringUntil.operator;
							return generatePropositionString(stringUntil.remaining, result + immediateResult);
						} else {
							immediateResult += value
								.map((x: string) => x + operator.begin + stringUntil.result + operator.end)
								.join('||');
							return result + immediateResult;
						}
					}
				}
			}
		}

		let stringUntil = stringUntilConjunction(string);
		if (stringUntil.remaining) {
			immediateResult += generateGeneralSearchString(stringUntil.result) + stringUntil.operator;
			return generatePropositionString(stringUntil.remaining, result + immediateResult);
		} else {
			immediateResult += generateGeneralSearchString(stringUntil.result);
			return result + immediateResult;
		}
	};

	const stringUntilConjunction = function (
		string: string,
		quotes: boolean = true
	): { result: string; remaining: string | null; operator: string | null } {
		string = string.trimStart();
		let literal = '';
		if (string.startsWith('"')) {
			literal = string.slice(1).split('"')[0];
			string = string.slice(literal.length + 2).trimStart();
		}
		for (const [conjunction, operator] of conjunctions.entries()) {
			let res = string.indexOf(' ' + conjunction + ' ');
			if (res > -1) {
				let r = string.slice(res + conjunction.length + 2).trim();
				if (!r || r === '') {
					if (!quotes) {
						return {
							result: literal + string.replaceAll('"', "'"),
							remaining: null,
							operator: null
						};
					} else {
						return {
							result: '"' + literal + string.replaceAll('"', "'") + '"',
							remaining: null,
							operator: null
						};
					}
				} else if (!quotes) {
					return {
						result: literal + string.slice(0, res).replaceAll('"', "'"),
						remaining: string.slice(res + conjunction.length + 2),
						operator
					};
				} else {
					return {
						result: '"' + literal + string.slice(0, res).replaceAll('"', "'") + '"',
						remaining: string.slice(res + conjunction.length + 2),
						operator
					};
				}
			}
		}
		if (!quotes) {
			return { result: literal + string.replaceAll('"', "'"), remaining: null, operator: null };
		} else {
			return {
				result: '"' + literal + string.replaceAll('"', "'") + '"',
				remaining: null,
				operator: null
			};
		}
	};

	const generateGeneralSearchString = function (string: string): string {
		if (!string || string === '') return '';
		let result = '(';
		for (var entry of fields.values()) {
			for (var field of entry) {
				result += field + '?~' + string + '||';
			}
		}

		return result.slice(0, -2) + ')';
	};

	$: verbs_arr = schema ? Array.from(verbs.keys()) : [];
	$: conjunctions_arr = schema ? Array.from(conjunctions.keys()) : [];
	$: fields_arr = schema ? Array.from(fields.keys()) : [];
</script>

<div class="ma-list-searchbox flex flex-row text-md mb-2">
	<CodeMirror
		{doc}
		verbs={verbs_arr}
		conjunctions={conjunctions_arr}
		fields={fields_arr}
		{autoFocus}
		{suggestion}
		bind:this={cm}
		on:change={change}
		on:submit={search} />
	{#if filter || !empty}
		<button
			class="inline-block bg-orange-200 text-orange-700 hover:text-orange-900 rounded shadow-inner min-w-[11rem]"
			class:bg-orange-200={filter}
			class:bg-slate-200={!filter}
			class:text-slate-700={!filter}
			class:text-orange-700={filter}
			class:hover:text-orange-900={filter}
			class:hover:text-slate-900={!filter}
			in:fly={{ x: -30, duration: 350 }}
			out:fly={{ x: -30, duration: 350 }}
			on:click={() => {
				if (filter) clear(true);
				else clear(false);
			}}>
			<i class="ri-filter-off-line"></i>
			{#if filter}
				Filter
			{:else}
				Feld
			{/if} zurücksetzen</button>
	{/if}
	{#if !empty || (filter && empty)}
		<button
			class="whitespace-nowrap font-bold text-slate-700 hover:text-slate-900 ml-2.5 disabled:shadow-inner disabled:bg-slate-300 disabled:text-gray-500 rounded shadow-md disabled:border-none border border-slate-400 bg-[#d4d8ff] transition-all duration-200 min-w-[11rem]"
			in:fly={{ x: 10, duration: 350 }}
			out:fly={{ x: 10, duration: 350 }}
			on:click={search}
			disabled={empty || searching}>
			{#if !searching}Suche
			{:else}<i class="ri-loader-4-line refreshing-infinite inline-block"></i>{/if}
		</button>
	{/if}
</div>

<style>
	@keyframes refresh {
		100% {
			transform: rotate(360deg);
		}
	}

	.refreshing-infinite {
		animation: refresh 900ms infinite;
	}

	i {
		display: inline-block;
	}
</style>
