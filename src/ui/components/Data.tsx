import React, { useEffect, useState } from 'react';
import { NumberField, NumberFieldType } from '@swc-react/number-field';
import { Picker, PickerType } from '@swc-react/picker';
import { FieldLabel, FieldLabelType } from '@swc-react/field-label';
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
        { title: "Name", field: "name", width: 150 },
        { title: "Address", field: "address", width: 150 },
        { title: "Email", field: "email", width: 150 },
        { title: "Phone", field: "phone", width: 150 },
        { title: "Website", field: "website", width: 150 },
        { title: "Department", field: "department", width: 150 },
        { title: "Product", field: "product", width: 150 },
        { title: "Price", field: "price", width: 150 },
        { title: "Company", field: "company", width: 150 },
        { title: "Day", field: "day", width: 150 },
        { title: "Gender", field: "gender", width: 150 }
    ];

    const handleRowsChange = (event: any) => {
        setRows(Number(event.target._value));
        const data = generateData(Number(event.target._value));
        setRowData(data);
    };


    // Handles the change event for the columns input field.
    const handleColumnsChange = (event: any) => {
        setColumns(Number(event.target._value));
        setCsvData(columnsData.slice(0, event.target._value))
    };

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

    const handleImportSwitch = (event: any) => {
        setIsImport(event.target.checked)
    };

    // Handles the file change event.
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