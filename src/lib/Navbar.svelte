<script>
  import { isOverlayOpen } from "../stores/OverlayStore";
</script>

<div class="navbar bg-base-300">
  <div class="flex-1">
    <h1 class="text-2xl text-center">CentBase</h1>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1 justify-around ">
      <li><button class="btn mx-1">Save File</button></li>
      <li><button class="btn mx-1">Open File</button></li>
      <li><button class="btn mx-1">Create New Cheat</button></li>
      <li>
        <button
          on:click={() => {
            isOverlayOpen.set(true);
          }}
          class="btn-accent text-black mx-1">Create new Column</button
        >
      </li>
  </div>
</div>
