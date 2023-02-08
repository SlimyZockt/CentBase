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
	import { get } from 'svelte/store';
	import FieldContainer from './FieldContainer.svelte';
	import Input from './Input.svelte';
	import { has, fromRecord  } from 'fp-ts/ReadonlyRecord';

	const CONFIG_TEMPLATE = fromRecord(get(defaultConfig));

	const getKeys = Object.keys as <T extends object>(obj: T) => Array<T extends T ? keyof T : never>;
	const getConfig = (type: ColumnTypes): ConfigType | undefined => has(type, CONFIG_TEMPLATE) ? CONFIG_TEMPLATE[type]: undefined;

	let columnCount = 0;
	let value: ColumnValueTypes

	let columnName = '';
	let columnType: ColumnTypes = 'Int';

	let validationErr = false;
	let creationSuccess = false;

	let configSchema = getConfig(columnType);
	let columnConfig: ConfigType = {} as ConfigType;

	// const defaultColumns: ColumnDef<typeof $columnsStructure>[] = []

	let temp: ConfigType | {} = configSchema == undefined ? {}: configSchema;
	let configKeys = getKeys(temp);
	type ConfigKey = (typeof configKeys)[0];
	type DistributedIdentity<T> = {
		[K in T extends unknown ? keyof T : never]: T extends { [_ in K]: infer V } ? V : never;
	};

	const getInputType = (configName: ConfigKey) => {
		type combinedConfigUnion = DistributedIdentity<typeof configSchema>;
		let temp = configSchema as combinedConfigUnion;
		let types = typeof temp[configName];
		switch (types) {
			case 'number':
				return 'number';
			case 'string':
				return 'text';
			case 'boolean':
				return 'checkbox';
			default: {
				if (Array.isArray(types)) {
					return 'enum';
				}
				return 'number';
			}
		}
	};

	const update_data = () => {
		if (columnName == '' || $ColumnData.filter(r => r.name == columnName).length > 0) {
			validationErr = true;
			setTimeout(() => (validationErr = false), 700);
			return;
		}

		defaultColumns.set([
			...get(defaultColumns),
			{
				accessorKey: columnName,
				id: columnName,
				cell: (info) => FieldContainer,
				meta: {
					type: columnType
				}
			}
		]);
		
		let tempColumn: Column = {
				id: columnCount,
				uuid: columnCount,
				config: columnConfig,
				name: columnName,
				type: columnType,
			}

		ColumnData.set([
			...get(ColumnData),
			tempColumn
		]);
		columnCount += 1;
		creationSuccess = true;
		setTimeout(() => (creationSuccess = false), 700);
	};

	const add_config = () => {
		configSchema = has(columnType, $defaultConfig) ? $defaultConfig[columnType] : undefined;
		// configKeys = getKeys(config);
	};

	const updateConfig = (val: CustomEvent<any>, configKey: ConfigKey) => {
		type combinedConfigUnion = DistributedIdentity<typeof configSchema>;
		(columnConfig as combinedConfigUnion)[configKey] = val.detail.value;
	};
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
		<span>Column Type:</span>
		<select
			id="column-type"
			class="select select-bordered select-ghost w-full max-w-xs"
			bind:value={columnType}
			on:change={add_config}
		>
			{#each COLUMN_TYPES_KEYS as ColumnType}
				<option>{ColumnType}</option>
			{/each}
		</select>
	</label>
	<br />
	{#each configKeys as con}
		<Input type={getInputType(con)} config={configSchema} on:change={(value) => updateConfig(value, con)}>
			{con} :
		</Input>
	{/each}
	<br />

	<button
		class="btn btn-primary"
		class:btn-error={validationErr}
		class:btn-success={creationSuccess}
		on:click={update_data}>Create Column</button
	>
</div>
