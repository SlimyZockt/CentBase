<script lang="ts">
    import type { ColumnValueTypes, ConfigType} from "../stores/TableStore";
    import { createEventDispatcher } from 'svelte';

    export let type: "color" | "checkbox" | "file" | "image" | "text"| "number" | "enum"
    export let config: ConfigType | undefined | {}
    export let value: ColumnValueTypes = "";
    
	const dispatch = createEventDispatcher();
    const style = (() => {
        switch (type) {
            case 'checkbox': return 'checkbox'
            case 'file': return 'file-input w-full max-w-xs'
            case 'image': return 'file-input w-full max-w-xs'
            case 'text': return 'input w-full max-w-xs'
            case 'number': return 'input'
            default: return ''
        }
    })()

    const setType = (node: HTMLInputElement) => {
        node.type = type;
    };
</script>


{#if type != "enum"}
    <label for=".input"><slot/></label>
    <input id="inputLabel" {...config} class={`input-bordered bg-base-200 ${style}` } on:change={() => {dispatch('change', {value: value})}} bind:value use:setType>
{/if}
{#if type == "enum"}
    <select class="select w-full max-w-xs input-bordered bg-base-200" >
        {#if (config != undefined && 'possibleVal' in config)}
            {#each config.possibleVal as v}
                <option>{v}</option>
            {/each}
        {/if}
    </select>
{/if}