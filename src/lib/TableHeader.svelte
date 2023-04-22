<script lang="ts">
	import { getCurrentSheet, sheets } from '../stores/TableStore';
	import type { Column } from '../stores/TableStore';
	import { openColumnCreator, openColumnOption } from '../stores/OverlayStore';

    export let column: Column;

</script>

<button
    on:click={() => openColumnOption(column.uuid, "EDIT_COLUMN")}
	class="btn min-w-max w-full flex justify-between"
>
	<p>
		{column.name}
	</p>
	<p class="px-1">⚙️</p>
</button>
