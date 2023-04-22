import type { ColumnTypes } from "src/stores/TableStore";



export const convertIntoInputType = (type: ColumnTypes | undefined) => {
    if (type === undefined) return "number";
    const COMPONENTS = {
        'Int': 'number',
        'Float': 'number',
        'Bool': 'checkbox',
        'String': 'text',
        'Enum': 'enum',
        'File': 'file',
        'Image': 'image',
        'Color': "color",
        'List': "text",
        'Property': "text",
    } as const;
    return COMPONENTS[type]
}