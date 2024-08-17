<script lang="ts">
	import "../app.css";
  	import Menu from "$lib/components/menu/Menu.svelte";
</script>

<div class="min-h-screen flex w-full">
	<Menu />

	<div class="min-h-screen w-full pl-6 pr-6 pt-4">
	<slot />
	</div>
</div>
<!-- We use this + document.getElementByID to mount dialogs -->
<div id="dialogmount"></div>