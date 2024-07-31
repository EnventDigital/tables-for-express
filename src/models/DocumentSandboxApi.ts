// This interface declares all the APIs that the document sandbox runtime ( i.e. code.ts ) exposes to the UI/iframe runtime
export interface DocumentSandboxApi {
    createRectangle({width, height, fill}): void;
    createTable({ columns, rows, gutter, columnColor, rowColor }):void

    // createTable({rows, columns, cellWidth, cellHeight, x, y}):void
}
