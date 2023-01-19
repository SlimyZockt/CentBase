import type { ColumnDef } from "@tanstack/svelte-table";
import { writable, type Writable } from "svelte/store";
import z from "zod";

export const columnsStructure: Writable<{[key: string]: COLUMN_TYPES_VAL}> = writable({});
export const defaultColumns: Writable<ColumnDef<{[key: string]: COLUMN_TYPES_VAL }>[]> = writable([]);

export const COLUMN_TYPES_SCHEMA = {
    "Int": z.number().int(),
    "Float": z.boolean(),
    "Bool": z.boolean(),
    "String": z.string(),
    "Enum": z.enum([""] as const),
    "File": z.string().url(),
    "Image": z.string().url(),
    "Color": z.object({
            r: z.number().int(),
            g: z.number().int(),
            b: z.number().int(),
          }),
    "List": z.array(z.any()),
    "Property": z.array(z.any()),
  };


export const COLUMN_TYPES_KEYS = z.object(COLUMN_TYPES_SCHEMA).keyof();
export const temp = COLUMN_TYPES_KEYS.options.map(val => COLUMN_TYPES_SCHEMA[val])[0]

export type COLUMN_TYPES_VAL = typeof temp;
export type ColumnTypes = z.infer<typeof COLUMN_TYPES_KEYS>;