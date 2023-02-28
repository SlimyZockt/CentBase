<script lang="ts">
	import { openColumnCreator, openColumnOption } from '../stores/OverlayStore';

    export let columnUUID: string = "";

</script>

<button
    on:click={() => openColumnOption(columnUUID)}
	class="btn min-w-max w-full flex justify-between"
>
	<slot/>
	<p class="px-1">⚙️</p>
</button>
