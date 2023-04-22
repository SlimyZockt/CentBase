<script lang="ts">
	import FieldContainer from '../FieldContainer.svelte';
	import Input from '../Input.svelte';
	import {
		typeSchema,
		COLUMN_TYPES_KEYS,
		defaultConfig,
		sheets,
		getCurrentSheet,
		updateSheets
	} from '../../stores/TableStore';
	import { configuratorConfig, isOverlayOpen } from '../../stores/OverlayStore';
	import { get } from 'svelte/store';
	import { has, fromRecord } from 'fp-ts/ReadonlyRecord';
	import type { ConfigType, ColumnValueTypes, Column, ColumnTypes } from '../../stores/TableStore';
	import type { ColumnDef } from '@tanstack/svelte-table';

	const CONFIG_TEMPLATE = fromRecord(get(defaultConfig));

	const getKeys = Object.keys as <T extends object>(obj: T) => Array<T extends T ? keyof T : never>;
	const getConfig = (type: ColumnTypes): ConfigType | undefined =>
		has(type, CONFIG_TEMPLATE) ? CONFIG_TEMPLATE[type] : undefined;

	let validationState: 'ERROR' | 'SUCCESS' | 'NONE' = 'NONE';

	let creationSuccess = false;
	let enumValue: string;
	let columnData: Column;
	let columnName = '';
	let columnType = '';

	const editColumn = () => {
		let sheet = getCurrentSheet();
		console.log($configuratorConfig);

		if (sheet === undefined) return;

		if (sheet.columns.find((c) => c.name === columnName)) return;

		sheet.columns.forEach((c) => {
			if (c.uuid === $configuratorConfig?.uuid) {
				c.name = columnName;
			}
		});

		console.log(sheet.columns);

		updateSheets(sheet);
		creationSuccess = true;
		setTimeout(() => (creationSuccess = false), 700);
	};

	let columnConfig: any = {};
	let isNewEnumValid = false;

	const addEnumValue = () => {
		// !columnConfig.possibleVal.includes(enumValue)
		if (!('possibleVal' in columnConfig)) {
			columnConfig = { possibleVal: [] };
		}
		validateNewEnum(enumValue);
		if (!isNewEnumValid) {
			return;
		}
		columnConfig = { possibleVal: [...columnConfig.possibleVal, enumValue] };
	};

	const removeEnumValue = (value: string) => {
		if (columnConfig != undefined && 'possibleVal' in columnConfig) {
			columnConfig.possibleVal = columnConfig.possibleVal.filter((val: string) => val !== value);
		}
	};

	const validateNewEnum = (enumValue: string) => {
		if ('possibleVal' in columnConfig) {
			isNewEnumValid = !columnConfig.possibleVal.includes(enumValue);
		}
	};

	const delateColumn = () => {
		let sheet = getCurrentSheet();
		if (sheet == undefined) return;

		sheet.columns = sheet.columns.filter((v) => v !== columnData);
		sheet.columnDef = sheet.columnDef.filter((v) => v.id !== columnData.uuid);

		sheet.rows.forEach((row) => {
			delete row.data[columnData.name];
		});

		updateSheets(sheet);
		configuratorConfig.set(undefined);
		isOverlayOpen.set(false);
	};

	isOverlayOpen.subscribe((isOpen) => {
		if (isOpen == true) return;
		columnName = '';
		columnData = {} as Column;
	});

	const isCreationValid = (columnName: string) => {
		let sheet = getCurrentSheet();
		if (sheet == undefined) return false;
		console.log(columnName);

		if (columnName === '' || sheet.columns.find((c) => c.name === columnName) !== undefined) {
			return false;
		}
		return true;
	};

	$: validateNewEnum(enumValue);
	$: isCreationValidated = isCreationValid(columnName);
</script>

<div class="form-control">
	<label class="input-group" for="column-name">
		<span>Column Name:</span>
		<input
			id="column-name"
			type="text"
			placeholder="New Column"
			class="input input-bordered max-w-xs w-full"
			bind:value={columnName}
		/>
	</label>
	<br />
	{#if columnType == 'Enum'}
		<div class="input-group">
			<input
				id="inputLabel"
				class="input-bordered bg-base-200 file-input w-full"
				type="text"
				class:input-error={!isNewEnumValid}
				bind:value={enumValue}
			/>
			<button class="btn btn-accent" on:click={addEnumValue}>+</button>
		</div>
		<br />
		{#if columnConfig != undefined && 'possibleVal' in columnConfig}
			<div
				class="card max-h-56 bg-neutral shadow-xl border-base-content p-2 border-2 flex flex-grow flex-col"
			>
				<div class="card-body h-56 p-2 overflow-y-auto">
					{#each columnConfig.possibleVal as v}
						<div class="input-group pt-1 max-w-full">
							<input
								id="inputLabel"
								class="input-bordered bg-base-200 file-input w-full input-sm"
								type="text"
								disabled={true}
								value={v}
							/>
							<button class="btn btn-error btn-sm	" on:click={() => removeEnumValue(v)}>-</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}

	<div class="inline-flex">
		<button
			class="btn btn-primary flex-grow"
			class:btn-success={creationSuccess}
			on:click={editColumn}>Edit</button
		>
		<div class="w-2" />
		<button class="btn flex-grow" on:click={delateColumn}>Delete</button>
	</div>
</div>
