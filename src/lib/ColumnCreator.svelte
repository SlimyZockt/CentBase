<script lang="ts">
  import type { ColumnDef } from "@tanstack/svelte-table";
  import z from "zod";
  // import {columnsStructure} from '../stores/TableStore';

  const COLUMN_TYPES = 
{   "Int": z.number().int(),
    "Float": z.boolean(),
    "Bool": z.boolean(),
    "String": z.string(),
    "Enum": z.enum([""] as const),
    "File": z.string().url(),
    "Image": z.string().url(),
    "Color": z.object({
            r: z.number().int(),
            g: z.number().int(),
            b: z.number().int(),
          }),
    "List": z.array(z.any()),
    "Property": z.array(z.any()),
  };

  // const temp = z.enum(COLUMN_TYPES);
  
  const COLUMN_TYPES_KEYS = z.object(COLUMN_TYPES).keyof();
  const temp = COLUMN_TYPES_KEYS.options.map(val => COLUMN_TYPES[val])[0]
  type COLUMN_TYPES_VAL = typeof temp;
  type ColumnTypes = z.infer<typeof COLUMN_TYPES_KEYS>;

  let columnName = "";
  let columnType: ColumnTypes;

  let validationErr = false;
  let creationSuccess = false;

  let columnsStructure: {[key: string]: COLUMN_TYPES_VAL} = {}
  // const defaultColumns: ColumnDef<typeof $columnsStructure>[] = []

  let update_data = () => {
    if (columnName == "" || columnName in columnsStructure) {
      validationErr = true
      setTimeout(() => validationErr=false, 700)
      return
    }

    columnsStructure[columnName] = COLUMN_TYPES[columnType]
    creationSuccess = true
    setTimeout(() => creationSuccess=false, 700)
    console.log(columnsStructure);
  }

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
  <button class="btn btn-primary" class:btn-error={validationErr} class:btn-success={creationSuccess} on:click={update_data}>Create Column</button>
</div>
