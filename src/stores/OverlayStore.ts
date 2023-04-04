import { writable, get, type Writable } from "svelte/store";
import { getCurrentSheet, updateSheets, type Column } from "./TableStore"

type OVERLAY_MODES = "COLUMN" | "SHEET" | "NONE";


export const isOverlayOpen = writable(false);
export const configuratorConfig = writable<Column | undefined>();
export const resetView = writable(false);
export const overlayMode = writable<OVERLAY_MODES>("COLUMN");

export const openColumnCreator = () => {
    configuratorConfig.set(undefined);
    isOverlayOpen.set(true);
    overlayMode.set("COLUMN");
};
export const openColumnOption = (columnUUID: string) => {
    const column = getCurrentSheet()?.columns.filter((column) => column.uuid == columnUUID)[0];
    configuratorConfig.set(column);
    isOverlayOpen.set(true);
    overlayMode.set("COLUMN");
};