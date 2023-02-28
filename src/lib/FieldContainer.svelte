<script lang="ts">
  import type { ColumnTypes, ColumnValueTypes, Row } from "src/stores/TableStore";
  import {RowData, typeSchema, ColumnData } from "../stores/TableStore";
	import Input from "./Input.svelte";
	import { convertIntoInputType } from "./TypeConvering";
	import { get } from "svelte/store";
	import { onMount } from "svelte";
  export let type: ColumnTypes;
  export let rowId: number;
  export let columnUUID: string;

  let column = $ColumnData.find(c => c.uuid == columnUUID);

  // let data = row.data[columnId];
  let data: ColumnValueTypes | undefined;



  const CONFIG = column === undefined ? undefined: column.config;

  const updateData = (data: ColumnValueTypes | undefined) => {
    let row = $RowData.find(r => r.id == rowId)

    if (data === undefined || column === undefined || column.name === undefined || row === undefined) return;
    row.data[column.name] = data


    let newRowData = get(RowData).map((r) => {
      if (columnUUID in r.data && row !== undefined) {
        return row;
      }
      return r
    })
    if (newRowData == undefined) return;
    RowData.set(newRowData);
  }

  $: updateData(data)


  onMount(() => {
    if (column === undefined) return;
    let cachedRow = $RowData.find(r => r.id == rowId);
    if (cachedRow === undefined) return;
    data = cachedRow.data[column.name];
  })
</script>

<div class="flex justify-center">
  <Input type={convertIntoInputType(type)} config={CONFIG} bind:value={data} inputValue={String(data)} checked={Boolean(data)}></Input>
</div>
