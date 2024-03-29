<script lang="ts">
	import { createSvelteTable, flexRender, getCoreRowModel } from '@tanstack/svelte-table';
	import { type Sheet, updateSheets } from '../stores/TableStore';
	import type { ColumnTypes, ColumnValueTypes } from '../stores/TableStore';
	import type { ColumnDef, TableOptions } from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import TableHeader from './TableHeader.svelte';
	import FieldContainer from './FieldContainer.svelte';

	export let sheet: Sheet;

	let rowCount = 0;

	const options = writable<TableOptions<{ [key: string]: ColumnValueTypes }>>({
		data: sheet.rows.map((row) => row.data),
		columns: sheet.columnDef,
		getCoreRowModel: getCoreRowModel()
	});

	const table = createSvelteTable<{ [key: string]: ColumnValueTypes }>(options);

	const deleteRow = (id: number) => {
		if (sheet === undefined) return;
		let newRow = sheet.rows.filter((row) => row.id !== id);
		newRow.forEach((row, i) => {
			row.id = i;
		});
		sheet.rows = newRow;
		updateSheets(sheet);
		rowCount -= 1;
	};

	let rerender = (sheet: Sheet) => {
		options.update((options) => ({
			...options,
			data: sheet.rows.map((row) => row.data),
			columns: Object.create(sheet.columnDef)
		}));
	};


	$: rerender(sheet);
</script>

<div class="overflow-x-auto">
	<table class="table w-full table-zebra">
		<thead>
			{#each $table.getHeaderGroups() as headerGroup}
				<tr class="hover felx">
					{#each headerGroup.headers as header}
						<th colSpan={header.colSpan} class="">
							{#if !header.isPlaceholder}
								<TableHeader column={sheet.columns.find(c => c.uuid === header.column.columnDef.id)}>
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
		<tbody>
			{#each $table.getRowModel().rows as row, i}
				<tr>
					{#each row.getVisibleCells() as cell}
						<td>
							<FieldContainer
								columnUUID={cell.column.columnDef.id}
								rowId={i}
							/>
							<!-- <svelte:component
								this={flexRender(cell.column.columnDef.cell, cell.getContext())}
								columnUUID={cell.column.columnDef.id}
								rowId={i}
								type={cell.column.columnDef.meta?.type}
							/> -->
						</td>
					{/each}
					<td>
						<button class="btn btn-error max-w-max" on:click={(_) => deleteRow(i)}> X </button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
