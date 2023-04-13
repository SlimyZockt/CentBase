<script lang="ts">
  	import Footer from '$lib/Footer.svelte';

	import Navbar from '$lib/Navbar.svelte';
	import Table from '$lib/Table.svelte';
	import { isOverlayOpen } from '../stores/OverlayStore';

	import '../app.css';
	import { activeSheetUUID, sheets, type Sheet, getCurrentSheet } from '../stores/TableStore';
	import RowCreator from '$lib/RowCreator.svelte';

	let sheet: Sheet;

	const updateTable = (sheetUUID: string) => {
		activeSheetUUID.set(sheetUUID);
		let cachedSheet = getCurrentSheet();
		if (cachedSheet !== undefined) {
			sheet = cachedSheet;
		}
	};

	sheets.subscribe( _ => {
		let cachedSheet = getCurrentSheet();
		if (cachedSheet !== undefined) {
			sheet = cachedSheet;
		}
	});

</script>

<div class="min-h-screen grid grid-rows-[auto_1fr_auto]">
	<Navbar />
	<div class="bg-base-200">
		{#if $sheets.length > 0}
			<div class="tabs bg-neutral flex justify-center">
				{#each $sheets as sheet}
					<!-- svelte-ignore a11y-invalid-attribute -->
					<button class="tab tab-bordered" class:tab-active={sheet.uuid === $activeSheetUUID} on:click={() => updateTable(sheet.uuid)}
						>{sheet.id}
					</button>
				{/each}
			</div>
				{#key sheet}
				<div class="">
					<Table sheet={sheet}/>
				</div>
					<RowCreator sheet={sheet}/>
				{/key}
		{:else}
			<div class="hero min-h-full">
				<p class="text-center text-base text-base-content ">missing sheet</p>
			</div>
		{/if}
	</div>
	<Footer />
</div>
