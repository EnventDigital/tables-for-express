import React, { useEffect, useRef, useState } from 'react';
import {
    Tabs,
    Tab,
    TabPanel
} from '@swc-react/tabs';
import '../components/App.css'
import Data from '../components/Data';
import Design from '../components/Design';
import Options from '../components/Options';
import Tables from '../components/Table';
import { ColumnDefinition } from 'react-tabulator';
import { ITableStyle } from '../utils/types';
import { tableStyles } from '../utils/font';
import { Button } from '@swc-react/button';
import { DocumentSandboxApi } from '../../models/DocumentSandboxApi';

type IAdd = {
    sandboxProxy: DocumentSandboxApi,
    rowData: any[]
    rows: number,
    columns: number
    csvData: ColumnDefinition[],
    columnValues: {
        [key: string]: string;
    }
    fontFamily: string
    fontType: string,
    textAlignment: "left" | "center" | "right"
    isImport: boolean,
    imported: boolean,
    selectedStyle: ITableStyle
    setCsvData: React.Dispatch<React.SetStateAction<ColumnDefinition[]>>
    setRowData: React.Dispatch<React.SetStateAction<any[]>>,
    setRows: React.Dispatch<React.SetStateAction<number>>
    setColumns: React.Dispatch<React.SetStateAction<number>>
    setColumnValues: React.Dispatch<React.SetStateAction<{
        [key: string]: string;
    }>>
    setFontFamily: React.Dispatch<React.SetStateAction<string>>
    setFontType: React.Dispatch<React.SetStateAction<string>>
    setTextAlignment: React.Dispatch<React.SetStateAction<"left" | "center" | "right">>
    setIsImport: React.Dispatch<React.SetStateAction<boolean>>
    setImported: React.Dispatch<React.SetStateAction<boolean>>
    setStyle: React.Dispatch<React.SetStateAction<ITableStyle>>
}

const AddTables: React.FC<IAdd> = ({ sandboxProxy,rows, rowData, columns, columnValues, csvData, textAlignment, fontFamily, fontType, isImport, imported, selectedStyle, setCsvData, setColumnValues, setColumns, setFontFamily, setFontType, setImported, setIsImport, setRowData, setRows, setStyle, setTextAlignment }) => {
    // const [csvData, setCsvData] = useState<ColumnDefinition[]>([]);
    // const [rowData, setRowData] = useState<any[]>([]);
    // const [rows, setRows] = useState<number>(0);
    // const [columns, setColumns] = useState<number>(0);
    // const [columnValues, setColumnValues] = useState<{ [key: string]: string }>({});
    // const [fontFamily, setFontFamily] = useState<string>('Arial');
    // const [fontType, setFontType] = useState<string>('normal');
    // const [textAlignment, setTextAlignment] = useState<"left" | "center" | "right">('left');
    // const [isImport, setIsImport] = useState<boolean>(false);
    // const [imported, setImported] = useState<boolean>(false);
    // const [selectedStyle, setSelectedStyle] = useState<ITableStyle>(tableStyles[7]);

    useEffect(() => {
        if (imported && csvData.length > 0) {
            const newColumnValues: { [key: string]: string } = {};
            csvData.forEach((col, index) => {
                newColumnValues[`Column ${index + 1}`] = col.title;
            });
            setColumnValues(newColumnValues);
            setColumns(csvData.length);
            setRows(rowData.length);
        }
    }, [csvData, rowData, isImport]);

    const handleCreate = async (event: any) => {
        let currentColumnValues = columnValues;

        if (!imported && csvData.length > 0) {
            const newColumnValues: { [key: string]: string } = {};
            csvData.forEach((col, index) => {
                newColumnValues[`Column ${index + 1}`] = col.title;
            });
            setColumnValues(newColumnValues);
            currentColumnValues = newColumnValues;
        }
        const gutter = 6;
        sandboxProxy.createTable({ columns, rows, gutter, selectedStyle, columnValues: currentColumnValues, rowData })
    }

    console.log(rowData);
    return (
        <div className='add-table' style={{maxWidth: '250px'}}>
            <h2>Add Table</h2>
            <Tabs compact size='m' selected='Data' >
                <Tab label="Data" value="Data"></Tab>
                <Tab label="Design" value="Design"></Tab>
                <Tab label="Options" value="Options"></Tab>
                <TabPanel value="Design"><Design setStyle={setStyle} /></TabPanel>
                <TabPanel value="Data"><Data setImported={setImported} textAlignment={textAlignment} isImport={isImport} setIsImport={setIsImport} setCsvData={setCsvData} setRowData={setRowData} columns={columns} rows={rows} setColumnValues={setColumnValues} setColumns={setColumns} setRows={setRows} /></TabPanel>
                <TabPanel value="Options"><Options setFontFamily={setFontFamily} setFontType={setFontType} setTextAlignment={setTextAlignment} /></TabPanel>
            </Tabs>
            <Tables setCsvData={setCsvData} selectedStyle={selectedStyle} csvData={csvData} rowData={rowData} isImport={isImport} columnValues={columnValues} columns={columns} rows={rows} fontFamily={fontFamily} fontType={fontType} textAlignment={textAlignment} />
            <div id='create'>
                <Button variant='accent' onClick={handleCreate}>
                    Create
                </Button>
                <Button variant='primary' treatment='outline'>
                    Cancel
                </Button>
            </div>
        </div>
    );
}

export default AddTables;
