<script lang="ts">
  import {
    defaultColumns,
    COLUMN_TYPES_SCHEMA,
    COLUMN_TYPES_KEYS,
    columnsData,
  } from "../stores/TableStore";
  import type { ColumnTypes } from "../stores/TableStore";

  import IntField from "./Fields/IntField.svelte";
  import FloatField from "./Fields/FloatField.svelte";
  import BoolField from "./Fields/BoolField.svelte";
  import StringField from "./Fields/StringField.svelte";
  import EnumField from "./Fields/EnumField.svelte";
  import FileField from "./Fields/FileField.svelte";
  import ImageField from "./Fields/ImageField.svelte";
  import ColorField from "./Fields/ColorField.svelte";
  import ListField from "./Fields/ListField.svelte";
  import PropertyField from "./Fields/PropertyField.svelte";

  import { config } from "process";
  import { get } from "svelte/store";
	import FieldContainer from "./FieldContainer.svelte";

  let columnName = "";
  let columnType: ColumnTypes;

  let validationErr = false;
  let creationSuccess = false;

  // const defaultColumns: ColumnDef<typeof $columnsStructure>[] = []

  const get_component = (inputType: ColumnTypes) => {
    const COMPONENTS = {
      "Int": IntField,
      "Float": FloatField,
      "Bool": BoolField,
      "String": StringField,
      "Enum": EnumField,
      "File": FileField,
      "Image": ImageField,
      "Color": ColorField,
      "List": ListField,
      "Property": PropertyField,
    };
    console.log(inputType);
    console.log(COMPONENTS[inputType]);
    return COMPONENTS[inputType];
  };

  let update_data = () => {
    if (columnName == "" || columnName in $columnsData) {
      validationErr = true;
      setTimeout(() => (validationErr = false), 700);
      return;
    }


    let temp = columnType
    defaultColumns.set([
      ...get(defaultColumns),
      {
        accessorKey: columnName,
        cell: (info) => FieldContainer,
        meta: {
          type: columnType,
          name: columnName,
          row: 0,
        },
      },
    ]);

    creationSuccess = true;
    setTimeout(() => (creationSuccess = false), 700);
    console.log($columnsData);
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
      {#each COLUMN_TYPES_KEYS as ColumnType}
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
