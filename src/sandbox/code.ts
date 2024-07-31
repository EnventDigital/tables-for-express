import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils, constants} from "express-document-sdk";
import { DocumentSandboxApi } from "../models/DocumentSandboxApi";

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

function start(): void {
    // APIs to be exposed to the UI runtime
    // i.e., to the `App.tsx` file of this add-on.
    const sandboxApi: DocumentSandboxApi = {
        createRectangle: ({ width, height, fill }) => {
            const rectangle = editor.createRectangle();

            // Define rectangle dimensions.
            rectangle.width = width || 240;
            rectangle.height = height || 180;

            // Define rectangle position.
            rectangle.translation = { x: 10, y: 10 };

            // Define rectangle color.
            const color = { red: 0.32, green: 0.34, blue: 0.89, alpha: 1 };

            // Fill the rectangle with the color.
            const rectangleFill = editor.makeColorFill(fill);
            console.log(rectangleFill);

            rectangle.fill = rectangleFill;

            // Add the rectangle to the document.
            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(rectangle);
        },

        createTable: ({columns, rows, gutter, columnColor, rowColor }) => {
            console.log("addGrid", columns, rows, gutter, columnColor, rowColor)
            // Access the document
            const doc = editor.documentRoot;
            const page = doc.pages.first;
        
            // Create rows
            const rowHeight = (page.height - (rows + 1) * gutter) / rows;
            const rowGroup = editor.createGroup();
            page.artboards.first.children.append(rowGroup);
        
            for (let i = 0; i < rows; i++) {
                let r = editor.createRectangle();
                r.width = page.width;
                r.height = rowHeight;
                r.translation = { x: 0, y: gutter + (gutter + rowHeight) * i };
                const fillColor = editor.makeColorFill(rowColor);
                r.fill = fillColor;
                rowGroup.blendMode = constants.BlendMode.multiply;
                rowGroup.children.append(r);
            }
        
            // Create columns similarly
            const colWidth = (page.width - (columns + 1) * gutter) / columns;
            const columnGroup = editor.createGroup();
            page.artboards.first.children.append(columnGroup);
        
            for (let j = 0; j < columns; j++) {
                let c = editor.createRectangle();
                c.width = colWidth;
                c.height = page.height;
                c.translation = { x: gutter + (gutter + colWidth) * j, y: 0 };
                const colFillColor = editor.makeColorFill(columnColor);
                c.fill = colFillColor;
                columnGroup.blendMode = constants.BlendMode.multiply;
                columnGroup.children.append(c);
            }

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    let rect = editor.createRectangle();
                    // Create text
                    let text = editor.createText();
                    text.text = `Row ${i + 1}, Col ${j + 1}`;
                    // text.fill = editor.makeColorFill(colorUtils.fromHex(rowColor));
                    // text.fontSize = 16;
                    text.translation = { x: rect.translation.x + 5, y: rect.translation.y + 5 };
                    page.artboards.first.children.append(text);
                }
            }
        
            // Group all
            const gridGroup = editor.createGroup();
            gridGroup.children.append(rowGroup, columnGroup);
            page.artboards.first.children.append(gridGroup);
            gridGroup.locked = true;
        }
    }

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();
