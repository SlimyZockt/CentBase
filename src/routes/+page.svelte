<script>
  import Navbar from "$lib/Navbar.svelte";
  import Table from "$lib/Table.svelte";
  import { isOverlayOpen } from "../stores/OverlayStore";

  import "../app.css";
  import { defaultColumns } from "../stores/TableStore";
</script>


<div class="">
  <Navbar />
  <br/>
  <Table/>
</div>