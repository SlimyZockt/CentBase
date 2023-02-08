// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { ColumnTypes } from "./stores/TableStore"

// and what to do when importing types
declare namespace App {

}


declare module '@tanstack/table-core' {
    interface ColumnMeta<TData extends RowData, TValue> {
        type: ColumnTypes
    }
}