<script lang="ts">
	import {
		createColumnHelper,
		createSvelteTable,
		flexRender,
		getCoreRowModel
	} from '@tanstack/svelte-table';
	import {
		typeSchema,
		sheets,
		type Row,
		type Column,
		activeSheetUUID,
		type Sheet,
		updateSheets
	} from '../stores/TableStore';
	import type { ColumnTypes, ColumnValueTypes } from '../stores/TableStore';
	import type { ColumnDef, TableOptions } from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import { get } from 'svelte/store';
	import TableHeader from './TableHeader.svelte';
	import { resetView } from '../stores/OverlayStore';

	export let sheetUUID = get(activeSheetUUID);
	activeSheetUUID.subscribe((v) => (sheetUUID = v));

	export let sheet: Sheet;

	let rowCount = 0;

	const options = writable<TableOptions<{ [key: string]: ColumnValueTypes }>>({
		data: sheet.rows.map((val) => val.data),
		columns: sheet.columnDef,
		getCoreRowModel: getCoreRowModel()
	});

	const table = createSvelteTable<{ [key: string]: ColumnValueTypes }>(options);

	const addRow = () => {
		const columnNames = sheet.columns.map((column) => column.name);
		if (columnNames.length === 0) return;
		const data: { [key: string]: ColumnValueTypes } = Object.fromEntries(
			columnNames.map((name) => [
				name,
				$typeSchema[(sheet as Sheet).columns.filter((column) => column.name === name)[0].type]
			])
		);

		let newUuid = crypto.randomUUID();
		while (sheet.rows.find((v) => v.uuid === newUuid) !== undefined) {
			newUuid = crypto.randomUUID();
		}

		const row: Row = {
			id: rowCount,
			uuid: newUuid,
			data
		};
		sheet.rows = [...sheet.rows, row];
		updateSheets(sheet);
		rowCount += 1;
	};

	const deleteRow = (id: number) => {
		let newRow = sheet.rows.filter((row) => row.id !== id);
		newRow.forEach((row, i) => {
			row.id = i;
		});
		sheet.rows = newRow;
		updateSheets(sheet);
		resetView.set(!get(resetView));
		rowCount -= 1;
	};

	const updateData = () => {
		options.set({
			data: sheet.rows.map((val) => val.data),
			columns: sheet.columnDef,
			getCoreRowModel: getCoreRowModel()
		});
	};

	sheets.subscribe(() => {
		updateData();
	});

	$: activeSheetUUID.set(sheetUUID);
</script>

<div class="overflow-x-auto">
	<table class="table w-full table-zebra">
		<thead>
			{#each $table.getHeaderGroups() as headerGroup}
				<tr class="hover felx">
					{#each headerGroup.headers as header}
						<th colSpan={header.colSpan} class="">
							{#if !header.isPlaceholder}
								<TableHeader columnUUID={header.column.columnDef.id}>
									<svelte:component
										this={flexRender(header.column.columnDef.header, header.getContext())}
									/>
								</TableHeader>
							{/if}
						</th>
					{/each}
					{#if headerGroup.headers.length > 0}
						<th class="w-0" />
					{/if}
				</tr>
			{/each}
		</thead>
		{#key $resetView}
			<tbody>
				{#each $table.getRowModel().rows as row, i}
					<tr>
						{#each row.getVisibleCells() as cell}
							<td>
								<svelte:component
									this={flexRender(cell.column.columnDef.cell, cell.getContext())}
									columnUUID={cell.column.columnDef.id}
									rowId={i}
									type={cell.column.columnDef.meta?.type}
								/>
							</td>
						{/each}
						<td>
							<button class="btn btn-error max-w-max" on:click={() => deleteRow(i)}> X </button>
						</td>
					</tr>
				{/each}
			</tbody>
		{/key}
	</table>
	<div>
		<br />
		<button class="btn" on:click={addRow}>New Row</button>
		<br />
		<h5>raw sheet data:</h5>
		{JSON.stringify(sheet)}
	</div>
</div>
