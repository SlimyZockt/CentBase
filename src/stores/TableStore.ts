import type { ColumnDef } from "@tanstack/svelte-table";
import { get, readable, writable, type Writable } from "svelte/store";
import type { z } from "zod";

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
// export const RowData: Writable<Row[]> = writable([]);
// export const ColumnData: Writable<Column[]> = writable([]);
// export const defaultColumns: Writable<ColumnDef<{ [key: string]: ColumnValueTypes }>[]> = writable([]);

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
export type ColumnTypes = typeof COLUMN_TYPES_KEYS[0];
export type ColumnValueTypes = typeof TYPE_SCHEMA[keyof typeof TYPE_SCHEMA];
export type ConfigType = typeof DEFAULT_CONFIG[keyof typeof DEFAULT_CONFIG];

export type Column = {
    id: number
    uuid: string
    name: string
    type: ColumnTypes
    config?: ConfigType
}

export type Row = {
    id: number
    uuid: string
    data: {
        [key: string]: ColumnValueTypes
    }
}

export type Sheet = {
    uuid: string,
    id: string,
    rows: Row[],
    columns: Column[],
    columnDef: ColumnDef<{ [key: string]: ColumnValueTypes }>[]
}

type Text = {
    text: string,
    validation: z.StringValidation
}

type Int = {
    number: number
    step: number
    max?: number
    min?: number
}

type Float = {
    number: number
    step?: number
    max?: number
    min?: number
}
type RGBColor = {
    r: number,
    g: number,
    b: number,
};

type SheetReference = {
    sheetUUID: string
    sheetID: string
};
type LineReference = {
    sheetUUID: string
    sheetID: string
    rowUUID: string
    rowID: string
};

type FilePath = { path: string };
type ImagePath = { path: string };

type BaseTypes = Int | Float | Text | boolean | RGBColor | SheetReference | LineReference | FilePath | ImagePath;
type ColTypes = "Int" | "Float" | "Text" | "boolean" | "RGBColor" | "SheetReference" | "LineReference" | "FilePath" | "ImagePath" | "List" | "UniqueProperty";


type Col = {
    id: number
    uuid: string
    name: string
    type: ColTypes;
    config?: ConfigType
}



type List = Col[];
type UniqueProperty = Col[];
type DataTypes = BaseTypes | List | UniqueProperty;


type R0W = {
    id: number
    uuid: string
    data: {
        [key: string]: DataTypes
    }
}

