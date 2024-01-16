<script lang="ts">
	import Input from '../Input.svelte';
	import {
		sheets,
		getCurrentSheet,
		updateSheets,
		type SheetTypes,
		TypeData,

	} from '../../stores/TableStore';
	import { configuratorConfig, isOverlayOpen } from '../../stores/OverlayStore';
	import { get } from 'svelte/store';
	import type { ConfigType, DataTypes, Column, ColumnTypes, Settings, TypeSetting } from '../../stores/TableStore';
	import type { ColumnDef } from '@tanstack/svelte-table';
	import type { read } from 'fs';

	let columnCount = 0;

	let value: DataTypes;
	let enumValue: string;

	let columnData: Column;

	let columnName = '';
	let columnType: ColumnTypes = 'Int';

	let creationSuccess = false;
	let isNewEnumValid = true;

	let columnConfig: ConfigType = {} as ConfigType;

	let viewState = false;
	// const defaultColumns: ColumnDef<typeof $columnsStructure>[] = []

	type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
		k: infer I
	) => void
		? I
		: never;

	const availableTypes = (Object.keys(TypeData) as Array<keyof typeof TypeData>);

	const createColumn = () => {
		let sheet = getCurrentSheet();
		if (sheet === undefined) return;

		let newUuid = crypto.randomUUID();
		while (sheet.columns.find((v) => v.uuid == newUuid) !== undefined) {
			newUuid = crypto.randomUUID();
		}

		let newColumnDef: ColumnDef<{ [key: string]: DataTypes }> = {
			accessorKey: columnName,
			id: newUuid,
			header: newUuid,
			cell: info => info.getValue<DataTypes>(),
		};

		sheet.columnDef.push(newColumnDef);

		let newColumn: Column = {
			id: columnCount,
			uuid: newUuid,
			name: columnName,
			type: columnType
		};

		sheet.columns.push(newColumn);

		updateSheets(sheet);
		columnCount += 1;
		creationSuccess = true;
		setTimeout(() => (creationSuccess = false), 700);
	};

	const changeConfigType = (config: ConfigType | undefined, configType: ColumnTypes) => {
		// TODO:
	};

	const updateConfig = (val: CustomEvent<any>, configKey: string) => {
		// TODO:
	};

	const addEnumValue = () => {
		// !columnConfig.possibleVal.includes(enumValue)
		if (!('possibleVal' in columnConfig)) {
			columnConfig = { possibleVal: [] };
		}
		if (enumValue === undefined) return;
		validateNewEnum(enumValue);
		if (!isNewEnumValid) {
			return;
		}
		columnConfig = { possibleVal: [...columnConfig.possibleVal, enumValue] };
	};

	const removeEnumValue = (value: string) => {
		if (columnConfig != undefined && 'possibleVal' in columnConfig) {
			columnConfig.possibleVal = columnConfig.possibleVal.filter((val) => val !== value);
		}
	};

	const validateNewEnum = (enumValue: string) => {
		if ('possibleVal' in columnConfig) {
			isNewEnumValid = !columnConfig.possibleVal.includes(enumValue);
		}
	};

	configuratorConfig.subscribe((val) => {
		if (val === undefined) return;
		// changeConfigType(val.config, val.type);
		columnName = val.name;
		columnData = val;
	});

	isOverlayOpen.subscribe((isOpen) => {
		if (isOpen === true) return;
		columnName = '';
		columnData = {} as Column;
		columnType = 'Int';
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

	const settingTypeWrapper = (setting: SheetTypes[keyof SheetTypes]) => {
		if (!('settings' in setting) || setting.settings === undefined) return [];
		return setting.settings;
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
			class="input input-bordered flex-1 bg-base-200"
			bind:value={columnName}
		/>
	</label>
	<br />
	<label class="input-group" for="column-type">
		<span>Column Type:</span>
		<select
			id="column-type"
			class="select select-bordered select-ghost flex-1 bg-base-200"
			bind:value={columnType}
			on:change={() => changeConfigType(undefined, columnType)}
		>
			{#each availableTypes as ColumnType}
				<option>{ColumnType}</option>
			{/each}
		</select>
	</label>
	<br />
		{#if columnType == 'Enum'}
			<div class="input-group">
				<input
					id="inputLabel"
					class="input-bordered bg-base-200 file-input w-full p-3"
					type="text"
					class:input-error={!isNewEnumValid}
					placeholder="NewEnum"
					bind:value={enumValue}
				/>
				<button class="btn btn-accent" on:click={addEnumValue}>+</button>
			</div>
			<br />
			<div
				class="card max-h-56 bg-base-200 p-2 border-2 border-base-300 flex flex-grow flex-col"
			>
				<div class="card-body h-56 p-2 overflow-y-auto">
					{#if 'possibleVal' in columnConfig}
						{#each columnConfig.possibleVal as v}
							<div class="input-group max-w-full">
								<input
									id="inputLabel"
									class="input-bordered !bg-base-300 file-input w-full input-sm border-2 !border-base-100 border-r-0"
									type="text"
									disabled={true}
									value={v}
								/>
								<button class="btn btn-error btn-sm	border-2 !border-base-100 border-l-0" on:click={() => removeEnumValue(v)}>-</button>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{:else}
		<h2 class="font-bold">Settings</h2>
		<div class="inline-grid grid-cols-[1fr_auto] gap-3">
			<p />
			<p class="badge">Enabled</p>
			{#each settingTypeWrapper(TypeData[columnType]) as setting}
				<Input
				type={setting.inputType}
				setting={undefined}
				value={undefined}
				on:change={(value) => updateConfig(value, setting.name)}
				label={`${setting.name}:`}
				disabled={!setting.active}
				/>
				<Input type="checkbox" checked={setting.active} setting={undefined} on:change={() => setting.active = !setting.active}/>
			{/each}
		</div>
		{/if}
	<br />
	<button
		class="btn btn-primary"
		class:btn-success={creationSuccess}
		class:btn-disabled={!isCreationValidated}
		on:click={createColumn}>Create</button
	>
</div>
