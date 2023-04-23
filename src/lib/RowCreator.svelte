<script lang="ts">
	import { updateSheets, type Row, type Sheet, type DataTypes } from './../stores/TableStore';
	import { ColumnSchema } from './../stores/TableStore';

	export let sheet: Sheet;
	export let count: number;

	const addRow = () => {
		const columnNames = sheet.columns.map((column) => column.name);

		if (columnNames.length === 0) return;

		const data = Object.fromEntries(columnNames.map((name) => [name, undefined]));

		for (let index = 0; index < count; index++) {
			let newUuid = crypto.randomUUID();
			while (sheet.rows.find((v) => v.uuid === newUuid) !== undefined) {
				newUuid = crypto.randomUUID();
			}
			const row: Row = {
				id: sheet.rows.length,
				uuid: newUuid,
				data: data
			};
			sheet.rows.push(row);
		}

		updateSheets(sheet);
	};
</script>

<button class="btn" on:click={addRow}><slot /></button>
