<script lang="ts">
  import type { ColumnTypes } from "src/stores/TableStore";
  export let type: ColumnTypes;
  export let columnId: number;
  export let rowId: number;
  export let data: {};

  import IntField from "$lib/Fields/IntField.svelte";
  import FloatField from "$lib/Fields/FloatField.svelte";
  import BoolField from "$lib/Fields/BoolField.svelte";
  import StringField from "$lib/Fields/StringField.svelte";
  import EnumField from "$lib/Fields/EnumField.svelte";
  import FileField from "$lib/Fields/FileField.svelte";
  import ImageField from "$lib/Fields/ImageField.svelte";
  import ColorField from "$lib/Fields/ColorField.svelte";
  import ListField from "$lib/Fields/ListField.svelte";
  import PropertyField from "$lib/Fields/PropertyField.svelte";
	import { onMount } from "svelte";
  
const COMPONENTS = {
      'Int': IntField,
      'Float': FloatField,
      'Bool': BoolField,
      'String': StringField,
      'Enum': EnumField,
      'File': FileField,
      'Image': ImageField,
      'Color': ColorField,
      'List': ListField,
      'Property': PropertyField,
    };

    onMount(() => {
      console.log(type);
    })
</script>


<div>
    <svelte:component this={COMPONENTS[type]} bind:data/>
</div>