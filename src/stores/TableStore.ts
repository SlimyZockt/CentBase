import { TEMP } from "$env/static/private";
import type { ColumnDef } from "@tanstack/svelte-table";
import { get, readable, writable, type Writable } from "svelte/store";
import { string, z } from "zod";

export const activeSheetUUID = writable("")
export const sheets: Writable<Sheet[]> = writable([]);

export const updateSheets = (sheet: Sheet) => {
    const cashedSheet = get(sheets).filter(s => s.uuid !== sheet.uuid);
    cashedSheet.push(sheet);
    sheets.set(cashedSheet);
};
export const getCurrentSheet = () => {
    return get(sheets).find(s => s.uuid === get(activeSheetUUID));
};

const TYPE_SCHEMA = {
    Int: 0,
    Float: 0,
    Bool: false,
    String: "",
    Enum: "" as const,
    File: "",
    Image: "",
    Color: {
        r: 0,
        g: 0,
        b: 0,
    },
    List: [],
    Property: [],
}

const DEFAULT_CONFIG = {
    Int: {
        max: Infinity,
        min: -Infinity,
        step: 1,
    },
    Float: {
        max: Infinity,
        min: -Infinity,
        step: 'any' as "any" | number,
    },
    String: {
        validation: 'none' as 'email' | 'url' | 'regex' | 'uuid' | 'none'
    },
    Enum: {
        possibleVal: [""]
    }

}

export const typeSchema = readable(TYPE_SCHEMA)
export const defaultConfig = readable(DEFAULT_CONFIG)


export const COLUMN_TYPES_KEYS = Object.keys(TYPE_SCHEMA) as Array<keyof typeof TYPE_SCHEMA>;
export type ConfigType = typeof DEFAULT_CONFIG[keyof typeof DEFAULT_CONFIG];

export type Sheet = {
    uuid: string,
    id: string,
    rows: Row[],
    columns: Column[],
    columnDef: ColumnDef<{ [key: string]: DataTypes }>[]
}

const TEXT = z.object({
    Text: z.string(),
});

const INT = z.object({
        Int: z.object({
            number: z.number().int(),
            step: z.number(),
            max: z.number().optional(),
            min: z.number().optional(),
        })
    });

const FLOAT = z.object({
    Float: z.object({
        number: z.number().int(),
        step: z.number(),
        max: z.number().optional(),
        min: z.number().optional(),
    })
});

const COLOR_RGB = z.object({
    Color_RGB: z.object({
    r: z.number(),
    g: z.number(),
    b: z.number(),
})
});

const SHEET_REFERENCE = z.object({
    SheetReference: z.object({
        sheetUUID: z.string().uuid(),
        sheetID: z.string(),
    })
});
const LINE_REFERENCE = z.object({
    LineReference: z.object({
    sheetUUID: z.string().uuid(),
    sheetID: z.string(),
    rowUUID: z.string().uuid(),
    rowID: z.string(),
})
})

const FILE_PATH = z.object({ FilePath: z.string().url() });
const IMAGE_PATH = z.object({ ImagePath: z.string().url() });

const DATE = z.object({ Date: z.date() });


const ColumnSchema = z.union([
    TEXT,
    INT,
    FLOAT,
    COLOR_RGB,
    SHEET_REFERENCE,
    LINE_REFERENCE,
    FILE_PATH,
    IMAGE_PATH,
    DATE
])

type ColumnSchemaType = z.infer<typeof ColumnSchema>

type KeysOfUnion<T> = T extends T ? keyof T : never;
type ValueOfObject<T, K extends KeysOfUnion<T>> =
    T extends infer U
    ? K extends keyof U
    ? T[K]
    : undefined
    : never

type ColumnTypes = KeysOfUnion<ColumnSchemaType>
type BaseTypes = ValueOfObject<ColumnSchemaType, ColumnTypes>

export type Column = {
    id: number
    uuid: string
    name: string
    type: ColumnTypes;
    config?: ConfigType
}



type List = Column[];
type UniqueProperty = Column[];
type DataTypes = BaseTypes | List | UniqueProperty;

// impl Zod Enum base Type

type Row = {
    id: number
    uuid: string
    data: {
        [key: string]: DataTypes
    }
}