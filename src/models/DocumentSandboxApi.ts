import { GroupNode, RectangleNode, TextNode } from "express-document-sdk";

// This interface declares all the APIs that the document sandbox runtime ( i.e. code.ts ) exposes to the UI/iframe runtime
export interface DocumentSandboxApi {
    createRectangle({width, height, color,  x, y, textContent, textAlignment}): any;
    createTable({ columns, rows, gutter, selectedStyle, columnValues, rowData, textAlignment}):any
    createRow({rowIndex, columns, columnWidth, rowHeight, gutter, color, selectedStyle, rowValues,textAlignment }):any
    createColumn ({columnIndex, columnWidth, rowHeight, gutter, color, textContent, textAlignment}): any
    wrapText({textContent, width, textWidth}) : any
    calculateTextWidth(text): any
}
