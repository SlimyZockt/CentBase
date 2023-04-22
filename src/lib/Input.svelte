<script lang="ts">
	import type { ColumnValueTypes, ConfigType, defaultConfig } from '../stores/TableStore';
	import { createEventDispatcher, onMount } from 'svelte';
	import { z } from 'zod';

	type Config = {
		number?: {
			max: number;
			min: number;
			step: number | 'any';
		};
		text?: {
			validation: 'email' | 'url' | 'regex' | 'uuid' | 'none';
			regex?: RegExp;
		};
		enum?: {
			possibleVal: string[];
		};
	};

	export let type: 'color' | 'checkbox' | 'file' | 'image' | 'text' | 'number' | 'enum';
	export let config: Config[keyof Config];
	export let value: ColumnValueTypes | undefined = undefined;
	export let inputValue = `${defaultValue(type)}`;
	export let checked = false;
	export let label: String = "";

	const dispatch = createEventDispatcher<{ change: ColumnValueTypes | undefined }>();

	let enumValue: string = '';
	let validate: boolean = true;

	const schema = (() => {
		if (config == undefined) return;
		if ('max' in config && 'min' in config && 'step' in config) {
			let temp = z.number().min(config.min).max(config.max);
			if (config.step != 'any') {
				temp = temp.step(Number(config.step));
			}
			return temp;
		} else if ('validation' in config) {
			let temp = z.string();
			switch (config.validation) {
				case 'email':
					temp = temp.email();
					break;
				case 'regex':
					temp = temp.regex(config.regex == undefined ? /./ : config.regex);
					break;
				case 'url':
					temp = temp.url();
					break;
				case 'uuid':
					temp = temp.uuid();
					break;
				default:
					break;
			}
			return temp;
		}
		// else if ('possibleVal' in config) {
		//     z.enum(config.possibleVal, {})
		// }
	})();

	const style = (() => {
		switch (type) {
			case 'checkbox':
				return 'checkbox';
			case 'file':
				return 'file-input w-full max-w-xs';
			case 'image':
				return 'file-input w-full max-w-xs';
			case 'text':
				return 'input w-full max-w-xs';
			case 'number':
				return 'input w-full';
			default:
				return '';
		}
	})();

	const setType = (node: HTMLInputElement) => {
		node.type = type;
	};

	const validateInput = (inputValue: string, checked: boolean) => {
		if (inputValue == undefined) return;
		if (type == 'text') {
			value = inputValue;
		} else if (type == 'color') {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(inputValue);
			value = result
				? {
						r: parseInt(result[1], 16),
						g: parseInt(result[2], 16),
						b: parseInt(result[3], 16)
				  }
				: { r: 0, g: 0, b: 0 };
		} else if (type == 'checkbox') {
			value = checked;
		} else if (type == 'number') {
			let inVal = Number(inputValue);
			if (schema !== undefined && config !== undefined && 'max' in config) {
				let val = schema.safeParse(inVal);
				validate = val.success;
				value = val.success ? val.data : 0;
				return;
			}
			value = inVal;
		} else if (type == 'enum' && config !== undefined && 'possibleVal' in config) {
			console.log(!config.possibleVal.includes(enumValue));
			validate = !config.possibleVal.includes(enumValue);
		}

		dispatch('change', value);
	};

	function defaultValue(inputType: typeof type) {
		switch (inputType) {
			case 'checkbox':
				return false;
			case 'color':
				return '#000000';
			case 'enum':
				return config !== undefined && 'possibleVal' in config ? config.possibleVal[0] : undefined;
			case 'number':
				return '0';
			case 'text':
				return '';
			default:
				return '0';
		}
	}

	$: validateInput(inputValue, checked);
</script>

<label for=".input" class:input-group={type !== 'checkbox' && label.length !== 0} class={type === 'checkbox' ? 'flex items-center justify-center' : 'min-w-full'}>
	<span>
		{label}
	</span>
	{#if type === 'checkbox'}
		<input
			id="inputLabel"
			{...config}
			class={`input-bordered bg-base-200 ${style} flex justify-center items-center`}
			class:input-error={!validate}
			type="checkbox"
			value={inputValue}
			bind:checked
			use:setType
		/>
	{:else if type == 'enum' && config != undefined && 'possibleVal' in config}
		<select class="select w-full max-w-xs input-bordered bg-base-200">
			{#each config.possibleVal as v}
				<option>{v}</option>
			{/each}
		</select>
	{:else}
		<input
			id="inputLabel"
			{...config}
			class={`input-bordered bg-base-200 ${style}`}
			class:input-error={!validate}
			bind:value={inputValue}
			use:setType
		/>
	{/if}
</label>
