<script lang="ts">
	import type { DataTypes, Settings, SheetTypes, SettingsData } from '../stores/TableStore';
	import { TypeData } from '../stores/TableStore';
	import { createEventDispatcher } from 'svelte';
	import { string, z, type TypeOf } from 'zod';

	type AvailableSettings =
		| {
				number: {
					max: number;
					min: number;
					step: number;
					isInt: boolean;
				},
				text: {
					regex: string;
				},
				enum: {
					values: string[];
				},
		  };

	export let type: 'number' | 'checkbox' | 'text' | 'enum' | 'file' | 'image' | 'color' | 'date';
	export let setting: Pick<AvailableSettings, typeof type extends keyof AvailableSettings ? typeof type : any > | undefined;
	export let value: DataTypes | undefined;
	export let checked = false;
	export let label: String = '';
	export let disabled = false;

	const dispatch = createEventDispatcher<{ change: DataTypes | undefined }>();

	let enumValue: string = '';
	let validate: boolean = true;

	// const schema = (() => {
	// 	if (config == undefined) return;
	// 	if ('max' in config && 'min' in config && 'step' in config) {
	// 		let temp = z.number().min(config.min).max(config.max);
	// 		if (config.step != 'any') {
	// 			temp = temp.step(Number(config.step));
	// 		}
	// 		return temp;
	// 	} else if ('validation' in config) {
	// 		let temp = z.string();
	// 		switch (config.validation) {
	// 			case 'email':
	// 				temp = temp.email();
	// 				break;
	// 			case 'regex':
	// 				temp = temp.regex(config.regex == undefined ? /./ : config.regex);
	// 				break;
	// 			case 'url':
	// 				temp = temp.url();
	// 				break;
	// 			case 'uuid':
	// 				temp = temp.uuid();
	// 				break;
	// 			default:
	// 				break;
	// 		}
	// 		return temp;
	// 	}
	// 	// else if ('possibleVal' in config) {
	// 	//     z.enum(config.possibleVal, {})
	// 	// }
	// })();

	const style = (() => {
		switch (type) {
			case 'checkbox':
				return 'checkbox';
			case 'file':
				return 'file-input flex-1';
			case 'image':
				return 'file-input flex-1';
			case 'text':
				return 'input flex-1';
			case 'number':
				return 'input flex-1';
			default:
				return '';
		}
	})();

	const setType = (node: HTMLInputElement) => {
		node.type = type;
	};

	const convertValue = (value: DataTypes, valueType: typeof type, setting: SettingsData) => {
		if (valueType === 'number') {
		}
	};

	// const validateInput = (inputValue: string, checked: boolean) => {
	// 	if (inputValue === undefined) return;
	// 	if (type == 'text') {
	// 		value = inputValue;
	// 	} else if (type == 'color') {
	// 		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(inputValue);
	// 		value = result
	// 			? {
	// 					r: parseInt(result[1], 16),
	// 					g: parseInt(result[2], 16),
	// 					b: parseInt(result[3], 16)
	// 			  }
	// 			: { r: 0, g: 0, b: 0 };
	// 	} else if (type == 'checkbox') {
	// 		value = checked;
	// 	} else if (type == 'number') {
	// 		let inVal = Number(inputValue);
	// 		validate = true;
	// 		if (schema !== undefined && config !== undefined && 'max' in config) {
	// 			let val = schema.safeParse(inVal);
	// 			validate = val.success;
	// 			value = val.success ? val.data : 0;
	// 			return;
	// 		}
	// 		value = inVal;
	// 	} else if (type == 'enum' && config !== undefined && 'possibleVal' in config) {
	// 		console.log(!config.possibleVal.includes(enumValue));
	// 		validate = !config.possibleVal.includes(enumValue);
	// 	}

	// 	dispatch('change', value);
	// };

	function defaultValue(inputType: typeof type) {
		switch (inputType) {
			case 'checkbox':
				return false;
			case 'color':
				return '#000000';
			case 'enum':
				return;
			// return config !== undefined && 'possibleVal' in config ? config.possibleVal[0] : undefined;
			case 'number':
				return '0';
			case 'text':
				return '';
			default:
				return '0';
		}
	}

	// $: validateInput(inputValue, checked);
</script>

<label
	for=".input"
	class={type === 'checkbox' ? 'flex items-center justify-center' : 'min-w-full flex'}
	class:input-group={type !== 'checkbox' && label.length !== 0}
	class:!opacity-60={disabled}
	class:input-disabled={disabled}
>
	<span>
		{label}
	</span>
	{#if type === 'checkbox'}
		<!-- {...config} -->
		<input
			id="inputLabel"
			{disabled}
			class={`input-bordered ${style} flex justify-center items-center`}
			class:input-error={!validate}
			type="checkbox"
			{value}
			bind:checked
			use:setType
		/>
	{:else if type == 'enum' && setting !== undefined && 'enum' in setting}
		<select class="select flex-1 input-bordered bg-base-200">
			{#each setting.enum as value}
				<option>{value}</option>
			{/each}
		</select>
	{:else}
		<!-- {...config} -->
		<input
			{disabled}
			max={setting !== undefined && 'max' in setting ? setting.max : ''}
			min={setting !== undefined && 'min' in setting ? setting.min : ''}
			step={setting !== undefined && 'step' in setting ? setting.step : 'any'}
			pattern={setting !== undefined && 'regex' in setting ? setting.regex : ''}
			id="inputLabel"
			class={` ${style} input-bordered bg-base-200 max-w`}
			class:input-error={!validate}
			{value}
			use:setType
		/>
	{/if}
</label>
