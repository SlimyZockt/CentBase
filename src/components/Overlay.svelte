<script lang="ts">
  import { isOverlayOpen } from "../stores/OverlayStore";

  export let title: string;
</script>

<input type="button" class="btn modal-toggle" id="my-modal"/>
<div class="modal" class:modal-open={$isOverlayOpen}>
  <div class="modal-box">
    <div class="modal-action justify-between">
      <h2 class="text-lg font-bold">{title}</h2>
      <button
        class="btn btn-square btn-sm btn-primary"
        on:click={() => isOverlayOpen.set(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          /></svg
        >
      </button>
    </div>
    <div class="divider"></div>
    <slot />
  </div>
</div>
