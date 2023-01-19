<script>
  import { isOverlayOpen } from "../stores/OverlayStore";
  import "../app.css";
  import Overlay from "../components/Overlay.svelte";
  import ColumnCreator from "$lib/ColumnCreator.svelte";
  
</script>



  <Overlay title="Column Creator">
    <ColumnCreator/>
  </Overlay>


<main class="min-h-screen">
  <slot />
</main>
