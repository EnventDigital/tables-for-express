import React, { useState } from 'react';
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
import { ColumnDefinition, ReactTabulator } from 'react-tabulator';


type IDataProps = {
    columns: number,
    textAlignment: "left" | "center" | "right",
    rows: number,
    isImport:boolean,
    setRows: React.Dispatch<React.SetStateAction<number>>,
    setColumns: React.Dispatch<React.SetStateAction<number>>,
    setIsImport:React.Dispatch<React.SetStateAction<boolean>>,
    setCsvData: React.Dispatch<React.SetStateAction<ColumnDefinition[]>>
    setRowData: React.Dispatch<React.SetStateAction<any[]>>
    setColumnValues: React.Dispatch<React.SetStateAction<{
        [key: string]: string;
    }>>
}
const Data: React.FC<IDataProps> = ({textAlignment, isImport, columns, rows, setRowData, setCsvData, setRows, setColumns, setColumnValues, setIsImport }) => {
    const [fileName, setFileName] = useState<string>('');

    const handleRowsChange = (event: any) => {
        setRows(Number(event.target._value));
    };


    // Handles the change event for the columns input field.
    const handleColumnsChange = (event: any) => {
        setColumns(Number(event.target._value));
    };

    // Handles the change event for the picker component.
    const handlePickerChange = (event: any) => {
        const { id, value } = event.target;
        setColumnValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };

    const handleImportSwitch = (event: any) => {
        setIsImport(event.target.checked)
    };

    // Handles the file change event.
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
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
                        }));
                        setCsvData(cols);
                        setRowData(parsedData);
                    }
                },
                header: true // Automatically use the first row as headers
            });
        }
    };

    const handleReset = () => {
        setCsvData([]);
        setRowData([]);
        setRows(0);
        setColumns(0);
        setColumnValues({});
        setFileName('');
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
                <Switch emphasized size="l" change={(e) => handleImportSwitch(e)} id='switch'>
                    Dummy
                </Switch>
            </FieldGroup>
            {!isImport && <div>
                <h3>Import a file</h3>
                <div className='import'>
                    {!fileName && <p className='choose'>Choose csv file:</p>}
                    {fileName && <p className='selected-file'>Selected file: <span>{truncateFileName(fileName, 13)}</span></p>}
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
                        <Button size='m'>Import</Button>
                    </label>
                    <Button variant='primary' style={{ marginLeft: '0.4rem' }} onClick={handleReset}>Cancel</Button>
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
                        change={(e) => handleRowsChange(e)}
                    />
                </div>
            </div>}
            {isImport && <div className='rows_col wrap'>
                {Array.from({ length: columns }).map((_, index) => (
                    <div className='columns-selection' key={index}>
                        <FieldLabel for={`Column ${index + 1}`} size="m">Column {index + 1}</FieldLabel>
                        <Picker
                            key={`Column ${index + 1}`}
                            style={{ width: "100%", display: 'block' }}
                            id={`Column ${index + 1}`} size="m" label="Selection type"
                            change={(e) => handlePickerChange(e)}
                        >
                            <MenuItem>hdhdjhfdjh</MenuItem>
                        </Picker>
                    </div>
                ))}
            </div>}
        </div>
    );
}

export default Data;