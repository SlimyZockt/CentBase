<script lang="ts">
	import { updateSheets, TypeData, type Row, type Sheet, type DataTypes } from './../stores/TableStore';

	export let sheet: Sheet;
	export let count: number;

	type UnionToIntersection<U> =
	(U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never


	const addRow = () => {

		const ROW =  sheet.columns.map((column) => {
			return [column.name, TypeData[column.type].defaultValue] as const;
		})

		console.log(ROW);

		if (ROW.length === 0) return;

		const data = Object.fromEntries(ROW);

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
