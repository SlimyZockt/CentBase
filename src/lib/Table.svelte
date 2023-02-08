<script lang="ts">
	import {
		createColumnHelper,
		createSvelteTable,
		flexRender,
		getCoreRowModel
	} from '@tanstack/svelte-table';
	import {
		ColumnData,
		typeSchema,
		defaultColumns,
		type Row,
		type Column,
		RowData
	} from '../stores/TableStore';
	import type { ColumnTypes,  ColumnValueTypes} from '../stores/TableStore';
	import type { ColumnDef, TableOptions } from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import { get } from 'svelte/store';

	let rowCount = 0;

	const options = writable<TableOptions<{ [key: string]: ColumnValueTypes }>>({
		data: [],
		columns: [],
		getCoreRowModel: getCoreRowModel()
	});

	let table = createSvelteTable<{ [key: string]: ColumnValueTypes }>($options);

	const addRow = () => {
		const columnNames = get(ColumnData).map((column) => column.name);
		const data: { [key: string]: ColumnValueTypes } = Object.fromEntries(
			columnNames.map((name) => [
				name,
				$typeSchema[$ColumnData.filter((column) => column.name == name)[0].type]
			])
		);
		const row: Row = {
			id: rowCount,
			uuid: rowCount,
			data
		};
		RowData.set([...$RowData, row]);
		rowCount += 1;
	};

	const update_data = () => {
		$options = {
			data: get(RowData).map((val) => val.data),
			columns: get(defaultColumns),
			getCoreRowModel: getCoreRowModel()
		};
		table = createSvelteTable<{ [key: string]: ColumnValueTypes }>($options);
	};

	defaultColumns.subscribe(() => {
		update_data();
	});
	RowData.subscribe(() => {
		update_data();
	});
	ColumnData.subscribe(() => {
		update_data();
	});
</script>

<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			{#each $table.getHeaderGroups() as headerGroup}
				<tr class="hover">
					{#each headerGroup.headers as header}
						<th colSpan={header.colSpan}>
							{#if !header.isPlaceholder}
								<svelte:component
									this={flexRender(header.column.columnDef.header, header.getContext())}
								/>
							{/if}
						</th>
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody>
			{#each $table.getRowModel().rows as row}
				<tr>
					{#each row.getVisibleCells() as cell}
						<td>
							<svelte:component
								this={flexRender(cell.column.columnDef.cell, cell.getContext())}
								columnId={cell.column.columnDef.id}
								rowId={rowCount}
								type={cell.column.columnDef.meta?.type}
							/>
						</td>
					{/each}
				</tr>
			{/each}
			<tr>
				<td>
					<button class="btn" on:click={addRow}>New Row</button>
					<button
						class="btn"
						on:click={() => {
							console.log($RowData);
						}}>Print data</button
					>
				</td>
			</tr>
		</tbody>
	</table>
</div>
