<script lang="ts">
	import '../app.css';
	import Menu from '$lib/components/menu/Menu.svelte';
	import 'remixicon/fonts/remixicon.css';
</script>

<Menu />
<div class="relative min-h-screen flex w-full">
	<div class="min-h-screen w-full">
		<slot />
	</div>
</div>
<!-- We use this + document.getElementByID to mount dialogs -->
<div id="dialogmount"></div>
