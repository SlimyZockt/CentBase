<script>
  import { isOverlayOpen } from "../stores/OverlayStore";
  import "../app.css";
  import Overlay from "../components/Overlay.svelte";
  import ColumnConfigurator from "$lib/ColumnConfigurator.svelte";
  
</script>



<Overlay title="Column Creator">
  <ColumnConfigurator/>
</Overlay>


<main class="min-h-screen">
  <slot />
</main>
