import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { colorUtils, editor, GroupNode, RectangleNode, TextNode } from "express-document-sdk";
import { DocumentSandboxApi } from "../models/DocumentSandboxApi";
import { hexToRgba } from '../ui/utils/font';

const { runtime } = addOnSandboxSdk.instance;

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
            let words = textContent.split(' ');
            let wrappedText = '';
            let line = '';

            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                let testWidth = sandboxApi.calculateTextWidth(testLine);

                // If the testLine exceeds the width, wrap the line
                if (testWidth > width && line !== '') {
                    wrappedText += line.trim() + '\n';
                    line = words[i] + ' ';
                } else {
                    line = testLine;
                }

                // Handle long words (e.g., URLs) that exceed the width
                while (sandboxApi.calculateTextWidth(line.trim()) > width) {
                    let part = '';
                    for (let j = 0; j < words[i].length; j++) {
                        part += words[i][j];
                        if (sandboxApi.calculateTextWidth(part + '-') > width) {
                            wrappedText += part.slice(0, -1) + '\n';
                            words[i] = words[i].slice(j);
                            part = '';
                            j = -1;
                        }
                    }
                    line = words[i] + ' ';
                }
            }

            return wrappedText + line.trim();
        },

        createRectangle({ width, height, color, textColor, x, y, textContent, textAlignment, strokeColor, strokeWidth }): GroupNode | null {
            const padding = 10
            try {
                if (width <= 0 || height <= 0) {
                    throw new Error("Invalid rectangle dimensions.");
                }

                const rect = editor.createRectangle();
                rect.width = width;
                rect.height = height;
                rect.translation = { x, y };
                rect.fill = editor.makeColorFill(color);
                const stroke = editor.makeStroke({
                    color: colorUtils.fromHex(strokeColor),
                    width: strokeWidth,
                });
                rect.stroke = stroke

                const text = editor.createText();
                const stringified = String(textContent);
                text.text = stringified;

                
                // @ts-ignore\
                text.fullContent.applyCharacterStyles({
                    fontSize: 15,
                    color: textColor,
                })

                const textWidth = text.boundsLocal.width
                
                

                if (textWidth > width - 2 * padding) {
                    // text.text = sandboxApi.wrapText({ textContent: stringified, width: width - 2 * padding, textWidth });
                }

                // Set text alignment
                switch (textAlignment) {
                    case 'left':
                        text.textAlignment = 1; // left alignment
                        text.translation = { x: x + padding, y: y + height / 2 };
                        break;
                    case 'right':
                        text.textAlignment = 2; // right alignment
                        text.translation = { x: x + width - padding, y: y + height / 2 };
                        break;
                    case 'center':
                    default:
                        text.textAlignment = 3; // center alignment
                        text.translation = { x: x + width / 2, y: y + height / 2 }; // center translation
                        break;
                }

                const cellGroup = editor.createGroup();
                cellGroup.children.append(rect, text);

                return cellGroup;
            } catch (error) {
                console.error("Error creating rectangle:", error.message);
                throw error;
            }
        },

        createColumn({ columnIndex, columnWidth, rowHeight, gutter, color, textColor, textContent, textAlignment, strokeColor, strokeWidth }): GroupNode | null {
            try {
                if (columnWidth <= 0 || rowHeight <= 0) {
                    throw new Error("Invalid column dimensions.");
                }

                const x = gutter + (gutter + columnWidth) * columnIndex;
                const columnGroup = editor.createGroup();
                // const textColor = hexToRgba("#000000");

                const headerRect = sandboxApi.createRectangle({ width: columnWidth, height: rowHeight, color, textColor, x, y: gutter, textContent, textAlignment, strokeColor, strokeWidth });
                if (headerRect) {
                    columnGroup.children.append(headerRect);
                } else {
                    throw new Error("Failed to create header rectangle.");
                }

                return columnGroup;
            } catch (error) {
                console.error("Error creating column:", error.message);
                // return null;
                throw error
            }
        },

        createRow({ rowIndex, columns, columnWidth, rowHeight, gutter, color, rowValues, selectedStyle, textAlignment, strokeColor, strokeWidth }): GroupNode | null {
            try {
                if (columns <= 0 || columnWidth <= 0 || rowHeight <= 0) {
                    throw new Error("Invalid row dimensions or column count.");
                }

                const y = gutter + (gutter + rowHeight) * (rowIndex + 1);
                const rowGroup = editor.createGroup();

                const isEvenRow = rowIndex % 2 === 0;
                const rowColor = isEvenRow ? hexToRgba(selectedStyle.colors.alt_row) : color;
                const textColor = isEvenRow ? hexToRgba(selectedStyle.colors.alt_row_text) : hexToRgba(selectedStyle.colors.row_text);

                for (let i = 0; i < columns; i++) {
                    const cellTextContent = rowValues[i] || `Row ${rowIndex + 1}, Col ${i + 1}`;
                    const cellRect = sandboxApi.createRectangle({
                        width: columnWidth,
                        height: rowHeight,
                        color: rowColor,
                        textColor,
                        x: gutter + (gutter + columnWidth) * i,
                        y,
                        textContent: cellTextContent,
                        textAlignment,
                        strokeColor,
                        strokeWidth
                    });
                    if (cellRect) {
                        rowGroup.children.append(cellRect);
                    } else {
                        throw new Error(`Failed to create cell for row ${rowIndex + 1}, column ${i + 1}.`);
                    }
                }

                return rowGroup;
            } catch (error) {
                console.error("Error creating row:", error.message);
                return null;
                throw error
            }
        },


        createTable({ columns, rows, gutter, selectedStyle, columnValues, rowData, textAlignment }): void {

            try {
                if (columns <= 0 || rows <= 0) {
                    throw new Error("Table must have at least one column and one row.");
                }
        
                const columnColor = colorUtils.fromHex(selectedStyle.colors.header);
                const rowColor = colorUtils.fromHex(selectedStyle.colors.row);
        
                const minWidth = 150; // Minimum width for a column
                const maxWidth = 250; // Maximum width for a column
        
                const tableHeight = 200;
                const effectiveTableHeight = tableHeight / rows;
                const rowHeight = Math.max(effectiveTableHeight, 70);
        
                if (rowHeight < 0) {
                    throw new Error("Invalid table dimensions: Height is too small.");
                }
        
                const page = editor.context.currentPage;
                const tableGroup = editor.createGroup();
                const strokeWidth = Math.max(1, Math.min(minWidth * 0.015, 5)); // 2% of column width, capped at 5px
        
                let totalTableWidth = 0;
        
                for (let i = 0; i < columns; i++) {
                    const columnText = columnValues[`Column ${i + 1}`] || `Column ${i + 1}`;
                    let textWidth = sandboxApi.calculateTextWidth(columnText);
        
                    // Ensure column width is between minWidth and maxWidth
                    const columnWidth = Math.min(Math.max(textWidth, minWidth), maxWidth);
                    totalTableWidth += columnWidth;
        
                    const columnGroup = sandboxApi.createColumn({
                        columnIndex: i,
                        columnWidth,
                        rowHeight,
                        gutter,
                        color: columnColor,
                        textColor: hexToRgba(selectedStyle.colors.header_text),
                        textContent: columnText,
                        textAlignment,
                        strokeColor: selectedStyle.colors.stroke,
                        strokeWidth
                    });
        
                    if (columnGroup) {
                        tableGroup.children.append(columnGroup);
                    } else {
                        throw new Error(`Failed to create column ${i + 1}.`);
                    }
                }
        
                for (let i = 0; i < rows; i++) {
                    const rowValues = Object.values(rowData[i] || {});
                    const rowGroup = sandboxApi.createRow({
                        rowIndex: i,
                        columns,
                        columnWidth: Math.min(Math.max(totalTableWidth / columns, minWidth), maxWidth),
                        rowHeight,
                        gutter,
                        color: rowColor,
                        rowValues,
                        selectedStyle,
                        textAlignment,
                        strokeColor: selectedStyle.colors.stroke,
                        strokeWidth
                    });
        
                    if (rowGroup) {
                        tableGroup.children.append(rowGroup);
                    } else {
                        throw new Error(`Failed to create row ${i + 1}.`);
                    }
                }
        
                const editorWidth = editor.context.currentPage.width;
                const actualTableWidth = tableGroup.boundsLocal.width;
                
                if (actualTableWidth > editorWidth) {
                    const scaleFactor = editorWidth / actualTableWidth;
                    const transformMatrix = tableGroup.transformMatrix;
        
                    // Apply scaling to the transform matrix
                    transformMatrix[0] *= scaleFactor;  // Scale X axis
                    transformMatrix[3] *= scaleFactor;  // Scale Y axis (keep proportional)
                    
                    // Update the group's transform matrix
                    // tableGroup.transformMatrix = transformMatrix;
                }
        
                page.artboards.first.children.append(tableGroup);
                // tableGroup.locked = true;
                

                
                
            } catch (error) {
                console.error("Error creating table:", error.message);
                throw error;
            }
        }
    }

    runtime.exposeApi(sandboxApi);
}

start();
