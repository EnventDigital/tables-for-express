import React, { useEffect } from 'react';
import './App.css'
import 'react-tabulator/lib/styles.css';
import "tabulator-tables/dist/css/tabulator.min.css";
import { ReactTabulator, ColumnDefinition, ReactTabulatorOptions } from 'react-tabulator'
import { ITableStyle } from '../utils/types';

type ITableProps = {
    columns?: number,
    csvData: ColumnDefinition[],
    rowData: any[],
    isImport: boolean,
    rows?: number,
    columnValues?: { [key: string]: string }
    fontFamily: string,
    fontType: string,
    textAlignment: "left" | "center" | "right",
    selectedStyle: ITableStyle,
    setCsvData: React.Dispatch<React.SetStateAction<ColumnDefinition[]>>
    setRowData: React.Dispatch<React.SetStateAction<any[]>>
}

const Tables: React.FC<ITableProps> = ({ selectedStyle, rowData, csvData, textAlignment, columns, columnValues }) => {
    useEffect(() => {
        const applyStyles = () => {
            const headerElements = document.getElementsByClassName('tabulator-col');
            const headerTitleElements = document.getElementsByClassName('tabulator-col-title');

            Array.from(headerElements).forEach(element => {
                (element as HTMLElement).style.backgroundColor = selectedStyle.colors.header;
            });

            Array.from(headerTitleElements).forEach(element => {
                (element as HTMLElement).style.color = selectedStyle.colors.header_text;
            });
        };

        const observer = new MutationObserver(applyStyles);
        observer.observe(document, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [selectedStyle]);

    /**
     * Configuration options for the React Tabulator instance
     * @property {number} height - Sets the height of the table to 200 pixels
     * @property {boolean} movableRows - Enables row dragging and reordering functionality
     * @property {string} progressiveLoad - Enables progressive loading on scroll
     * @property {number} progressiveLoadDelay - Sets delay of 200ms between loading batches of data
     * @property {number} progressiveLoadScrollMargin - Sets scroll margin of 30 pixels for triggering new data load
     */
    const options: ReactTabulatorOptions = {
        height: 200, // Reduced from 300px to 200px
        movableRows: true,
        progressiveLoad: 'scroll',
        progressiveLoadDelay: 200,
        progressiveLoadScrollMargin: 30,
    };

    // Generate a key to ensure proper rendering when data changes
    const tableKey = JSON.stringify({ selectedStyle, textAlignment, columns, columnValues, csvData });

    return (
        <div className='table-container fixed-height' id="example-table" style={{ 
            marginTop: '25px', // Increased from 15px to 25px for more space below tabs
            borderTop: '1px solid #e0e0e0',
            paddingTop: '10px'
        }}>
            {(csvData.length > 0) && (
                <ReactTabulator
                    key={tableKey}
                    data={rowData}
                    columns={csvData.map(col => ({
                        ...col,
                        headerSort: false,
                        vertAlign: "middle",
                        headerTooltip: false,
                        headerFilterPlaceholder: "",
                        headerFilterParams: {},
                        headerSortTristate: false,
                        hozAlign: textAlignment,
                        headerHozAlign: textAlignment,
                    }))}
                    layout="fitData"
                    rowFormatter={(row) => {
                        const rowElement = row.getElement();
                        const rowIndex = row.getPosition(true) % 2 === 0;
                        rowElement.style.backgroundColor = rowIndex ? selectedStyle.colors.alt_row : selectedStyle.colors.row;
                        rowElement.style.color = rowIndex ? selectedStyle.colors.alt_row_text : selectedStyle.colors.row_text;
                    }}
                    options={options}
                />
            )}
        </div>
    )
}

export default Tables;