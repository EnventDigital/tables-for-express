import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { colorUtils, editor, GroupNode, RectangleNode, TextNode } from "express-document-sdk";
import { DocumentSandboxApi } from "../models/DocumentSandboxApi";
import { hexToRgba } from '../ui/utils/font';

// Define metadata key for tables
const TABLE_METADATA_KEY = "tables-for-express-table";

const { runtime } = addOnSandboxSdk.instance;

// Track the current table group for selection operations
let currentTableGroup: GroupNode | null = null;

function start(): void {
    const sandboxApi: DocumentSandboxApi = {
        calculateTextWidth(text) {
            // Create a temporary TextNode to measure the text width
            const tempText = editor.createText();
            tempText.text = text;

            // Get the width of the text's bounding box
            const textWidth = tempText.boundsLocal.width;

            // Clean up by removing the temporary node
            tempText.removeFromParent();

            return textWidth;
        },

        wrapText({ textContent, width, textWidth }) {
            if (!textContent) return "";
            
            const stringContent = String(textContent);
            
            // If content is already short enough, return as-is
            if (textWidth <= width) return stringContent;
            
            // Use 85% of available width before wrapping - this provides more space
            // and prevents text from wrapping too narrowly
            const effectiveWidth = width * 0.85;
            
            let words = stringContent.split(' ');
            let wrappedText = '';
            let line = '';

            // Handle single-word case (e.g., long URLs or words without spaces)
            if (words.length === 1) {
                const longWord = words[0];
                // Calculate chars per line allowing more characters
                const charsPerLine = Math.max(5, Math.floor(effectiveWidth / (textWidth / longWord.length)));
                
                for (let i = 0; i < longWord.length; i += charsPerLine) {
                    wrappedText += longWord.substr(i, charsPerLine) + '\n';
                }
                return wrappedText.trim();
            }

            // Normal word-by-word wrapping with more space
            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                let testWidth = this.calculateTextWidth(testLine);

                // If the testLine exceeds the effective width, wrap the line
                if (testWidth > effectiveWidth && line !== '') {
                    wrappedText += line.trim() + '\n';
                    line = words[i] + ' ';
                } else {
                    line = testLine;
                }
            }

            return wrappedText + line.trim();
        },

        createRectangle({ width, height, color, textColor, x, y, textContent, textAlignment, strokeColor, strokeWidth }): GroupNode | null {
            const padding = 10;
            try {
                if (width <= 0 || height <= 0) {
                    throw new Error("Invalid rectangle dimensions.");
                }

                // Create the rectangle background
                const rect = editor.createRectangle();
                rect.width = width;
                rect.height = height;
                rect.translation = { x, y };
                rect.fill = editor.makeColorFill(color);
                const stroke = editor.makeStroke({
                    color: colorUtils.fromHex(strokeColor),
                    width: strokeWidth,
                });
                rect.stroke = stroke;

                // Convert textContent to string and handle null/undefined
                const stringContent = String(textContent || "");
                
                // Calculate available width for text - make this much narrower to force wrapping
                // Use 75% of the available width minus padding to make wrapping more aggressive
                const availableWidth = (width - (2 * padding)) * 0.75;
                
                // Create the text element
                const text = editor.createText();
                text.text = stringContent;
                
                // Apply text styles
                // @ts-ignore
                text.fullContent.applyCharacterStyles({
                    fontSize: 15,
                    color: textColor,
                });
                
                // Measure original text width
                const originalTextWidth = text.boundsLocal.width;
                
                // Determine if text needs wrapping - make this more aggressive
                const needsWrapping = originalTextWidth > availableWidth;
                
                console.log(`Cell Text: "${stringContent}", Width: ${originalTextWidth}, Available: ${availableWidth}, Needs Wrapping: ${needsWrapping}`);
                
                // Only apply wrapping if text width exceeds available space
                if (needsWrapping) {
                    // Split text into words
                    const words = stringContent.split(' ');
                    let lines = [];
                    let currentLine = '';
                    
                    // Simple word-by-word wrapping
                    for (let i = 0; i < words.length; i++) {
                        const word = words[i];
                        // If this is not the first word in the line, add a space before adding the word
                        const testLine = currentLine + (currentLine ? ' ' : '') + word;
                        
                        // Create a temporary text element to measure this line's width
                        const testText = editor.createText();
                        testText.text = testLine;
                        const lineWidth = testText.boundsLocal.width;
                        testText.removeFromParent();
                        
                        if (lineWidth <= availableWidth || currentLine === '') {
                            // Word fits on the current line
                            currentLine = testLine;
                        } else {
                            // Line is too long, wrap to next line
                            lines.push(currentLine);
                            currentLine = word;
                        }
                    }
                    
                    // Add the last line
                    if (currentLine) {
                        lines.push(currentLine);
                    }
                    
                    // Join lines with newline characters
                    text.text = lines.join('\n');
                    
                    // After wrapping, measure the new text height
                    const wrappedHeight = text.boundsLocal.height;
                    const neededHeight = wrappedHeight + (2 * padding);
                    
                    // Increase rectangle height if necessary
                    if (neededHeight > height) {
                        rect.height = neededHeight;
                        height = neededHeight; // Update for positioning
                    }
                }
                
                // Set text alignment after content is finalized
                switch (textAlignment) {
                    case 'left':
                        text.textAlignment = 1; // left alignment
                        break;
                    case 'right':
                        text.textAlignment = 2; // right alignment
                        break;
                    case 'center':
                    default:
                        text.textAlignment = 3; // center alignment
                        break;
                }
                
                // Position the text based on alignment
                let textX = x + padding; // Default for left alignment
                
                if (text.textAlignment === 2) { // Right alignment
                    textX = x + width - padding;
                } else if (text.textAlignment === 3) { // Center alignment
                    textX = x + (width / 2);
                }
                
                // Position text with vertical centering
                text.translation = { 
                    x: textX, 
                    y: y + (height / 2)
                };

                // Create cell group and append elements
                const cellGroup = editor.createGroup();
                cellGroup.children.append(rect, text);

                return cellGroup;
            } catch (error) {
                console.error("Error creating rectangle:", error.message);
                throw error;
            }
        },

        createTable({ columns, rows, gutter, selectedStyle, columnValues, rowData, textAlignment }): void {
            console.log(`Editor selection before:`, editor);
            
            try {
                if (columns <= 0 || rows <= 0) {
                    throw new Error("Table must have at least one column and one row.");
                }
        
                const columnColor = colorUtils.fromHex(selectedStyle.colors.header);
                const rowColor = colorUtils.fromHex(selectedStyle.colors.row);
                const headerTextColor = hexToRgba(selectedStyle.colors.header_text);
                const strokeColor = selectedStyle.colors.stroke;
                
                // Calculate dimensions
                const minWidth = 150; // Minimum width for a column
                const maxWidth = 250; // Maximum width for a column
                const tableHeight = 200;
                const baseRowHeight = Math.max(tableHeight / rows, 70);
                const strokeWidth = Math.max(1, Math.min(minWidth * 0.015, 5)); // 2% of column width, capped at 5px
                
                if (baseRowHeight < 0) {
                    throw new Error("Invalid table dimensions: Height is too small.");
                }
                
                // Create the table group
                const page = editor.context.currentPage;
                const tableGroup = editor.createGroup();
                
                // Store the reference to the current table group for selection operations
                currentTableGroup = tableGroup;
                
                // ====== XD-style approach: Create cells row by row ======
                
                // Step 1: Create all column widths based on content
                const columnWidths = [];
                let totalTableWidth = 0;
                
                for (let i = 0; i < columns; i++) {
                    const columnText = columnValues[`Column ${i + 1}`] || `Column ${i + 1}`;
                    let textWidth = sandboxApi.calculateTextWidth(columnText);
                    // Ensure column width is between minWidth and maxWidth
                    const columnWidth = Math.min(Math.max(textWidth + 40, minWidth), maxWidth); // Added more padding for text
                    columnWidths.push(columnWidth);
                    totalTableWidth += columnWidth;
                }
                
                // Step 2: Create the header row cells first
                const headerRow = editor.createGroup();
                let currentX = gutter;
                let rowHeight = baseRowHeight; // May be adjusted based on cell content
                let maxRowHeight = rowHeight;
                
                // Create all header cells - WITHOUT text wrapping for headers
                for (let i = 0; i < columns; i++) {
                    const columnText = columnValues[`Column ${i + 1}`] || `Column ${i + 1}`;
                    const columnWidth = columnWidths[i];
                    
                    // Create a text node for the header without wrapping
                    const headerText = editor.createText();
                    headerText.text = columnText;
                    
                    // Apply text styles
                    // @ts-ignore
                    headerText.fullContent.applyCharacterStyles({
                        fontSize: 15,
                        color: headerTextColor,
                    });
                    
                    // Set text alignment
                    switch (textAlignment) {
                        case 'left':
                            headerText.textAlignment = 1; // left alignment
                            break;
                        case 'right':
                            headerText.textAlignment = 2; // right alignment
                            break;
                        case 'center':
                        default:
                            headerText.textAlignment = 3; // center alignment
                            break;
                    }
                    
                    // Create the rectangle for the header cell
                    const headerRect = editor.createRectangle();
                    headerRect.width = columnWidth;
                    headerRect.height = rowHeight;
                    headerRect.translation = { x: currentX, y: gutter };
                    headerRect.fill = editor.makeColorFill(columnColor);
                    const stroke = editor.makeStroke({
                        color: colorUtils.fromHex(strokeColor),
                        width: strokeWidth,
                    });
                    headerRect.stroke = stroke;
                    
                    // Position the text based on alignment
                    let textX = currentX + 10; // Default for left alignment with padding
                    
                    if (headerText.textAlignment === 2) { // Right alignment
                        textX = currentX + columnWidth - 10;
                    } else if (headerText.textAlignment === 3) { // Center alignment
                        textX = currentX + (columnWidth / 2);
                    }
                    
                    // Position the text, centering it vertically
                    headerText.translation = { 
                        x: textX, 
                        y: gutter + (rowHeight / 2)
                    };
                    
                    // Group the header cell elements
                    const headerCell = editor.createGroup();
                    headerCell.children.append(headerRect, headerText);
                    
                    if (headerCell) {
                        headerRow.children.append(headerCell);
                        maxRowHeight = Math.max(maxRowHeight, headerRect.height);
                        
                        // Update position for next cell - use the width of the column plus gutter
                        currentX += columnWidth + gutter;
                    } else {
                        throw new Error(`Failed to create header cell for column ${i + 1}.`);
                    }
                }
                
                // Add header row to table
                tableGroup.children.append(headerRow);
                
                // Step 3: Create data rows - WITH text wrapping for data cells
                for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
                    const isEvenRow = rowIndex % 2 === 0;
                    const dataRowColor = isEvenRow ? hexToRgba(selectedStyle.colors.alt_row) : rowColor;
                    const dataTextColor = isEvenRow ? 
                        hexToRgba(selectedStyle.colors.alt_row_text) : 
                        hexToRgba(selectedStyle.colors.row_text);
                    
                    // Create a new row group
                    const dataRow = editor.createGroup();
                    
                    // Position this row relative to the header
                    const rowY = gutter + (rowHeight + gutter) * (rowIndex + 1);
                    currentX = gutter;
                    let maxDataRowHeight = baseRowHeight;
                    
                    // Create cells for this row
                    for (let colIndex = 0; colIndex < columns; colIndex++) {
                        // Get cell data for this position
                        const cellData = rowData[rowIndex] || {};
                        const cellTextContent = Object.values(cellData)[colIndex] || `Row ${rowIndex + 1}, Col ${colIndex + 1}`;
                        const columnWidth = columnWidths[colIndex];
                        
                        // Create a data cell (with text wrapping)
                        const dataCell = sandboxApi.createRectangle({
                            width: columnWidth,
                            height: baseRowHeight,
                            color: dataRowColor,
                            textColor: dataTextColor,
                            x: currentX,
                            y: rowY,
                            textContent: cellTextContent,
                            textAlignment,
                            strokeColor,
                            strokeWidth
                        });
                        
                        if (dataCell) {
                            dataRow.children.append(dataCell);
                            // Update height tracking if this cell is taller due to text wrapping
                            const cellHeight = dataCell.boundsLocal.height;
                            maxDataRowHeight = Math.max(maxDataRowHeight, cellHeight);
                            
                            // Update position for next cell
                            currentX += columnWidth + gutter;
                        } else {
                            throw new Error(`Failed to create data cell for row ${rowIndex + 1}, column ${colIndex + 1}.`);
                        }
                    }
                    
                    // Adjust all cells in this row to match the tallest cell height
                    if (maxDataRowHeight > baseRowHeight) {
                        // Update data cells to have consistent height
                        if (dataRow.children.length > 0) {
                            for (let i = 0; i < dataRow.children.length; i++) {
                                const cellGroup = dataRow.children.item(i) as GroupNode;
                                const rect = (cellGroup.children.item(0) as RectangleNode);
                                if (rect) {
                                    rect.height = maxDataRowHeight;
                                }
                            }
                        }
                    }
                    
                    // Add this data row to table
                    tableGroup.children.append(dataRow);
                }
                
                // Add table to the artboard
                page.artboards.first.children.append(tableGroup);
                
                // Add metadata to the table group for tracking using the table's own ID
                tableGroup.addOnData.setItem(TABLE_METADATA_KEY, JSON.stringify({
                    nodeId: tableGroup.id,
                    columns,
                    rows,
                    createdAt: new Date().toISOString()
                }));
                
                // Log the metadata for debugging
                console.log(`Table created with metadata. Table ID: ${tableGroup.id}`);
                console.log(`Metadata keys: ${tableGroup.addOnData.keys()}`);
                
                // Scale table if it's too wide for the editor
                const editorWidth = editor.context.currentPage.width;
                const actualTableWidth = tableGroup.boundsLocal.width;
                
                if (actualTableWidth > editorWidth) {
                    const scaleFactor = editorWidth / actualTableWidth;
                    const transformMatrix = tableGroup.transformMatrix;
                    
                    // Apply scaling to the transform matrix
                    transformMatrix[0] *= scaleFactor;  // Scale X axis
                    transformMatrix[3] *= scaleFactor;  // Scale Y axis (keep proportional)
                }
            } catch (error) {
                console.error("Error creating table:", error.message);
                throw error;
            }
        },

        // New selection methods
        async selectTableRow(rowIndex: number): Promise<boolean> {
            try {
                if (!currentTableGroup) {
                    console.error("No table exists to select a row from");
                    return false;
                }

                // Clear any existing selection
                editor.context.selection = [];
                
                // Tables have a header row at index 0, followed by data rows
                // The structure is:
                // tableGroup
                //   - headerRow (at index 0)
                //   - dataRow 1 (at index 1, corresponding to rowIndex 0)
                //   - dataRow 2 (at index 2, corresponding to rowIndex 1)
                //   - etc.
                
                // Adjust rowIndex to account for the header row
                const targetIndex = rowIndex + 1;
                
                if (targetIndex >= 0 && targetIndex < currentTableGroup.children.length) {
                    const rowToSelect = currentTableGroup.children.item(targetIndex) as GroupNode;
                    if (rowToSelect) {
                        editor.context.selection = [rowToSelect];
                        return true;
                    }
                }
                
                console.error(`Row at index ${rowIndex} not found`);
                return false;
            } catch (error) {
                console.error("Error selecting table row:", error.message);
                return false;
            }
        },

        async selectTableColumn(columnIndex: number): Promise<boolean> {
            try {
                if (!currentTableGroup || !currentTableGroup.children || currentTableGroup.children.length === 0) {
                    console.error("No table exists to select a column from");
                    return false;
                }

                console.log(`Editor selection before:`, editor.context.selection);
                console.log(`Current table group:`, currentTableGroup);
                


                // Clear any existing selection
                editor.context.selection = [];

                
                
                // We need to find all cells at the specified column index across all rows
                const cellsToSelect = [];
                
                // Loop through all rows in the table
                for (let i = 0; i < currentTableGroup.children.length; i++) {
                    const row = currentTableGroup.children.item(i) as GroupNode;
                    if (row && row.children && columnIndex < row.children.length) {
                        const cell = row.children.item(columnIndex) as GroupNode;
                        if (cell) {
                            cellsToSelect.push(cell);
                        }
                    }
                }
                
                if (cellsToSelect.length > 0) {
                    editor.context.selection = cellsToSelect;
                    return true;
                }
                
                console.error(`Column at index ${columnIndex} not found`);
                return false;
            } catch (error) {
                console.error("Error selecting table column:", error.message);
                return false;
            }
        },

        async selectEntireTable(): Promise<boolean> {
            try {
                if (!currentTableGroup) {
                    console.error("No table exists to select");
                    return false;
                }

                // Select the entire table group
                editor.context.selection = [currentTableGroup];
                return true;
            } catch (error) {
                console.error("Error selecting entire table:", error.message);
                return false;
            }
        },

        async clearTableSelection(): Promise<boolean> {
            try {
                // Clear the current selection
                editor.context.selection = [];
                return true;
            } catch (error) {
                console.error("Error clearing table selection:", error.message);
                return false;
            }
        },

        // Add function to list all metadata keys on a node
        listNodeMetadata(): void {
            try {
                if (!currentTableGroup) {
                    console.log("No current table group to check metadata");
                    return;
                }
                
                console.log(`Checking metadata for table with ID: ${currentTableGroup.id}`);
                
                // Get all metadata keys
                const keys = currentTableGroup.addOnData.keys();
                
                if (!keys || keys.length === 0) {
                    console.log("No metadata found on this node");
                    return;
                }
                
                // Iterate over all keys
                keys.forEach((key) => {
                    console.log(`Key: ${key}, Value: ${currentTableGroup?.addOnData.getItem(key)}`);
                });
                
            } catch (error) {
                console.error("Error listing node metadata:", error);
            }
        },
    };

    runtime.exposeApi(sandboxApi);
}

start();
