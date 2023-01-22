<script lang="ts">
	import {
		createColumnHelper,
		createSvelteTable,
		flexRender,
		getCoreRowModel
	} from '@tanstack/svelte-table';
	import {
		columnsData,
		COLUMN_TYPES_SCHEMA,
		COLUMN_TYPES_KEYS,
		defaultColumns
	} from '../stores/TableStore';
	import type { ColumnTypes, COLUMN_TYPES_VALUES } from '../stores/TableStore';
	import type { ColumnDef, TableOptions } from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import { get } from 'svelte/store';

	const options = writable<TableOptions<{ [key: string]: COLUMN_TYPES_VALUES }>>({
		data: [],
		columns: [],
		getCoreRowModel: getCoreRowModel()
	});

	let table = createSvelteTable<{ [key: string]: COLUMN_TYPES_VALUES }>($options);

	const addRow = () => {
		let temp: { [key: string]: COLUMN_TYPES_VALUES } = {};
		get(defaultColumns).forEach((cellDef) => {
			temp[cellDef.meta?.name as string] = COLUMN_TYPES_SCHEMA[cellDef.meta?.type as ColumnTypes];
		});
		console.log(temp);
		columnsData.set([...$columnsData, temp]);
	};

	const update_data = () => {
		$options = {
			data: get(columnsData),
			columns: get(defaultColumns),
			getCoreRowModel: getCoreRowModel()
		};
		table = createSvelteTable<{ [key: string]: COLUMN_TYPES_VALUES }>($options);
	};

	defaultColumns.subscribe(() => {update_data()});
	columnsData.subscribe(() => {update_data()});
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
								{...cell.column.columnDef.meta}
							/>
						</td>
					{/each}
				</tr>
			{/each}
			<tr>
				<td>
					<button class="btn" on:click={addRow}>New Row</button>
				</td>
			</tr>
		</tbody>
	</table>
</div>
