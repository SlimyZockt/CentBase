<script lang="ts">
  import Field from "../../components/Field.svelte";

  export let config: {
    min: Number,
    max: Number,
    step: Number
  }

</script>
<input type="number"/>