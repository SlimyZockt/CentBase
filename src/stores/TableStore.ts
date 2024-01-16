import type { ColumnDef } from "@tanstack/svelte-table";
import type { ReadonlyRecord } from "fp-ts/lib/ReadonlyRecord";
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

type StringLiteral<T> = T extends string ? string extends T ? never : T : never;


type Type<T, X extends string> = {
    [x in StringLiteral<X>]: {
        validation?: z.ZodType<T>,
        readonly settings?: Readonly<TypeSetting[]>,
        displayName?: string
        defaultValue: T,
    }
};

export type SheetTypes =
    Type<string, "Text"> &
    Type<number, "Int"> &
    Type<number, 'Float'> &
    Type<{ r: number, g: number, b: number }, 'ColorRGB'> &
    Type<{ sheetUUID: string, sheetID: string }, 'SheetReference'> &
    Type<{ sheetUUID: string, sheetID: string, rowUUID: string, rowId: string }, 'LineReference'> &
    Type<string, 'ImagePath'> & Type<string, 'FilePath'> &
    Type<Date, 'Date'> &
    Type<string[], 'Enum'> &
    Type<boolean, 'Boolean'>;

type S = Readonly<Exclude<Readonly<(typeof TypeData)>[keyof SheetTypes]['settings'], undefined>>[0]



export const TypeData: SheetTypes = {
    Float: {
        defaultValue: 0,
        settings: [
            {
                name: 'Max',
                inputType: 'number',
                active: true
            },
            {
                name: 'Min',
                inputType: 'number',
                active: true,
            },
            {
                name: 'Step',
                inputType: 'number',
                active: true,
            }
        ] as const
    },
    Int: {
        defaultValue: 0,
        settings: [
            {
                name: 'Max',
                inputType: 'number',
                active: true
            },
            {
                name: 'Min',
                inputType: 'number',
                active: true
            },
            {
                name: 'Step',
                inputType: 'number',
                active: true
            }
        ] as const
    },
    Text: {
        defaultValue: "",
        settings: [
            {
                name: 'Regex',
                inputType: 'text',
                active: true,
            }
        ] as const
    },
    ColorRGB: {
        // validation: z.object({ r: z.number(), g: z.number(), b: z.number() }),
        defaultValue: {
            r: 0,
            g: 0,
            b: 0
        }
    },
    Date: {
        defaultValue: new Date(),
    },
    Enum: {
        defaultValue: [],
    },
    FilePath: {
        defaultValue: ""
    },
    ImagePath: {
        defaultValue: ""
    },
    LineReference: {
        defaultValue: {
            sheetUUID: "",
            sheetID: "",
            rowUUID: "",
            rowId: ""
        }
    },
    SheetReference: {
        defaultValue: {
            sheetUUID: "",
            sheetID: ""
        }
    },
    Boolean: {
        defaultValue: false
    }
}

type BaseTypes = SheetTypes[keyof SheetTypes]['defaultValue'];

export type ColumnTypes = keyof SheetTypes;

export type Column = {
    id: number
    uuid: string
    name: string
    type: ColumnTypes
    settingData?: SettingsData
}

type List = Column[];
type UniqueProperty = Column[];

export type DataTypes = BaseTypes | List | UniqueProperty;

export type Row = {
    id: number
    uuid: string
    data: {
        [key: string]: DataTypes
    }
}


export type TypeSetting = {
    readonly name: string,
    readonly inputType: 'number' | 'text' | 'enum',
    readonly active: boolean
}

export type Settings = { [x in ColumnTypes]?: TypeSetting[] };
export type SettingsData = { [x: string]: number | string | boolean | string[] };