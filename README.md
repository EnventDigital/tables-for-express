# Tables for Adobe Express

This project has been created with _@adobe/create-ccweb-add-on_. As an example, this Add-on demonstrates how to get started with Add-on development using React and TypeScript with Document Sandbox Runtime.

## Table of Contents

- [About](#about)
- [Tools](#tools)
- [Setup](#setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
  - [DocumentSandboxApi](#documentsandboxapi)
- [Contributing](#contributing)
- [License](#license)

## About

This project is an Adobe Express Add-on that allows users to create and manipulate tables within Adobe Express documents. It leverages the Document Sandbox Runtime to provide a seamless integration with Adobe Express, enabling advanced table creation and customization features.

## Tools

- HTML
- CSS
- React
- TypeScript
- Adobe Express Document Sandbox SDK

## Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/tables-for-express.git
    cd tables-for-express
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Build the application:
    ```sh
    npm run build
    ```

4. Start the application:
    ```sh
    npm run start
    ```

## Usage

Once the application is running, you can access it in Adobe Express. The Add-on provides a user interface for creating and customizing tables. You can specify the number of rows and columns, import data from CSV files, and apply various styles to the table.

### Creating a Table

1. Open the Add-on in Adobe Express.
2. Use the "Data" tab to specify the number of rows and columns or import data from a CSV file.
3. Use the "Design" tab to select a style for the table.
4. Use the "Options" tab to customize text alignment and other settings.
5. Click the "Create" button to generate the table in the document.

## API Documentation

### DocumentSandboxApi

The `DocumentSandboxApi` interface declares all the APIs that the document sandbox runtime exposes to the UI/iframe runtime. Below are the detailed descriptions of each API method.

#### `createRectangle`

Creates a rectangle with specified dimensions, color, position, and text content.

```typescript
createRectangle({width, height, color, textColor, x, y, textContent, textAlignment, strokeColor, strokeWidth}): GroupNode | null;
```

- **Parameters:**
  - `width`: The width of the rectangle.
  - `height`: The height of the rectangle.
  - `color`: The fill color of the rectangle.
  - `textColor`: The color of the text inside the rectangle.
  - `x`: The x-coordinate of the rectangle's position.
  - `y`: The y-coordinate of the rectangle's position.
  - `textContent`: The text content inside the rectangle.
  - `textAlignment`: The alignment of the text within the rectangle.
  - `strokeColor`: The color of the rectangle's border.
  - `strokeWidth`: The width of the rectangle's border.

- **Returns:** A group node containing the rectangle and text, or null if creation fails.

- **Throws:** When invalid dimensions are provided.

#### `createTable`

Creates a table with specified columns, rows, and styling.

```typescript
createTable({ columns, rows, gutter, selectedStyle, columnValues, rowData, textAlignment}): void;
```

- **Parameters:**
  - `columns`: Number of columns in the table.
  - `rows`: Number of rows in the table.
  - `gutter`: Space between cells.
  - `selectedStyle`: Style configuration object containing colors for header, row, and stroke.
  - `columnValues`: Object containing column headers text values.
  - `rowData`: Array of objects containing data for each row.
  - `textAlignment`: Text alignment within cells.

- **Throws:** If columns or rows are less than or equal to 0, if table dimensions result in invalid height, or if column or row creation fails.

#### `createRow`

Creates a row of cells in a table layout.

```typescript
createRow({rowIndex, columns, columnWidth, rowHeight, gutter, color, selectedStyle, rowValues, textAlignment, strokeColor, strokeWidth }): GroupNode | null;
```

- **Parameters:**
  - `rowIndex`: The index of the row (0-based).
  - `columns`: The number of columns in the row.
  - `columnWidth`: The width of each column.
  - `rowHeight`: The height of the row.
  - `gutter`: The spacing between cells and rows.
  - `color`: The default color for cells in this row.
  - `rowValues`: Array of text values for each cell in the row.
  - `selectedStyle`: Style configuration object containing colors property.
  - `textAlignment`: The alignment of text within cells.
  - `strokeColor`: The color of the cell borders.
  - `strokeWidth`: The width of the cell borders.

- **Returns:** A group node containing the row's cells, or null if creation fails.

- **Throws:** When invalid dimensions or column count are provided, or when cell creation fails.

#### `createColumn`

Creates a column with specified dimensions, color, and text content.

```typescript
createColumn ({columnIndex, columnWidth, rowHeight, gutter, color, textColor, textContent, textAlignment, strokeColor, strokeWidth}): GroupNode | null;
```

- **Parameters:**
  - `columnIndex`: The index of the column (0-based).
  - `columnWidth`: The width of the column.
  - `rowHeight`: The height of the column's header row.
  - `gutter`: The spacing between columns.
  - `color`: The fill color of the column's header row.
  - `textColor`: The color of the text inside the column's header row.
  - `textContent`: The text content inside the column's header row.
  - `textAlignment`: The alignment of the text within the column's header row.
  - `strokeColor`: The color of the column's border.
  - `strokeWidth`: The width of the column's border.

- **Returns:** A group node containing the column's header row, or null if creation fails.

- **Throws:** When invalid dimensions are provided.

#### `wrapText`

Wraps text to fit within a specified width.

```typescript
wrapText({textContent, width, textWidth}) : string;
```

- **Parameters:**
  - `textContent`: The text content to wrap.
  - `width`: The maximum width for the wrapped text.
  - `textWidth`: The width of the text content.

- **Returns:** The wrapped text.

#### `calculateTextWidth`

Calculates the width of a given text string.

```typescript
calculateTextWidth(text): number;
```

- **Parameters:**
  - `text`: The text string to measure.

- **Returns:** The width of the text string.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with a descriptive message.
4. Push your changes to your fork.
5. Create a pull request to the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
