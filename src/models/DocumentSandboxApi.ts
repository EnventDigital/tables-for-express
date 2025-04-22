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

    /**
     * Selects a specific row in the table.
     * 
     * @param {number} rowIndex - The zero-based index of the row to select
     * 
     * @returns {Promise<boolean>} True if successful, false otherwise
     */
    selectTableRow(rowIndex: number): Promise<boolean>;

    /**
     * Selects a specific column in the table.
     * 
     * @param {number} columnIndex - The zero-based index of the column to select
     * 
     * @returns {Promise<boolean>} True if successful, false otherwise
     */
    selectTableColumn(columnIndex: number): Promise<boolean>;

    /**
     * Selects the entire table.
     * 
     * @returns {Promise<boolean>} True if successful, false otherwise
     */
    selectEntireTable(): Promise<boolean>;

    /**
     * Clears any current table selection.
     * 
     * @returns {Promise<boolean>} True if successful, false otherwise
     */
    clearTableSelection(): Promise<boolean>;

    /**
     * Lists all metadata keys and values on the current table group.
     * This is a diagnostic function to verify metadata is being stored correctly.
     * 
     * @returns {void}
     */
    listNodeMetadata(): void;
    
    /**
     * Registers a handler for document selection changes.
     * This allows the add-on to monitor when the user selects different objects
     * and detect when tables created by this add-on are selected.
     * 
     * @returns {Promise<void>}
     */
    registerSelectionChangeHandler(): Promise<void>;
    
    /**
     * Helper method to check the current selection for tables.
     * This can be called at any time to analyze the current selection
     * and update the current table reference if a table is selected.
     * 
     * @returns {Promise<void>}
     */
    checkCurrentSelection(): Promise<void>;
}
