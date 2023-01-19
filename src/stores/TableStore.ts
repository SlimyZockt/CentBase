import type { ColumnDef } from "@tanstack/svelte-table";
import { writable, type Writable } from "svelte/store";
import { z } from "zod";


export const columnsData: Writable<{ [key: string]: COLUMN_TYPES_VALUES }> = writable({});
export const defaultColumns: Writable<ColumnDef<{ [key: string]: COLUMN_TYPES_VALUES }>[]> = writable([]);

type TupleUnion<U extends string, R extends string[] = []> = {
    [S in U]: Exclude<U, S> extends never ? [...R, S] : TupleUnion<Exclude<U, S>, [...R, S]>;
}[U] & string[];

export const COLUMN_TYPES_SCHEMA = {
    "Int": 0,
    "Float": 0,
    "Bool": false,
    "String": "",
    "Enum": [""] as const,
    "File": "",
    "Image": "",
    "Color": {
        r: 0,
        g: 0,
        b: 0,
    },
    "List": [],
    "Property": [],
};


// export const temp = COLUMN_TYPES_KEYS.options.map(val => COLUMN_TYPES_SCHEMA[val])[0]
export const COLUMN_TYPES_KEYS = Object.keys(COLUMN_TYPES_SCHEMA) as Array<keyof typeof COLUMN_TYPES_SCHEMA>;
export type COLUMN_TYPES_VALUES = typeof COLUMN_TYPES_SCHEMA[keyof typeof COLUMN_TYPES_SCHEMA];

export type ColumnTypes = typeof COLUMN_TYPES_KEYS[0];