import { GroupNode, RectangleNode, TextNode } from "express-document-sdk";

// This interface declares all the APIs that the document sandbox runtime ( i.e. code.ts ) exposes to the UI/iframe runtime
export interface DocumentSandboxApi {
    /**
     * Creates a rectangle with specified dimensions, color, position, and text content.
     * 
     * @param {Object} params - The parameters for creating the rectangle
     * @param {number} params.width - The width of the rectangle
     * @param {number} params.height - The height of the rectangle
     * @param {string} params.color - The fill color of the rectangle
     * @param {number} params.x - The x-coordinate of the rectangle's position
     * @param {number} params.y - The y-coordinate of the rectangle's position
     * @param {string} params.textContent - The text content inside the rectangle
     * @param {string} params.textAlignment - The alignment of the text within the rectangle
     * @param {string} params.strokeColor - The color of the rectangle's border
     * @param {number} params.strokeWidth - The width of the rectangle's border
     * 
     * @returns {GroupNode | null} A group node containing the rectangle and text, or null if creation fails
     * 
     * @throws {Error} When invalid dimensions are provided
     */
    createRectangle({width, height, color, textColor, x, y, textContent, textAlignment, strokeColor, strokeWidth}): any;

    /**
     * Creates a table with specified columns, rows, and styling.
     * 
     * @param {Object} params - The parameters for creating the table
     * @param {number} params.columns - Number of columns in the table
     * @param {number} params.rows - Number of rows in the table
     * @param {number} params.gutter - Space between cells
     * @param {Object} params.selectedStyle - Style configuration object containing colors for header, row and stroke
     * @param {Object} params.columnValues - Object containing column headers text values
     * @param {Object[]} params.rowData - Array of objects containing data for each row
     * @param {string} params.textAlignment - Text alignment within cells
     * 
     * @throws {Error} If columns or rows are less than or equal to 0
     * @throws {Error} If table dimensions result in invalid height
     * @throws {Error} If column or row creation fails
     * 
     * @returns {void}
     */
    createTable({ columns, rows, gutter, selectedStyle, columnValues, rowData, textAlignment}): void;

    /**
     * Creates a row of cells in a table layout.
     * 
     * @param {Object} params - The parameters for creating the row
     * @param {number} params.rowIndex - The index of the row (0-based)
     * @param {number} params.columns - The number of columns in the row
     * @param {number} params.columnWidth - The width of each column
     * @param {number} params.rowHeight - The height of the row
     * @param {number} params.gutter - The spacing between cells and rows
     * @param {string} params.color - The default color for cells in this row
     * @param {Array<string>} params.rowValues - Array of text values for each cell in the row
     * @param {Object} params.selectedStyle - Style configuration object containing colors property
     * @param {string} params.textAlignment - The alignment of text within cells
     * @param {string} params.strokeColor - The color of the cell borders
     * @param {number} params.strokeWidth - The width of the cell borders
     * 
     * @returns {GroupNode | null} A group node containing the row's cells, or null if creation fails
     * 
     * @throws {Error} When invalid dimensions or column count are provided
     * @throws {Error} When cell creation fails
     */
    createRow({rowIndex, columns, columnWidth, rowHeight, gutter, color, selectedStyle, rowValues, textAlignment, strokeColor, strokeWidth }): any;

    /**
     * Creates a column with specified dimensions, color, and text content.
     * 
     * @param {Object} params - The parameters for creating the column
     * @param {number} params.columnIndex - The index of the column (0-based)
     * @param {number} params.columnWidth - The width of the column
     * @param {number} params.rowHeight - The height of the column's header row
     * @param {number} params.gutter - The spacing between columns
     * @param {string} params.color - The fill color of the column's header row
     * @param {string} params.textContent - The text content inside the column's header row
     * @param {string} params.textAlignment - The alignment of the text within the column's header row
     * @param {string} params.strokeColor - The color of the column's border
     * @param {number} params.strokeWidth - The width of the column's border
     * 
     * @returns {GroupNode | null} A group node containing the column's header row, or null if creation fails
     * 
     * @throws {Error} When invalid dimensions are provided
     */
    createColumn ({columnIndex, columnWidth, rowHeight, gutter, color, textColor, textContent, textAlignment, strokeColor, strokeWidth}): any;

    /**
     * Wraps text to fit within a specified width.
     * 
     * @param {Object} params - The parameters for wrapping the text
     * @param {string} params.textContent - The text content to wrap
     * @param {number} params.width - The maximum width for the wrapped text
     * @param {number} params.textWidth - The width of the text content
     * 
     * @returns {string} The wrapped text
     */
    wrapText({textContent, width, textWidth}) : any;

    /**
     * Calculates the width of a given text string.
     * 
     * @param {string} text - The text string to measure
     * 
     * @returns {number} The width of the text string
     */
    calculateTextWidth(text): any;
}
