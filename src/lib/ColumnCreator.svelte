<script lang="ts">
  import {
    columnsStructure,
    defaultColumns,
    COLUMN_TYPES_SCHEMA,
    COLUMN_TYPES_KEYS,
  } from "../stores/TableStore";
  import type { ColumnTypes } from "../stores/TableStore";

  let columnName = "";
  let columnType: ColumnTypes;

  let validationErr = false;
  let creationSuccess = false;

  // const defaultColumns: ColumnDef<typeof $columnsStructure>[] = []

  let update_data = () => {
    if (columnName == "" || columnName in $columnsStructure) {
      validationErr = true;
      setTimeout(() => (validationErr = false), 700);
      return;
    }

    $columnsStructure[columnName] = COLUMN_TYPES_SCHEMA[columnType];
    defaultColumns.set([
      ...$defaultColumns,
      {
        accessorKey: columnName,
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
    ]);

    creationSuccess = true;
    setTimeout(() => (creationSuccess = false), 700);
    console.log($columnsStructure);
    console.log($defaultColumns);
  };
</script>

<div class="form-control">
  <label class="input-group" for="column-name">
    <span>Column Name:</span>
    <input
      id="column-name"
      type="text"
      placeholder="New Column"
      class="input input-bordered max-w-xs w-full"
      bind:value={columnName}
    />
  </label>
  <br />
  <label class="input-group" for="column-type">
    <span>Column Type:</span>
    <select
      id="column-type"
      class="select select-bordered select-ghost w-full max-w-xs"
      bind:value={columnType}
    >
      {#each COLUMN_TYPES_KEYS.options as ColumnType}
        <option>{ColumnType}</option>
      {/each}
    </select>
  </label>
  <br />
  <button
    class="btn btn-primary"
    class:btn-error={validationErr}
    class:btn-success={creationSuccess}
    on:click={update_data}>Create Column</button
  >
</div>
