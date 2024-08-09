import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { colorUtils, editor, GroupNode, RectangleNode, TextNode } from "express-document-sdk";
import { DocumentSandboxApi } from "../models/DocumentSandboxApi";
import { hexToRgba } from '../ui/utils/font';

const { runtime } = addOnSandboxSdk.instance;

function start(): void {
    const sandboxApi: DocumentSandboxApi = {
        createRectangle({ width, height, color, x, y, textContent }): GroupNode | null {
            try {
                if (width <= 0 || height <= 0) {
                    throw new Error("Invalid rectangle dimensions.");
                }

                const rect = editor.createRectangle();
                rect.width = width;
                rect.height = height;
                rect.translation = { x, y };
                rect.fill = editor.makeColorFill(color);

                const text = editor.createText();
                text.text = String(textContent);
                text.translation = { x: x + width / 2, y: y + height / 2 };

                const cellGroup = editor.createGroup();
                cellGroup.children.append(rect, text);

                return cellGroup;
            } catch (error) {
                console.error("Error creating rectangle:", error.message);
                // return null
                throw error;
            }
        },

        createColumn({ columnIndex, columnWidth, rowHeight, gutter, color, textContent }): GroupNode | null {
            try {
                if (columnWidth <= 0 || rowHeight <= 0) {
                    throw new Error("Invalid column dimensions.");
                }

                const x = gutter + (gutter + columnWidth) * columnIndex;
                const columnGroup = editor.createGroup();

                const headerRect = sandboxApi.createRectangle({ width: columnWidth, height: rowHeight, color, x, y: gutter, textContent });
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

        createRow({ rowIndex, columns, columnWidth, rowHeight, gutter, color, rowValues, selectedStyle }): GroupNode | null {
            try {
                if (columns <= 0 || columnWidth <= 0 || rowHeight <= 0) {
                    throw new Error("Invalid row dimensions or column count.");
                }

                const y = gutter + (gutter + rowHeight) * (rowIndex + 1);
                const rowGroup = editor.createGroup();

                const isEvenRow = rowIndex % 2 === 0;
                const rowColor = isEvenRow ? hexToRgba(selectedStyle.colors.alt_row) : color;

                for (let i = 0; i < columns; i++) {
                    const cellTextContent = rowValues[i] || `Row ${rowIndex + 1}, Col ${i + 1}`;
                    const cellRect = sandboxApi.createRectangle({
                        width: columnWidth,
                        height: rowHeight,
                        color: rowColor,
                        x: gutter + (gutter + columnWidth) * i,
                        y,
                        textContent: cellTextContent
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

        createTable({ columns, rows, gutter, selectedStyle, columnValues, rowData }): void {
            try {
                if (columns <= 0 || rows <= 0) {
                    throw new Error("Table must have at least one column and one row.");
                }

                const columnColor = colorUtils.fromHex(selectedStyle.colors.header);
                const rowColor = colorUtils.fromHex(selectedStyle.colors.row);

                const tableWidth = 700;
                const tableHeight = 200;

                const effectiveTableWidth = tableWidth - ((columns + 1) * gutter);
                const effectiveTableHeight = tableHeight - ((rows + 1) * gutter);

                const columnWidth = Math.max(effectiveTableWidth / columns, 210);
                const rowHeight = Math.max(effectiveTableHeight / rows, 70);

                if (columnWidth < 0 || rowHeight < 0) {
                    throw new Error("Invalid table dimensions: Width or height is too small.");
                }

                const page = editor.documentRoot.pages.first;
                const tableGroup = editor.createGroup();

                for (let i = 0; i < columns; i++) {
                    const columnText = columnValues[`Column ${i + 1}`] || `Column ${i + 1}`;
                    const columnGroup = sandboxApi.createColumn({
                        columnIndex: i,
                        columnWidth,
                        rowHeight,
                        gutter,
                        color: columnColor,
                        textContent: columnText
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
                        columnWidth,
                        rowHeight,
                        gutter,
                        color: rowColor,
                        rowValues,
                        selectedStyle
                    });
                    if (rowGroup) {
                        tableGroup.children.append(rowGroup);
                    } else {
                        throw new Error(`Failed to create row ${i + 1}.`);
                    }
                }

                page.artboards.first.children.append(tableGroup);
                tableGroup.locked = true;
            } catch (error) {
                console.error("Error creating table:", error.message);
                throw error
            }
        }
    }

    runtime.exposeApi(sandboxApi);
}

start();