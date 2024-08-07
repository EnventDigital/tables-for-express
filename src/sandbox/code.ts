import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { colorUtils, editor, GroupNode, RectangleNode, TextNode } from "express-document-sdk";
import { DocumentSandboxApi } from "../models/DocumentSandboxApi";
import { hexToRgba } from '../ui/utils/font';

const { runtime } = addOnSandboxSdk.instance;

function start(): void {
    const sandboxApi: DocumentSandboxApi = {
        createRectangle({ width, height, color, x, y, textContent }): any {
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
        },

        createColumn({ columnIndex, columnWidth, rowHeight, gutter, color, textContent }): GroupNode {
            const x = gutter + (gutter + columnWidth) * columnIndex;
            const columnGroup = editor.createGroup();
            const headerRect = sandboxApi.createRectangle({ width: columnWidth, height: rowHeight, color, x, y: gutter, textContent });
            columnGroup.children.append(headerRect);

            return columnGroup;
        },

        createRow({ rowIndex, columns, columnWidth, rowHeight, gutter, color, rowValues, selectedStyle }): GroupNode {
            const y = gutter + (gutter + rowHeight) * (rowIndex + 1);
            const rowGroup = editor.createGroup();

            const isEvenRow = rowIndex % 2 === 0;
            const rowColor = isEvenRow ? hexToRgba(selectedStyle.colors.alt_row) : color;
            for (let i = 0; i < columns; i++) {
                const cellTextContent = rowValues[i] || `Row ${rowIndex + 1}, Col ${i + 1}`;
                const cellRect = sandboxApi.createRectangle({ width: columnWidth, height: rowHeight, color: rowColor, x: gutter + (gutter + columnWidth) * i, y, textContent: cellTextContent });
                rowGroup.children.append(cellRect);
            }
            return rowGroup;
        },

        createTable({ columns, rows, gutter, selectedStyle, columnValues, rowData }): void {
            const columnColor = colorUtils.fromHex(selectedStyle.colors.header);
            const rowColor = colorUtils.fromHex(selectedStyle.colors.row);
            const tableWidth = 1000;
            const tableHeight = 700;
        
            const effectiveTableWidth = tableWidth - ((columns + 1) * gutter);
            const effectiveTableHeight = tableHeight - ((rows + 1) * gutter);
        
            // Ensure columns don't exceed available width
            const columnWidth = Math.max(effectiveTableWidth / columns, 200); // Minimum column width of 200px
            // Ensure rows don't exceed available height
            const rowHeight = Math.max(effectiveTableHeight / rows, 50); // Minimum row height of 50px
        
            // Ensure column width and row height are not negative
            if (columnWidth < 0 || rowHeight < 0) {
                console.error("Invalid dimensions calculated. Please check table width, height, and gutter size.");
                return;
            }
        
            const page = editor.documentRoot.pages.first;
            const tableGroup = editor.createGroup();
            console.log(`Column Width: ${columnWidth}, Row Height: ${rowHeight}`);
            // const columnWidth = (tableWidth - (columns + 1) * gutter) / columns;
            // const rowHeight = (tableHeight - (rows + 1) * gutter) / rows;
            // const page = editor.documentRoot.pages.first;
            // const tableGroup = editor.createGroup();


            // Create columns
            for (let i = 0; i < columns; i++) {
                const columnText = columnValues[`Column ${i + 1}`] || `Column ${i + 1}`;
                const columnGroup = sandboxApi.createColumn({ columnIndex: i, columnWidth, rowHeight, gutter, color: columnColor, textContent: columnText });
                tableGroup.children.append(columnGroup);
            }

            // Create rows
            for (let i = 0; i < rows; i++) {
                const rowValues = Object.values(rowData[i] || {});
                const rowGroup = sandboxApi.createRow({ rowIndex: i, columns, columnWidth, rowHeight, gutter, color: rowColor, rowValues, selectedStyle });
                tableGroup.children.append(rowGroup);
            }

            page.artboards.first.children.append(tableGroup);
            tableGroup.locked = true;
        }
    }

    runtime.exposeApi(sandboxApi);
}

start();
