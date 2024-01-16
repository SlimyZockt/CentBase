<script lang="ts">
  import {getCurrentSheet, activeSheetUUID, updateSheets } from "../stores/TableStore";
  import type {ColumnTypes, DataTypes, Row  } from "../stores/TableStore";
	import Input from "./Input.svelte";

  export let rowId: number;
  export let columnUUID: string | undefined;

  let sheet = getCurrentSheet();

  let column = sheet?.columns.find(c => c.uuid == columnUUID);

  let row = sheet?.rows.find(r => r.id == rowId);

	type AvailableSettings = {
		max: number
		min: number
		step: number
		isInt: boolean
	} | {
		regex: string
	} | {
		enum: string[]
	}




  // let data = row.data[columnId];
  export let data: DataTypes;

  // const CONFIG = column === undefined ? undefined: column.config;

  const convertIntoInputType = (type: ColumnTypes | undefined) => {
      if (type === undefined) return "number";
      const COMPONENTS = {
          'Int': 'number',
          'Float': 'number',
          'Boolean': 'checkbox',
          'Text': 'text',
          'Enum': 'enum',
          'FilePath': 'file',
          'ImagePath': 'image',
          'ColorRGB': "color",
          'Date': "date",
          'List': "text",
          'Property': "text",
          'SheetReference': 'text',
          'LineReference': 'text',
      } as const;
      return COMPONENTS[type]
  }

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

<div class="flex justify-center min-w-full">
  <Input type={convertIntoInputType(column?.type)} value={data} on:change={e => updateData(e.detail)} checked={Boolean(data)} setting={column?.settingData}></Input>
</div>
