<script lang="ts">
	import { activeSheetUUID, sheets, updateSheets } from '../stores/TableStore';
	import { get } from 'svelte/store';

	let sheetName = '';

	$: validation = ((id: string) => {
		console.log(sheetName);
		let sheetsCache = get(sheets);
		return sheetsCache.find((s) => s.id === id) === undefined ? true : false;
	})(sheetName);

	const createSheet = () => {
		let sheetsCache = get(sheets);
		let uuid = crypto.randomUUID();
		while (sheetsCache.find((s) => s.uuid === uuid) !== undefined) {
			uuid = crypto.randomUUID();
		}
		
		activeSheetUUID.set(uuid);
		updateSheets({
				uuid,
				id: sheetName,
				rows: [],
				columns: [],
				columnDef: []
			})
		sheetName = "";
	}
</script>

<div class="form-control">
	<label class="input-group" for="column-name">
		<span>Sheet Name:</span>
		<input
			id="column-name"
			type="text"
			placeholder="New Sheet"
			class="input input-bordered max-w-xs w-full"
			bind:value={sheetName}
		/>
	</label>
	<br />
	<button class="btn btn-primary" class:btn-disabled={!validation} on:click={createSheet}>
		Create
	</button>
</div>
