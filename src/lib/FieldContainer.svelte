<script lang="ts">
  import {getCurrentSheet, activeSheetUUID, updateSheets } from "../stores/TableStore";
  import type {ColumnTypes, DataTypes, Row  } from "../stores/TableStore";
	import Input from "./Input.svelte";
	import { convertIntoInputType } from "./TypeConverting";

  export let rowId: number;
  export let columnUUID: string | undefined;

  let sheet = getCurrentSheet();

  let column = sheet?.columns.find(c => c.uuid == columnUUID);

  let row = sheet?.rows.find(r => r.id == rowId);

  // let data = row.data[columnId];
  let data: DataTypes | undefined = column === undefined ? undefined : row?.data[column?.name];

  const CONFIG = column === undefined ? undefined: column.config;

  const updateData = (data: DataTypes | undefined) => {
    let row = sheet?.rows.find(r => r.id == rowId);

    if (data === undefined || column === undefined || row === undefined) return;
    row.data[column.name] = data;


    let rowsCopy = sheet?.rows.map((r) => {
      if (columnUUID !== undefined && columnUUID in r.data && row !== undefined) {
        return row;
      }
      return r;
    })
    if (rowsCopy === undefined || sheet === undefined) return;

    sheet.rows = rowsCopy;
    updateSheets(sheet);
  }

  // $: updateData(data);


</script>

<div class="flex justify-center">
  <Input type={convertIntoInputType(column?.type)} config={CONFIG} inputValue={String(data)} on:change={e => updateData(e.detail)} checked={Boolean(data)}></Input>
</div>
