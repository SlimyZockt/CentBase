import { writable, get, type Writable } from "svelte/store";
import { getCurrentSheet, updateSheets, type Column } from "./TableStore"

type OVERLAY_MODES = "EDIT_COLUMN" | "CREATE_COLUMN" | "SHEET" | "NONE";


export const isOverlayOpen = writable(false);
export const configuratorConfig = writable<Column | undefined>();
export const overlayMode = writable<OVERLAY_MODES>("CREATE_COLUMN");

export const openColumnCreator = () => {
    configuratorConfig.set(undefined);
    isOverlayOpen.set(true);
    overlayMode.set("CREATE_COLUMN");
};
export const openColumnOption = (columnUUID: string, mode: "EDIT_COLUMN" | "CREATE_COLUMN") => {
    const column = getCurrentSheet()?.columns.filter((column) => column.uuid == columnUUID)[0];
    configuratorConfig.set(column);
    isOverlayOpen.set(true);
    overlayMode.set(mode);
};