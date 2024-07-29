import React,{useEffect, useState} from 'react';
import './App.css'
import 'react-tabulator/lib/styles.css';
import "tabulator-tables/dist/css/tabulator.min.css";
import { ReactTabulator, ColumnDefinition } from 'react-tabulator'
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
    textAlignment: "left" | "center" | "right"
    selectedStyle: ITableStyle
}

const Tables: React.FC<ITableProps> = ({selectedStyle, rowData, isImport, csvData, fontFamily, fontType, textAlignment, columns, columnValues, rows }) => {
    const columnDefinitions: ColumnDefinition[] = Array.from({ length: columns }).map((_, index) => ({
        title: columnValues[`Column ${index + 1}`] || `Column ${index + 1}`,
        field: `field${index + 1}`,
        width: 150,
        hozAlign: textAlignment,
        headerHozAlign: textAlignment,
        
        cellStyled: (cell) => ({
            fontFamily: fontFamily,
            fontWeight: fontType,
            fontStyle: fontType,
        }),
    }));

    const rowDatas = Array.from({ length: rows }).map((_, rowIndex) => {
        const row = {};
        Array.from({ length: columns }).forEach((_, colIndex) => {
            row[`field${colIndex + 1}`] = `Row ${rowIndex + 1} Col ${colIndex + 1}`;
        });
        return row;
    });
    return (
        <div className='table-container ' id="example-table">
           {(columnDefinitions.length > 0 || csvData.length > 0) && (
                <ReactTabulator
                    data={isImport ? rowDatas : rowData}
                    columns={isImport ? columnDefinitions : csvData.map((col: any) => ({
                        ...col,
                        hozAlign: textAlignment,
                        headerHozAlign: textAlignment
                    }))}
                    layout="fitData"
                    rowFormatter={(row) => {
                        const rowElement = row.getElement();
                        console.log(rowElement);
                        const rowIndex = row.getPosition(true) % 2 === 0;
                        console.log(rowIndex);
                        rowElement.style.backgroundColor = rowIndex ? selectedStyle.colors.alt_row : selectedStyle.colors.row;
                        rowElement.style.color = rowIndex ? selectedStyle.colors.alt_row_text : selectedStyle.colors.row_text;
                    }}
                    options={{
                        headerBackground: selectedStyle.colors.header,
                        headerTextColor: selectedStyle.colors.header_text,
                        border: `1px solid ${selectedStyle.colors.stroke}`,
                    }}
                />
            )}
        </div>
    )
}

export default Tables;