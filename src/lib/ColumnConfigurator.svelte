<script lang="ts">
	import {
		defaultColumns,
		RowData,
		typeSchema,
		ColumnData,
		COLUMN_TYPES_KEYS,
		defaultConfig,
		type ConfigType,
		type ColumnValueTypes,
		type Column
	} from '../stores/TableStore';
	import type { ColumnTypes } from '../stores/TableStore';
	import { configuratorConfig, isOverlayOpen, resetView } from '../stores/OverlayStore';
	import { get } from 'svelte/store';
	import FieldContainer from './FieldContainer.svelte';
	import Input from './Input.svelte';
	import { has, fromRecord } from 'fp-ts/ReadonlyRecord';
	import type { ColumnDef } from '@tanstack/svelte-table';

	const CONFIG_TEMPLATE = fromRecord(get(defaultConfig));

	const getKeys = Object.keys as <T extends object>(obj: T) => Array<T extends T ? keyof T : never>;
	const getConfig = (type: ColumnTypes): ConfigType | undefined =>
		has(type, CONFIG_TEMPLATE) ? CONFIG_TEMPLATE[type] : undefined;

	let columnCount = 0;
	let configurationMode: 'edit' | 'create' = 'create';

	let value: ColumnValueTypes;
	let enumValue: string;

	let columnData: Column;

	let columnName = '';
	let columnType: ColumnTypes = 'Int';

	let validationErr = false;
	let creationSuccess = false;
	let isNewEnumValid = true;

	let configSchema = getConfig(columnType);
	let columnConfig: ConfigType = {} as ConfigType;

	let viewState = false
	// const defaultColumns: ColumnDef<typeof $columnsStructure>[] = []

	let temp: ConfigType | {} = configSchema == undefined ? {} : configSchema;
	let configKeys = getKeys(temp);
	type ConfigKey = (typeof configKeys)[0];

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
		if (columnName == '' || $ColumnData.filter((r) => r.name == columnName).length > 0) {
			validationErr = true;
			setTimeout(() => (validationErr = false), 700);
			return;
		}

		let newUuid = crypto.randomUUID();
		const COLUMN_DATA = get(ColumnData);
		while (COLUMN_DATA.find((v) => v.uuid == newUuid) !== undefined) {
			newUuid = crypto.randomUUID();
		}
		
		let tempColumnDef: ColumnDef<{[key: string]: ColumnValueTypes}> = {
				accessorKey: columnName,
				id: newUuid,
				header: columnName,
				cell: (info) => FieldContainer,
				meta: {
					type: columnType
				}
			}

		defaultColumns.set([
			...get(defaultColumns),
			tempColumnDef
		]);

		let tempColumn: Column = {
			id: columnCount,
			uuid: newUuid,
			config: columnConfig,
			name: columnName,
			type: columnType
		};

		ColumnData.set([...COLUMN_DATA, tempColumn]);
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
		let filteredColumn = get(ColumnData).filter((v) => v !== columnData);
		let filteredColumnDef = get(defaultColumns).filter((v) => v.id !== columnData.uuid);
		let filteredRowData = get(RowData);

		filteredRowData.forEach((row) => {
			delete row.data[columnData.name];
		});

		ColumnData.set(filteredColumn);
		RowData.set(filteredRowData);
		defaultColumns.set(filteredColumnDef);
		configuratorConfig.set(undefined);
		isOverlayOpen.set(false);
		viewState = !viewState;
		resetView.set(viewState)
	};

	configuratorConfig.subscribe((val) => {
		if (val === undefined) {
			configurationMode = 'create';
			return;
		}
		changeConfigType(val.config, val.type);
		columnName = val.name;
		columnData = val;
		configurationMode = 'edit';
	});

	isOverlayOpen.subscribe((isOpen) => {
		if (isOpen == true) return;
		columnName = '';
		columnData = {} as Column;
		columnType = 'Int';
	});

	$: validateNewEnum(enumValue);
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
	<label class="input-group" for="column-type">
		<span class:btn-disabled={configurationMode == 'edit'}>Column Type:</span>
		<select
			id="column-type"
			class="select select-bordered select-ghost w-full max-w-xs"
			bind:value={columnType}
			on:change={() => changeConfigType(undefined, columnType)}
			disabled={configurationMode == 'edit'}
			class:btn-disabled={configurationMode == 'edit'}
		>
			{#each COLUMN_TYPES_KEYS as ColumnType}
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
			{#each configKeys as con}
				<Input
					type={getInputType(con)}
					config={configSchema}
					on:change={(value) => updateConfig(value, con)}
					inputValue={String(columnConfig[con])}
				>
					{con} :
				</Input>
			{/each}
		{/if}
	{/key}
	<br />

	{#if configurationMode == 'create'}
		<button
			class="btn btn-primary"
			class:btn-error={validationErr}
			class:btn-success={creationSuccess}
			on:click={createColumn}>Create</button
		>
	{:else}
		<div class="inline-flex">
			<button
				class="btn btn-primary flex-grow"
				class:btn-error={validationErr}
				class:btn-success={creationSuccess}
				on:click={createColumn}>Edit</button
			>
			<div class="w-2" />
			<button class="btn flex-grow" on:click={delateColumn}>Delete</button>
		</div>
	{/if}
</div>
