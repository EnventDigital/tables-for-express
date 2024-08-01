import { GroupNode, RectangleNode, TextNode } from "express-document-sdk";

// This interface declares all the APIs that the document sandbox runtime ( i.e. code.ts ) exposes to the UI/iframe runtime
export interface DocumentSandboxApi {
    createRectangle({width, height, color,  x, y, textContent}): any;
    createTable({ columns, rows, gutter, selectedStyle, columnValues, rowData}):any
    createRow({rowIndex, columns, columnWidth, rowHeight, gutter, color, selectedStyle, rowValues }):any
    createColumn: ({columnIndex, columnWidth, rowHeight, gutter, color, textContent}) => any
}
