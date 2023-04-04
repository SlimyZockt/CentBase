<script lang="ts">
  import {getCurrentSheet, typeSchema, activeSheetUUID, updateSheets } from "../stores/TableStore";
  import type {ColumnTypes, ColumnValueTypes, Row  } from "../stores/TableStore";
	import Input from "./Input.svelte";
	import { convertIntoInputType } from "./TypeConverting";
	import { onMount } from "svelte";
  export let type: ColumnTypes;
  export let rowId: number;
  export let columnUUID: string;

  let sheet = getCurrentSheet();
  
  let column = sheet?.columns.find(c => c.uuid == columnUUID);

  // let data = row.data[columnId];
  let data: ColumnValueTypes | undefined;



  const CONFIG = column === undefined ? undefined: column.config;

  const updateData = (data: ColumnValueTypes | undefined) => {
    let row = sheet?.rows.find(r => r.id == rowId);

    if (data === undefined || column === undefined || row === undefined) return;
    row.data[column.name] = data


    let rowsCopy = sheet?.rows.map((r) => {
      if (columnUUID in r.data && row !== undefined) {
        return row;
      }
      return r;
    })
    if (rowsCopy === undefined || sheet === undefined) return;

    sheet.rows = rowsCopy;
    updateSheets(sheet);
  }

  $: updateData(data)


  onMount(() => {
    if (column === undefined) return;
    let cachedRow = sheet?.rows.find(r => r.id == rowId);
    if (cachedRow === undefined) return;
    data = cachedRow.data[column.name];
  })
</script>

<div class="flex justify-center">
  <Input type={convertIntoInputType(type)} config={CONFIG} bind:value={data} inputValue={String(data)} checked={Boolean(data)}></Input>
</div>
