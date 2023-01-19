<script lang="ts">
  import {
    createColumnHelper,
    createSvelteTable,
    flexRender,
    getCoreRowModel,
  } from "@tanstack/svelte-table";
  import {columnsStructure, COLUMN_TYPES_SCHEMA, COLUMN_TYPES_KEYS, defaultColumns, type COLUMN_TYPES_VAL} from '../stores/TableStore';
  import type {ColumnTypes} from '../stores/TableStore';

  import type { ColumnDef, TableOptions } from "@tanstack/svelte-table";
  import { writable } from "svelte/store";

  const defaultData: any[] = [];



  const options = writable<TableOptions<{[key: string]: COLUMN_TYPES_VAL}>>({
    data: [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
  });

  let table = createSvelteTable<{[key: string]: COLUMN_TYPES_VAL}>($options);

  defaultColumns.subscribe(val => {
    $options.columns = val;
    table = createSvelteTable<{[key: string]: COLUMN_TYPES_VAL}>($options)
  })
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
            this={flexRender(
              header.column.columnDef.header,
              header.getContext()
              )}
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
                
              />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
