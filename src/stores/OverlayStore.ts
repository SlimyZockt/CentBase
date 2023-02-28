import { writable, get, type Writable } from "svelte/store";
import { ColumnData, type Column } from "./TableStore"

export const isOverlayOpen = writable(false);
export const configuratorConfig: Writable<Column | undefined> = writable();
export const resetView = writable(false);

export const openColumnCreator = () => {
    configuratorConfig.set(undefined);
    isOverlayOpen.set(true)
};
export const openColumnOption = (columnUUID: string) => {
    const column = get(ColumnData).filter((column) => column.uuid == columnUUID)[0];
    configuratorConfig.set(column);
    isOverlayOpen.set(true);
};