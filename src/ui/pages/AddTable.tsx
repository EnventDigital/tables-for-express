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

    function hexToRgba(hex: string): { red: number, green: number, blue: number, alpha: number } {
        // Remove the leading # if present
        hex = hex.replace(/^#/, '');
    
        // Parse the red, green, and blue values
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
    
        // Convert to normalized values (0-1 range)
        let red = r / 255;
        let green = g / 255;
        let blue = b / 255;
    
        // Default alpha to 1 if not provided
        let alpha = 1;
    
        return { red, green, blue, alpha };
    }
    
    const handleCreate = async(event: any) => {
        const width = 800;
        const height = 400;
        const fill = hexToRgba(selectedStyle.colors.row);
        const gutter = rows;
        const columnColor = hexToRgba(selectedStyle.colors.header);
        const rowColor = fill;
        // sandboxProxy.createRectangle({width, height, fill});
        sandboxProxy.createTable({columns, rows, gutter, columnColor, rowColor})
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
