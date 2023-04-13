<script lang="ts">
	import { updateSheets, type Row, type Sheet } from "./../stores/TableStore";
	import { typeSchema } from "./../stores/TableStore";

    export let sheet: Sheet;

	const addRow = () => {
		const columnNames = sheet.columns.map(column => column.name);
		if (columnNames.length === 0) return;
		const data = Object.fromEntries(
			columnNames.map((name) => [
				name,
				$typeSchema[sheet.columns.filter((column) => column.name === name)[0].type]
			])
		);

		let newUuid = crypto.randomUUID();
		while (sheet.rows.find((v) => v.uuid === newUuid) !== undefined) {
			newUuid = crypto.randomUUID();
		}
		const row: Row = {
			id: sheet.rows.length,
			uuid: newUuid,
			data: data,
		};

		sheet.rows.push(row);
		updateSheets(sheet);
		console.log("add new Row");
		
	};
</script>


<button class="btn" on:click={addRow}>New Row</button>