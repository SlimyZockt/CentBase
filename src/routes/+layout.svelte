<script>
  import { isOverlayOpen, overlayMode } from "../stores/OverlayStore";
  import "../app.css";
  import Overlay from "../components/Overlay.svelte";
  import ColumnCreator from "$lib/ColumnUtilOverlays/ColumnCreator.svelte";
  import ColumnEditor from "$lib/ColumnUtilOverlays/ColumnEditor.svelte";
	import SheetCreator from "$lib/SheetCreator.svelte";
  
</script>


{#if $overlayMode === "CREATE_COLUMN"}
  <Overlay title="Create Column">
    <ColumnCreator/>
  </Overlay>
{:else if $overlayMode === "EDIT_COLUMN"}
  <Overlay title="Edit Sheet">
    <ColumnEditor/>
  </Overlay>
{:else if $overlayMode === "SHEET"}
  <Overlay title="Create Sheet">
    <SheetCreator/>
  </Overlay>
{/if}



<main class="min-h-screen">
  <slot />
</main>
