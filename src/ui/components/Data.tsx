import React from 'react';
import { NumberField } from '@swc-react/number-field';
import { Picker} from '@swc-react/picker';
import { FieldLabel} from '@swc-react/field-label';
import { Switch } from '@swc-react/switch'
import { FieldGroup } from '@swc-react/field-group'
import Papa from 'papaparse';
import {
    MenuItem
} from '@swc-react/menu';
import './App.css'
import { Button } from '@swc-react/button';
import { ColumnDefinition } from 'react-tabulator';
import { generateData } from '../utils/font';

type IDataProps = {
    columns: number,
    textAlignment: "left" | "center" | "right",
    rows: number,
    isImport: boolean,
    columnValues: {
        [key: string]: string;
    }
    fileName: string
    setRows: React.Dispatch<React.SetStateAction<number>>,
    setColumns: React.Dispatch<React.SetStateAction<number>>,
    setIsImport: React.Dispatch<React.SetStateAction<boolean>>,
    setImported: React.Dispatch<React.SetStateAction<boolean>>,
    setCsvData: React.Dispatch<React.SetStateAction<ColumnDefinition[]>>
    setRowData: React.Dispatch<React.SetStateAction<any[]>>
    setColumnValues: React.Dispatch<React.SetStateAction<{
        [key: string]: string;
    }>>
    setFileName: React.Dispatch<React.SetStateAction<string>>
}
const Data: React.FC<IDataProps> = ({ fileName, textAlignment, isImport, columns, rows, columnValues, setRowData, setCsvData, setRows, setColumns, setColumnValues, setIsImport, setImported, setFileName }) => {

    const columnsData: ColumnDefinition[] = [
        { title: "Name", field: "Name", width: 150 },
        { title: "Address", field: "Address", width: 150 },
        { title: "Email", field: "Email", width: 300 },
        { title: "Phone", field: "Phone", width: 150 },
        { title: "Website", field: "Website", width: 150 },
        { title: "Department", field: "Department", width: 150 },
        { title: "Product", field: "Product", width: 150 },
        { title: "Price", field: "Price", width: 150 },
        { title: "Company", field: "Company", width: 150 },
        { title: "Day", field: "Day", width: 150 },
        { title: "Gender", field: "Gender", width: 150 }
    ];

    /**
     * Handles changes to the number of rows in the table.
     * Updates the rows state and generates new data based on the updated row count.
     * 
     * @param event - The change event from the row input element
     * @param event.target._value - The new number of rows selected
     */
    const handleRowsChange = (event: any) => {
        setRows(Number(event.target._value));
        const data = generateData(Number(event.target._value));
        setRowData(data);

        console.log('rows', rows);
        console.log('rows_value', event.target._value);
        console.log('data', data);
        
    };


    /**
     * Handles changes in the number of columns selected.
     * 
     * @param event - The event object from the column selection input
     * @param event.target._value - The selected number of columns
     * 
     * Updates the following states:
     * - columns: Sets the new number of columns
     * - csvData: Slices the columnsData array to match the new column count
     * - columnValues: Generates an object with column names as keys and field values
     *      from columnsData as values, up to the selected number of columns
     */
    const handleColumnsChange = (event: any) => {
        const col = Number(event.target._value);
        setColumns(Number(event.target._value));
        setCsvData(columnsData.slice(0, event.target._value));

               
        const initialColumnValues = Array.from({ length:  col}).reduce((acc, _, index) => {
            acc[`Column ${index + 1}`] = columnsData[index]?.field || "";
            return acc;
        }, {} as { [key: string]: string });

        console.log('initialColumnValues', initialColumnValues);
        

        setColumnValues(initialColumnValues as { [key: string]: string });
        console.log('columnValues', columnValues);
        console.log('columnsData', columnsData);
        console.log('columns', columns);
        console.log('col', col);
        console.log('event.target._value', event.target._value);

    };

    /**
     * Handles changes in the column picker dropdown.
     * 
     * @param event - The change event from the dropdown picker
     * @description This function updates the column values and CSV data when a user selects a new value in the column picker.
     * It performs the following operations:
     * 1. Updates the column values state with the new selection
     * 2. Maps through the existing CSV data to update column fields and titles
     * 3. Regenerates the row data to align with the updated column structure
     * 
     * @example
     * <select id="Column 1" onChange={handlePickerChange}>
     *   <option value="name">Name</option>
     *   <option value="age">Age</option>
     * </select>
     */
    const handlePickerChange = (event: any) => {
        const { id, value } = event.target;

        // Update column values
        const updatedColumnValues = {
            ...columnValues,
            [id]: value
        };

        setColumnValues(updatedColumnValues);

        setCsvData(prevCsvData => {
            const mappedColumns = prevCsvData.map((col, index) => {
                const columnId = `Column ${index + 1}`;

                const mappedField = updatedColumnValues[columnId] || col.field;

                return {
                    ...col,
                    field: mappedField,
                    title: mappedField.charAt(0).toUpperCase() + mappedField.slice(1),
                };
            });

            // Generate data that aligns with the updated columns
            const data = generateData(rows).map(item => {
                let newRow = {};
                mappedColumns.forEach(col => {
                    newRow[col.field] = item[col.field];
                });
                return newRow;
            });
            setRowData(data);
            return mappedColumns;
        });
    };

    /**
     * Handles the switch between import and manual table creation modes.
     * Resets all table-related states when the switch changes.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the switch input
     * @returns {void}
     */
    const handleImportSwitch = (event: any) => {
        setIsImport(event.target.checked)
        setCsvData([]);
        setRowData([]);
        setColumnValues({});
        setRows(0);
        setColumns(0);
    };

    /**
     * Handles CSV file upload and parsing.
     * Uses Papa Parse to process the CSV file and extract data.
     * 
     * @param event - The file input change event
     * 
     * The function:
     * 1. Extracts the first file from the input
     * 2. Updates the file name and import status state
     * 3. Parses the CSV file using Papa Parse
     * 4. Extracts column headers and creates column definitions
     * 5. Updates the CSV data and row data states
     * 
     * @remarks
     * - Assumes first row contains headers (header: true)
     * - Applies text alignment to both header and content cells
     * - Column definitions follow Tabulator format
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setImported(true);
            // Parse the csv file
            Papa.parse(file, {
                complete: (results) => {
                    const parsedData = results.data;
                    if (parsedData.length > 0) {
                        // Extract column headers
                        const headers = Object.keys(parsedData[0]);
                        const cols = headers.map((header) => ({
                            title: header,
                            field: header,
                            hozAlign: textAlignment, // Default alignment
                            headerHozAlign: textAlignment,
                        }));
                        setCsvData(cols);
                        setRowData(parsedData);
                    }
                },
                header: true // Automatically use the first row as headers
            });
        }
    };

    /**
     * Truncates a file name to a specified maximum length while preserving the file extension.
     * @param name - The original file name to be truncated
     * @param maxLength - The maximum length allowed for the truncated file name
     * @returns The truncated file name if it exceeds maxLength, or the original name if it doesn't
     * 
     * @example
     * truncateFileName("very_long_filename.txt", 15) // returns "very_lon...txt"
     * truncateFileName("short.txt", 15) // returns "short.txt"
     */
    const truncateFileName = (name: string, maxLength: number) => {
        if (name.length <= maxLength) {
            return name;
        }
        const extension = name.slice(name.lastIndexOf('.'));
        const truncatedName = name.slice(0, maxLength - extension.length - 3) + '...' + extension;
        return truncatedName;
    };

    return (
        <div>
            <FieldGroup horizontal id="horizontal" className="field-group">
                <span className="import-label">Import</span>
                <Switch emphasized size="l" change={(e) => handleImportSwitch(e)} id='switch' checked={isImport}>
                    Dummy
                </Switch>
            </FieldGroup> 
            {!isImport && <div>
                <div className='import'>
                    {!fileName && <p className='choose'>Choose csv file:</p>}
                    {fileName && <h3 className='selected-file'>Selected file: <span>{truncateFileName(fileName, 13)}</span></h3>}
                </div>
                <div>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        title='choose csv'
                        id="fileInput"
                        style={{ display: 'none' }}
                        multiple={false}
                    />
                    <label htmlFor="fileInput">
                        <Button size='m' treatment='outline' variant='secondary'>Import</Button>
                    </label>
                </div>
            </div>}
            {isImport && <div className='rows_col'>
                <div className='column'>
                    <FieldLabel
                        for='columns'
                        size='m'
                    >Columns</FieldLabel>
                    <NumberField
                        label="Columns"
                        value={columns}
                        id='columns'
                        size='m'
                        placeholder='Columns'
                        style={{ width: "100%" }}
                        min={0}
                        max={11}
                        change={(e) => handleColumnsChange(e)}
                    />
                </div>
                <div className='row'>
                    <FieldLabel
                        for='rows'
                        size='m'
                    >Rows</FieldLabel>
                    <NumberField
                        label="Rows"
                        value={rows}
                        id='rows'
                        size='m'
                        placeholder='Rows'
                        style={{ width: "100%" }}
                        min={0}
                        // max={20}
                        change={(e) => handleRowsChange(e)}
                    />
                </div>
            </div>}
            {isImport && <div className='rows_col wrap'>
                <div style={{ width: '100%', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1rem', width: 'max-content', whiteSpace: 'nowrap' }}>
                        {Array.from({ length: columns }).map((_, index) => (
                            <div key={index} style={{ display: 'inline-block', padding: '5px 0px', textAlign: 'center' }}>
                                <FieldLabel for={`Column ${index + 1}`} size="m">Column {index + 1}</FieldLabel>
                                <Picker
                                    key={`Column ${index + 1}`}
                                    style={{ width: "100%", display: 'block' }}
                                    id={`Column ${index + 1}`} size="m" label="Selection type"
                                    value={columnValues[`Column ${index + 1}`] || ""}
                                    change={(e) => handlePickerChange(e)}
                                >
                                    {columnsData.map((item, itemIndex) => (
                                        <MenuItem key={itemIndex} value={item.field}>{item.title}</MenuItem>
                                    ))}
                                </Picker>
                            </div>
                        ))}
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default Data;