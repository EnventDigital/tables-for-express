import React, { useState } from 'react';
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
import { FieldGroup } from '@swc-react/field-group';
import { DocumentSandboxApi } from '../../models/DocumentSandboxApi';

type IAdd = {
    sandboxProxy: DocumentSandboxApi,
}

const AddTables: React.FC<IAdd> = ({ sandboxProxy }) => {
    const [csvData, setCsvData] = useState<ColumnDefinition[]>([]);
    const [rowData, setRowData] = useState<any[]>([]);
    const [rows, setRows] = useState<number>(0);
    const [columns, setColumns] = useState<number>(0);
    const [columnValues, setColumnValues] = useState<{ [key: string]: string }>({});
    const [fontFamily, setFontFamily] = useState<string>('Arial');
    const [fontType, setFontType] = useState<string>('normal');
    const [textAlignment, setTextAlignment] = useState<"left" | "center" | "right">('left');
    const [isImport, setIsImport] = useState<boolean>(false);
    const [selectedStyle, setSelectedStyle] = useState<ITableStyle | null>(tableStyles[7]);


    const handleCreate = async(event: any) => {
        sandboxProxy.createRectangle();
    }
    
    return (
        <div className='add-table'>
            <h2>Add Table</h2>
            <Tabs compact size='m' selected='Data'>
                <Tab label="Data" value="Data"></Tab>
                <Tab label="Design" value="Design"></Tab>
                <Tab label="Options" value="Options"></Tab>
                <TabPanel value="Design"><Design setSelectedStyle={setSelectedStyle} /></TabPanel>
                <TabPanel value="Data"><Data textAlignment={textAlignment} isImport={isImport} setIsImport={setIsImport} setCsvData={setCsvData} setRowData={setRowData} columns={columns} rows={rows} setColumnValues={setColumnValues} setColumns={setColumns} setRows={setRows} /></TabPanel>
                <TabPanel value="Options"><Options setFontFamily={setFontFamily} setFontType={setFontType} setTextAlignment={setTextAlignment} /></TabPanel>
            </Tabs>
            <Tables selectedStyle={selectedStyle} csvData={csvData} rowData={rowData} isImport={isImport} columnValues={columnValues} columns={columns} rows={rows} fontFamily={fontFamily} fontType={fontType} textAlignment={textAlignment} />
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
