<script lang="ts">
  import type { ColumnTypes } from "src/stores/TableStore";
  import {RowData, typeSchema, ColumnData } from "../stores/TableStore";
	import { onMount } from "svelte";
	import Input from "./Input.svelte";
	import { convertIntoInputType } from "./TypeConvering";
  export let type: ColumnTypes;
  export let rowId: number;
  export let columnId: string;

  let row = $RowData.filter(r => r.id == rowId)[0];
  let column = $ColumnData.filter(r => r.name == columnId)[0];
  // let data = row.data[columnId];
  let data: any;


  const CONFIG = column == undefined ? undefined: column.config;

  onMount(() =>{
    console.log($ColumnData);
    console.log(columnId);
    console.log($ColumnData.filter(r => r.name == columnId));
  })


  const update_data = () => {

  }
</script>

<div>
  <Input type={convertIntoInputType(type)} config={CONFIG} value={data}></Input>
</div>
