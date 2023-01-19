<script lang="ts">
  import {
    createColumnHelper,
    createSvelteTable,
    flexRender,
    getCoreRowModel,
  } from "@tanstack/svelte-table";

  import type { ColumnDef, TableOptions } from "@tanstack/svelte-table";
  import { writable } from "svelte/store";

  type Ingredient = {
    name: string;
    factory_name: string;
    amount: number;
    extras: Object[] | null;
  };

  type Item = {
    name: string;
    recipe: Ingredient[];
    item_type: "TOOL" | "BUILDING" | "RESOURCE";
  };

  const defaultData: Item[] = [
    {
      name: "Copper",
      recipe: [
        {
          name: "Iron",
          amount: 10,
          factory_name: "Altar",
          extras: null,
        },
        {
          name: "Quartz",
          amount: 2,
          factory_name: "None",
          extras: null,
        },
      ],
      item_type: "TOOL",
    },
    {
      name: "Iron",
      recipe: [
        {
          name: "Bronze",
          amount: 10,
          factory_name: "Altar",
          extras: null,
        },
        {
          name: "Quartz",
          amount: 4,
          factory_name: "None",
          extras: null,
        },
      ],
      item_type: "TOOL",
    },
  ];

  const columnHelper = createColumnHelper<Item>();

  const defaultColumns: ColumnDef<Item>[] = [
    {
      accessorKey: "name",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    },
    {
      header: "recipes",
      footer: (props) => props.column.id,
      cell: (info) => info.getValue(),
      accessorKey: "recipe",
      columns: [
        {
          id: "recipe",
          accessorFn: (row) => row.recipe.join(),
          cell: (info) => info.getValue().map((val: Ingredient) => val.name),
          header: () => "Ingredient_name",
          footer: (props) => props.column.id,
        },
        {
          accessorFn: (row) => row.recipe,
          id: "recipe",
          cell: (info) => info.getValue().map((val: Ingredient) => val.amount),
          header: () => "Ingredient_amount",
          footer: (props) => props.column.id,
        },
        {
          accessorFn: (row) => row.recipe,
          id: "recipe",
          cell: (info) =>
            info.getValue().map((val: Ingredient) => val.factory_name),
          header: () => "factory_name",
          footer: (props) => props.column.id,
        },
      ],
    },
    {
      accessorKey: "item_type",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    },
  ];

  const options = writable<TableOptions<Item>>({
    data: defaultData,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const table = createSvelteTable<Item>(options);
  console.log(table.subscribe);
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
