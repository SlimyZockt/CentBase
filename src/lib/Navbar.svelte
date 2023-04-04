<script>

  import { openColumnCreator, overlayMode, isOverlayOpen } from "../stores/OverlayStore";


  function openSheetCreator() {
    overlayMode.set("SHEET");
    isOverlayOpen.set(true);
    // temp
    // if (get(activeSheetUUID).length !== 0) return;
    // activeSheetUUID.set("1111-1111-1111")
    // sheets.set([...get(sheets), {
    //   uuid: "1111-1111-1111",
    //   id: "default",
    //   rows: [],
    //   columns: [],
    //   columnDef: [],
    // }])
    // console.log(get(sheets));
  }


</script>

<div class="navbar bg-base-300">
  <div class="flex-1">
    <h1 class="text-2xl text-center">CentBase</h1>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1 justify-around ">
      <li><button class="btn mx-1">Save File</button></li>
      <li><button class="btn mx-1"  >Open File</button></li>
      <li><button class="btn mx-1 btn-accent text-neutral" on:click={openSheetCreator}>new Sheet</button></li>
      <li>
        <button
          on:click={() => openColumnCreator()}
          class="btn-accent text-neutral mx-1 btn">new Column</button
        >
      </li>
  </div>
</div>
