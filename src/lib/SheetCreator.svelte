<script lang="ts">
	import { activeSheetUUID, sheets } from '../stores/TableStore';
	import { get } from 'svelte/store';

	let sheetName = '';

	$: validation = ((sheetName) => {
		let sheetsCache = get(sheets);
		return sheetsCache.find((s) => s.id === sheetName) === undefined ? true : false;
	})(sheetName);

	function createSheet() {
		let sheetsCache = get(sheets);
		let uuid = crypto.randomUUID();
		while (sheetsCache.find((s) => s.uuid === uuid) !== undefined) {
			uuid = crypto.randomUUID();
		}

		activeSheetUUID.set('1111-1111-1111');
		sheets.set([
			...get(sheets),
			{
				uuid,
				id: sheetName,
				rows: [],
				columns: [],
				columnDef: []
			}
		]);
	}
</script>

<div class="form-control">
	<label class="input-group" for="column-name">
		<span>Sheet Name:</span>
		<input
			id="column-name"
			type="text"
			placeholder="New Column"
			class="input input-bordered max-w-xs w-full"
			bind:value={sheetName}
		/>
	</label>
	<br />
	<button class="btn btn-primary" class:btn-disabled={!validation} on:click={createSheet}>
		Create
	</button>
</div>
