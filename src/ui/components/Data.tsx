import React, { useState } from 'react';
import { NumberField, NumberFieldType } from '@swc-react/number-field';
import { Picker, PickerType } from '@swc-react/picker';
import { FieldLabel, FieldLabelType } from '@swc-react/field-label';
import {
    MenuItem
} from '@swc-react/menu';

import './App.css'
import { Button } from '@swc-react/button';


type IDataProps = {
    columns: number,
    rows: number,
    setRows: React.Dispatch<React.SetStateAction<number>>,
    setColumns: React.Dispatch<React.SetStateAction<number>>,
    setColumnValues: React.Dispatch<React.SetStateAction<{
        [key: string]: string;
    }>>
}
const Data: React.FC<IDataProps> = ({ columns, rows, setRows, setColumns, setColumnValues }) => {
    const [csvData, setCsvData] = useState<any[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [isPaidUser, setIsPaidUser] = useState<boolean>(true);

    const handleRowsChange = (event: any) => {
        setRows(Number(event.target._value));
    };

    const handleColumnsChange = (event: any) => {
        setColumns(Number(event.target._value));
    };


    const handlePickerChange = (event: any) => {
        const { id, value } = event.target;
        setColumnValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
        // console.log(`ID: ${id}, Value: ${value}`);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            console.log("yes");
        }
    };

    const handleReset = () => {
        setCsvData([]);
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
            {isPaidUser && <div>
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
                    <Button variant='primary' style={{marginLeft: '0.4rem'}} onClick={handleReset}>Reset</Button>
                </div>
            </div>}
            <div className='rows_col'>
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
            </div>
            <div className='rows_col wrap'>
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
            </div>
        </div>
    );
}

export default Data;