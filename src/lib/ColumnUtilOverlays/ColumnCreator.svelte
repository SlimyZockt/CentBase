<script lang="ts">
	import FieldContainer from '../FieldContainer.svelte';
	import Input from '../Input.svelte';
	import {
		ColumnSchema,
		defaultConfig,
		sheets,
		getCurrentSheet,
		updateSheets

	} from '../../stores/TableStore';
	import { configuratorConfig, isOverlayOpen } from '../../stores/OverlayStore';
	import { get } from 'svelte/store';
	import { has, fromRecord } from 'fp-ts/ReadonlyRecord';
	import type { ConfigType, DataTypes, Column, ColumnTypes } from '../../stores/TableStore';
	import type { ColumnDef } from '@tanstack/svelte-table';

	const CONFIG_TEMPLATE = fromRecord(get(defaultConfig));

	const getKeys = Object.keys as <T extends object>(obj: T) => Array<T extends T ? keyof T : never>;
	const getConfig = (type: ColumnTypes): ConfigType | undefined =>
		has(type, CONFIG_TEMPLATE) ? CONFIG_TEMPLATE[type] : undefined;

	let columnCount = 0;

	let value: DataTypes;
	let enumValue: string;

	let columnData: Column;

	let columnName = '';
	let columnType: ColumnTypes = 'Int';

	let creationSuccess = false;
	let isNewEnumValid = true;

	let configSchema = getConfig(columnType);
	let columnConfig: ConfigType = {} as ConfigType;

	let viewState = false;
	// const defaultColumns: ColumnDef<typeof $columnsStructure>[] = []

	let temp: ConfigType | {} = configSchema == undefined ? {} : configSchema;
	let configKeys = getKeys(temp);
	type ConfigKey = (typeof configKeys)[0];

	const availableTypes = ["Int" , "Float" , "Enum" , "Text" , "Color" , "Sheet Reference" , "Line Reference" , "File Path" , "Image Path" , "Date"] as const;

	const getInputType = (configName: ConfigKey) => {
		switch (configName) {
			case 'min':
				return 'number';
			case 'max':
				return 'number';
			case 'step':
				return 'number';
			case 'validation':
				return 'text';
			case 'possibleVal':
				return 'enum';
		}
	};

	const createColumn = () => {
		let sheet = getCurrentSheet();
		if (sheet === undefined) return;

		let newUuid = crypto.randomUUID();
		while (sheet.columns.find((v) => v.uuid == newUuid) !== undefined) {
			newUuid = crypto.randomUUID();
		}

		let newColumnDef: ColumnDef<{ [key: string]: DataTypes }> = {
			accessorKey: newUuid,
			id: newUuid,
			header: newUuid,
			cell: (info) => FieldContainer
		};

		sheet.columnDef.push(newColumnDef);

		let newColumn: Column = {
			id: columnCount,
			uuid: newUuid,
			config: columnConfig,
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
		columnConfig = config == undefined ? ({} as ConfigType) : config;
		configSchema = getConfig(configType);
		let temp: ConfigType | {} = configSchema == undefined ? {} : configSchema;
		configKeys = getKeys(temp);
	};

	const updateConfig = (val: CustomEvent<any>, configKey: ConfigKey) => {
		// type combinedConfigUnion = DistributedIdentity<typeof configSchema>;
		(columnConfig as any)[configKey] = val.detail.value;
	};

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
			columnConfig.possibleVal = columnConfig.possibleVal.filter((val) => val !== value);
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
		viewState = !viewState;
	};

	configuratorConfig.subscribe((val) => {
		if (val === undefined) return;
		changeConfigType(val.config, val.type);
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
	}

	$: validateNewEnum(enumValue);
	$: isCreationValidated = isCreationValid(columnName)
</script>

<div class="form-control">
	<label class="input-group" for="column-name">
		<span>Column Name:</span>
		<input
			id="column-name"
			type="text"
			placeholder="New Column"
			class="input input-bordered max-w-xs w-full bg-base-200"
			bind:value={columnName}
		/>
	</label>
	<br />
	<label class="input-group" for="column-type">
		<span>Column Type:</span>
		<select
			id="column-type"
			class="select select-bordered select-ghost w-full max-w-xs bg-base-200"
			bind:value={columnType}
			on:change={() => changeConfigType(undefined, columnType)}
		>
			{#each availableTypes as ColumnType}
				<option>{ColumnType}</option>
			{/each}
		</select>
	</label>
	<br />
	{#key configSchema}
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
		{:else}
		<h2 class="font-bold">Settings</h2>
		<div class="inline-grid grid-cols-[1fr_auto] gap-3">
			<p></p>
			<p class="badge">Enabled</p>
			{#each configKeys as con}
			<Input
			type={getInputType(con)}
			config={configSchema}
			on:change={value => updateConfig(value, con)}
			label={`${con}:`}
			/>
			<Input type="checkbox" checked={true} config={undefined} />
			{/each}
		</div>
		{/if}
	{/key}
	<br />
    <button
        class="btn btn-primary"
        class:btn-success={creationSuccess}
        class:btn-disabled={!isCreationValidated}
        on:click={createColumn}>Create</button
    >
</div>
