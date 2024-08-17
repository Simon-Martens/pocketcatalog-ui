<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { api } from "$stores/pocketbase";
	import { addErrorAlert, removeAllAlerts } from "$stores/alerts";
	import Alert from "$lib/components/Alert.svelte";
	import type { UserType } from "$lib/types";

	let isLoading: boolean = false;
	let email: string = "";
	let password: string = "";
	let emailID: string = "";
	let pwID: string = "";

	onMount(() => {
		emailID = getUniqueID();
		pwID = getUniqueID();

		return () => {
			emailID = "";
			pwID = "";
			email = "";
			password = "";
			isLoading = false;
		};
	});

	function login() {
		if (isLoading) {
			return;
		}

		isLoading = true;

		return api
			.collection("users")
			.authWithPassword(email, password)
			.then((d) => {
				removeAllAlerts();
				if ($page.url.searchParams.has("redirectTo")) {
					// @ts-ignore BC we know that redirectTo is set
					goto($page.url.searchParams.get("redirectTo"));
				} else {
					goto("/");
				}
			})
			.catch(() => {
				api.authStore.clear();
				addErrorAlert(
					"Login ungültig. Bitte versuchen Sie es erneut.",
					true,
				);
			})
			.finally(() => {
				isLoading = false;
			});
	}

	function getUniqueID() {
		return "field_" + Math.floor(Math.random() * 10001).toString();
	}
</script>

<div class="grow w-full">
	<div class="m-auto max-w-md flex flex-col gap-y-2 mt-16">
		<a class="block mb-4" href="/">&#129060; musenalm</a>
		<h1 class="text-4xl text-center">admin sign in</h1>

		<form class="flex flex-col mt-4" on:submit|preventDefault={login}>
			<div
				class="bg-slate-300 mb-4 px-2 py-1.5 rounded border border-slate-300 transition-all duration-200"
			>
				<label class="block font-bold text-sm mb-0.5" for={emailID}
					>e-mail</label
				>
				<!-- svelte-ignore a11y-autofocus -->
				<input
					class="w-full bg-slate-300 focus:outline-none px-0"
					type="email"
					id={emailID}
					bind:value={email}
					required
					autofocus
				/>
			</div>

			<div
				class="bg-slate-300 mb-4 px-2 py-1.5 rounded border border-slate-300 transition-all duration-200"
			>
				<label class="block font-bold text-sm mb-0.5" for={pwID}
					>Password</label
				>
				<input
					class="w-full bg-slate-300 focus:outline-none px-0"
					type="password"
					id={pwID}
					bind:value={password}
					required
				/>
			</div>

			<button
				type="submit"
				class="min-w-[8rem] mt-2 self-end bg-slate-200 hover:shadow focus:shadow focus:border-slate-600 border focus:outline-none border-slate-300 py-1 rounded-lg transition-all duration-200"
				class:btn-disabled={isLoading}
				class:btn-loading={isLoading}
			>
				{#if isLoading}
					<i
						class="refreshing-infinite ri-loader-3-line text-center w-full"
					/>
				{:else}
					<span class="txt">Login</span>
					<i class="ri-arrow-right-line" />
				{/if}
			</button>
		</form>
	</div>
</div>

<style>
	form div:has(input:focus) {
		box-shadow:
			0 1px 3px 0 rgb(0 0 0 / 0.1),
			0 1px 2px -1px rgb(0 0 0 / 0.1);
		border: 1px solid gray;
		box-sizing: border-box;
	}

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
