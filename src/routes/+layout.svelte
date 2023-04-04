<script>
  import { isOverlayOpen, overlayMode } from "../stores/OverlayStore";
  import "../app.css";
  import Overlay from "../components/Overlay.svelte";
  import ColumnConfigurator from "$lib/ColumnConfigurator.svelte";
	import SheetCreator from "$lib/SheetCreator.svelte";
  
</script>


{#if $overlayMode === "COLUMN"}
  <Overlay title="Create Column">
    <ColumnConfigurator/>
  </Overlay>
{:else if $overlayMode === "SHEET"}
  <Overlay title="Create Sheet">
    <SheetCreator/>
  </Overlay>
{/if}



<main class="min-h-screen">
  <slot />
</main>
