import type { ColumnDef } from "@tanstack/svelte-table";
import { get, readable, writable, type Writable } from "svelte/store";
import { z } from "zod";

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

export const defaultConfig = readable(DEFAULT_CONFIG)


export type ConfigType = typeof DEFAULT_CONFIG[keyof typeof DEFAULT_CONFIG];

export type Sheet = {
    uuid: string,
    id: string,
    rows: Row[],
    columns: Column[],
    columnDef: ColumnDef<{ [key: string]: DataTypes }>[]
}

const TEXT = z.object({
    Text: z.string().default(""),
});

const INT = z.object({
    Int: z.object({
        number: z.number().int().default(0),
        step: z.number().optional(),
        max: z.number().optional(),
        min: z.number().optional(),
    })
});

const FLOAT = z.object({
    Float: z.object({
        number: z.number().int().default(0),
        step: z.number(),
        max: z.number().optional(),
        min: z.number().optional(),
    })
});

const COLOR_RGB = z.object({
    Color_RGB: z.object({
        r: z.number().min(0).max(255).default(0),
        g: z.number().min(0).max(255).default(0),
        b: z.number().min(0).max(255).default(0),
    })
});

const SHEET_REFERENCE = z.object({
    SheetReference: z.object({
        sheetUUID: z.string().uuid().default(""),
        sheetID: z.string().default(""),
    })
});
const LINE_REFERENCE = z.object({
    LineReference: z.object({
        sheetUUID: z.string().uuid().default(""),
        sheetID: z.string().default(""),
        rowUUID: z.string().uuid().default(""),
        rowID: z.string().default(""),
    })
})

const FILE_PATH = z.object({ FilePath: z.string().url().default("") });
const IMAGE_PATH = z.object({ ImagePath: z.string().url().default("") });

const DATE = z.object({ Date: z.date().default(new Date()) });


const ENUM = z.object({ Enum: z.enum([""]) });


export const ColumnSchema = z.union([
    TEXT,
    INT,
    FLOAT,
    COLOR_RGB,
    SHEET_REFERENCE,
    LINE_REFERENCE,
    FILE_PATH,
    IMAGE_PATH,
    DATE,
    ENUM
])

type ColumnSchemaType = z.infer<typeof ColumnSchema>

type KeysOfUnion<T> = T extends T ? keyof T : never;
type ValueOfObject<T, K extends KeysOfUnion<T>> =
    T extends infer U
    ? K extends keyof U
    ? T[K]
    : undefined
    : never


export type ColumnTypes = KeysOfUnion<ColumnSchemaType>
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
export type DataTypes = BaseTypes | List | UniqueProperty;

// impl Zod Enum base Type

export type Row = {
    id: number
    uuid: string
    data: {
        [key: string]: DataTypes
    }
}