<script lang="ts">
	import { getCurrentSheet, sheets } from '../stores/TableStore';
	import type { Column } from '../stores/TableStore';
	import { openColumnCreator, openColumnOption } from '../stores/OverlayStore';

	export let column: Column | undefined;

</script>

<button
    on:click={() => {if (column !== undefined) openColumnOption(column.uuid, "EDIT_COLUMN")}}
	class="btn min-w-max w-full flex justify-between"
>
	<p>
		{#if column !== undefined}
			{column.name}
		{/if}
	</p>
	<p class="px-1">⚙️</p>
</button>
