import React, { useEffect, useRef, useState } from 'react';
import '@spectrum-web-components/tabs/sp-tabs.js';
import '@spectrum-web-components/tabs/sp-tab.js';
import '@spectrum-web-components/tabs/sp-tab-panel.js';
import '../components/App.css'
import Data from '../components/Data';
import Design from '../components/Design';
import Options from '../components/Options';
import Tables from '../components/Table';
import { ColumnDefinition } from 'react-tabulator';
import { ITableStyle } from '../utils/types';
import { tableStyles } from '../utils/font';
import { Button } from '@swc-react/button';
import { ProgressCircle } from '@swc-react/progress-circle';
import { DocumentSandboxApi } from '../../models/DocumentSandboxApi';
import { Toast } from "@swc-react/toast";

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
    onTableCreated: () => void // Callback to trigger navigation to results page
}

const AddTables: React.FC<IAdd> = ({ 
    sandboxProxy, 
    rows, 
    rowData, 
    columns, 
    columnValues, 
    csvData, 
    textAlignment, 
    fontFamily, 
    fontType, 
    isImport, 
    imported, 
    selectedStyle, 
    setCsvData, 
    setColumnValues, 
    setColumns, 
    setFontFamily, 
    setFontType, 
    setImported, 
    setIsImport, 
    setRowData, 
    setRows, 
    setStyle, 
    setTextAlignment,
    onTableCreated
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
    const [fileName, setFileName] = useState<string>('');
    const [errorText, setErrorText] = useState<any>(null);
    const [selectedTab, setSelectedTab] = useState<string>("Data");

    // Reference to the tabs element
    const tabsRef = useRef<any>(null);

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

    /**
     * Handles the creation of a table with the specified properties.
     * 
     * @param event - The event object triggering the table creation
     * 
     * @remarks
     * This function manages the table creation process by:
     * - Setting loading state during creation
     * - Handling imported CSV data if present
     * - Creating column values based on CSV data or existing values
     * - Sending table creation request to sandboxProxy
     * - Managing success/error states
     * 
     * @throws Will propagate any errors from the sandboxProxy.createTable call
     * 
     * @param {any} event - The event object
     * @returns {Promise<void>}
     */
    const handleCreate = async (event: any) => {
        setIsLoading(true); // Set loading state to true
        let currentColumnValues = columnValues;

        if (!imported && csvData.length > 0) {
            const newColumnValues: { [key: string]: string } = {};
            csvData.forEach((col, index) => {
                newColumnValues[`Column ${index + 1}`] = col.title;
            });
            currentColumnValues = newColumnValues;
        }
        const gutter = 0;
        
        try {
            await sandboxProxy.createTable({ 
                columns, 
                rows, 
                gutter, 
                selectedStyle, 
                columnValues: currentColumnValues, 
                rowData, 
                textAlignment 
            });
            
            // After successful table creation, navigate to the results page
            onTableCreated();
        } catch (error) {
            setErrorText(error.message);
        } finally {
            setIsLoading(false); // Set loading state to false after the table is created
        }
    }
    
    /**
     * Resets all table-related state variables to their default values.
     * This includes:
     * - Clearing CSV and row data
     * - Resetting row and column counts
     * - Clearing column values
     * - Resetting filename
     * - Resetting import/generation flags
     * - Resetting styling options (font, type, alignment)
     * - Clearing error messages
     * - Switching back to the Data tab
     */
    const handleReset = () => {
        setCsvData([]);
        setRowData([]);
        setRows(0);
        setColumns(0);
        setColumnValues({});
        setFileName('');
        setImported(false);
        setIsImport(false);
        setIsLoading(false);
        setFontFamily('Arial');
        setFontType('normal');
        setStyle(tableStyles[7]);
        setTextAlignment('left');
        setErrorText(null);
        
        // Switch back to the Data tab
        setSelectedTab("Data");
        if (tabsRef.current) {
            tabsRef.current.selected = "Data";
        }
    };

    /**
     * Handles the closing of toast notifications.
     */
    const handleToastClose = () => {
        setErrorText(null);
    }

    return (
        <div className='add-table' style={{ maxWidth: '250px' }}>
            {!isLoading &&
                <>
                    <h2>Add Table</h2>
                    <sp-tabs ref={tabsRef} selected={selectedTab} size="m" compact style={{ 
                        height: "280px", // Fixed height for all conditions
                        marginBottom: '5px'
                    }}>
                        <sp-tab label="Data" value="Data"></sp-tab>
                        <sp-tab label="Design" value="Design"></sp-tab>
                        <sp-tab label="Options" value="Options"></sp-tab>
                        <sp-tab-panel value="Design"><Design setStyle={setStyle} /></sp-tab-panel>
                        <sp-tab-panel value="Data"><Data fileName={fileName} setFileName={setFileName} columnValues={columnValues} setImported={setImported} textAlignment={textAlignment} isImport={isImport} setIsImport={setIsImport} setCsvData={setCsvData} setRowData={setRowData} columns={columns} rows={rows} setColumnValues={setColumnValues} setColumns={setColumns} setRows={setRows} /></sp-tab-panel>
                        <sp-tab-panel value="Options"><Options setFontFamily={setFontFamily} setFontType={setFontType} setTextAlignment={setTextAlignment} textAlignment={textAlignment}  /></sp-tab-panel>
                    </sp-tabs>
                    
                    {/* Table preview container with direct visibility control */}
                    <div style={{ display: "block" }}>
                        <Tables 
                            setRowData={setRowData}
                            setCsvData={setCsvData}
                            selectedStyle={selectedStyle}
                            csvData={csvData}
                            rowData={rowData}
                            isImport={isImport}
                            columnValues={columnValues}
                            columns={columns}
                            rows={rows}
                            fontFamily={fontFamily}
                            fontType={fontType}
                            textAlignment={textAlignment}
                        />
                    </div>
                </>
            }
            {isLoading &&
                <div style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                    <ProgressCircle
                        label="creating table"
                        indeterminate
                        size="l"
                    />
                </div>
            }
            <div id='create'>
                <Button variant='accent' onClick={handleCreate}>
                    Create
                </Button>
                <Button variant='primary' treatment='outline' onClick={handleReset}>
                    Reset
                </Button>
            </div>
            <Toast 
                open={!!errorText}
                id='spectrum-error-toast'
                style={{ width: "90%", position: 'fixed', top: "80%", zIndex: 3 }}
                variant='negative'
                timeout={7000}
            >
                {errorText}
            </Toast>
        </div>
    );
}

export default AddTables;
