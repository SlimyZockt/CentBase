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

	sheets.subscribe((_) => {
		let cachedSheet = getCurrentSheet();
		if (cachedSheet !== undefined) {
			sheet = cachedSheet;
		}
	});
</script>

<div class="min-h-screen grid grid-rows-[auto_1fr_auto]">
	<Navbar />
	<div class="bg-base-200 grid grid-rows-[auto_1fr_auto] ">
		{#if $sheets.length > 0}
			<div class="tabs bg-neutral flex justify-center max-h-fit">
				{#each $sheets as sheet}
					<!-- svelte-ignore a11y-invalid-attribute -->
					<button
						class="tab tab-bordered"
						class:tab-active={sheet.uuid === $activeSheetUUID}
						on:click={() => updateTable(sheet.uuid)}
						>{sheet.id}
					</button>
				{/each}
			</div>
				<Table bind:sheet={sheet} />
				<div class="m-1 inline-grid grid-cols-[1fr_auto_auto_auto_1fr] gap-1">
					<br/>
					<RowCreator bind:sheet={sheet} count={1}>
						Add Row
					</RowCreator>
					<RowCreator bind:sheet={sheet} count={5}>
						Add 5 Rows
					</RowCreator>
					<RowCreator bind:sheet={sheet} count={10}>
						Add 10 Rows
					</RowCreator>
					<br/>
				</div>
		{:else}
			<div class="hero min-h-full">
				<p class="text-center text-base text-base-content ">missing sheet</p>
			</div>
		{/if}
	</div>
	<Footer />
</div>
