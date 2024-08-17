<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { EditorView, keymap, placeholder, type KeyBinding } from '@codemirror/view';
	import { Compartment, EditorState } from '@codemirror/state';
	import { StreamLanguage, defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
	// import { espresso } from 'thememirror';
	import { simpleMode } from '@codemirror/legacy-modes/mode/simple-mode';
	import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
	import {
		startCompletion,
		closeCompletion,
		autocompletion,
		acceptCompletion,
		moveCompletionSelection,
		CompletionContext
	} from '@codemirror/autocomplete';
	import { createEventDispatcher } from 'svelte';

	export let autoFocus: boolean = false;
	export let doc: string = '';
	export let suggestion: string = 'Your code here...';

	export let fields: string[];
	export let verbs: string[];
	export let conjunctions: string[];

	let editorContainer: HTMLDivElement;
	let view: EditorView;
	let langCompartment = new Compartment();

	$: longest = fields.reduce((a, b) => (a.length > b.length ? a : b)).length;

	$: rgexp_fieldsword = new RegExp(fields.map((x) => '\\s*' + x + '\\s+\\w*').join('|'));
	$: rgexp__conj = new RegExp(conjunctions.map((x) => '\\s+' + x.replaceAll('|', '\\|') + '\\s+\\w*').join('|'));

	export const focus = function () {
		view?.focus();
	};

	export const getValue = function () {
		return view.state.doc.toString();
	};

	export const isEmpty = function () {
		return view.state.doc.toString() == '';
	};

	export const setValue = function (value: string) {
		if (view && value !== view.state.doc.toString())
			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: value
				},
				effects: [
					langCompartment.reconfigure(getLanguage()),
					// TODO: syntax highlighting is broken on reconfigure
				]
			});
	};

	const dispatch = createEventDispatcher();

	const changeListener = EditorView.updateListener.of((update) => {
		if (update.docChanged) {
			dispatch('change', { value: view.state.doc.toString() });
		}
	});

	const submitShortcut = {
		key: 'Enter',
		run: (_: EditorView) => {
			// trigger submit on enter for singleline input
			dispatch('submit', getValue());
			return true;
		}
	};

	const escapeShortcut = {
		key: 'Escape',
		run: (_: EditorView) => {
			// trigger submit on enter for singleline input
			setValue('');
			dispatch('submit', getValue());
			return true;
		}
	};

	const autocompShortcuts = [
		{ key: 'Ctrl-Space', run: startCompletion },
		{ key: 'Escape', run: closeCompletion },
		{ key: 'ArrowDown', run: moveCompletionSelection(true) },
		{ key: 'ArrowUp', run: moveCompletionSelection(false) },
		{ key: 'PageDown', run: moveCompletionSelection(true, 'page') },
		{ key: 'PageUp', run: moveCompletionSelection(false, 'page') },
		{ key: 'Tab', run: acceptCompletion }
	];

	const completions = function (context: CompletionContext) {
		let f = context.matchBefore(rgexp_fieldsword);
		if (f && f.from !== f.to) {
			let word = context.matchBefore(/\w*/);
			if (word && word.from !== word.to) {
				let options = [
					{ label: 'IST' },
					{ label: 'IST NICHT' },
					{ label: 'ENTHÄLT' },
					{ label: 'ENTHÄLT NICHT' },
					{ label: 'BEGINNT MIT' },
					{ label: 'BEGINNT NICHT MIT' },
					{ label: 'ENDET AUF' },
					{ label: 'ENDET NICHT AUF' }
				];
				return {
					from: word.from,
					options
				};
			}
		}

		if (context.pos < longest) {
			let word = context.matchBefore(/\w*/);
			if (word && word.from !== word.to) {
				return {
					from: word.from,
					options: fields.map((x) => ({ label: x }))
				};
			}
		}

		let c = context.matchBefore(rgexp__conj);
		if (c && c.from !== c.to) {
			let word = context.matchBefore(/\w*/);
			if (word && word.from !== word.to) {
				return {
					from: word.from,
					options: fields.map((x) => ({ label: x }))
				};
			}
		}

		let word = context.matchBefore(/(?<=\s)\w*/);
		if (word && word.from !== word.to) {
			let options = [{ label: 'UND' }, { label: 'ODER' }, { label: '&&' }, { label: '||' }];
			return {
				from: word.from,
				options
			};
		}
		return null;
	};

	const generateRegexFromKeywords = function () {
		let f = fields.map((x) => '(\\s*' + x + '\\s*)');
		let v = verbs.map((x) => '(\\s*' + x + '\\s*)');
		return v.map((x) => f.map((y) => y + x)).flat();
	};

	const getLanguage = function () {
		return StreamLanguage.define(
			simpleMode({
				start: [
					// TODO: keyword + end of string after this, also keyword + space + end of string
					...generateRegexFromKeywords().map((x) => ({
						regex: new RegExp(x),
						token: ['keyword', 'operator'],
						push: 'afterverb'
					})),
					// Can be turned on if partial matches are allowed
					// ...fields.map((x) => ({
					// 	regex: new RegExp('\\s*' + x +'$'),
					// 	token: 'keyword',
					// 	pop: false
					// })),
					// ...fields.map((x) => ({
					// 	regex: new RegExp('\\s*' + x+'\\s*$'),
					// 	token: 'keyword',
					// 	push: 'afterfield',
					// 	pop: false
					// })),
					{ regex: /.*/, token: 'string' }
				],
				// Not needed if pariial matches arent supported see abobe
				// afterfield: [
				// 	...verbs.map((x) => ({
				// 		regex: new RegExp(x + '$'),
				// 		token: 'operator',
				// 		pop: false,
				// 	})),
				// 	...verbs.map((x) => ({
				// 		regex: new RegExp(x + '\\s*$'),
				// 		token: 'operator',
				// 		pop: true,
				// 	})),
				// 	{ regex: /.*/, token: 'string', pop: true }
				// ],
				afterverb: [
					...conjunctions.map((x) => ({
						regex: new RegExp('(.*)' + '(' + x + ' )'),
						token: ['string', 'operator'],
						pop: true
					})),
					{ regex: /.*/, token: 'string', next: 'afterverb' }
				],
				allstring: [{ regex: /.*/, token: 'string', next: 'allstring' }]
			})
		);
	};

	onMount(() => {
		let state: EditorState = EditorState.create({
			doc,
			extensions: [
				langCompartment.of(getLanguage()),
				// espresso,
				syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
				placeholder(suggestion),
				changeListener,
				history(),
				autocompletion({
					override: [completions],
					icons: false,
					defaultKeymap: false
				}),
				keymap.of([escapeShortcut, submitShortcut, ...autocompShortcuts, ...historyKeymap, ...defaultKeymap])
			]
		});

		view = new EditorView({
			parent: editorContainer,
			state
		});
	});

	onDestroy(() => {
		if (view) {
			view.destroy();
		}
	});
</script>

<div class="grow" bind:this={editorContainer}></div>
