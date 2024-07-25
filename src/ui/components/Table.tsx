import React from 'react';
import './App.css'
import 'react-tabulator/lib/styles.css';
import "tabulator-tables/dist/css/tabulator.min.css";
import { ReactTabulator, ColumnDefinition } from 'react-tabulator'

type ITableProps = {
    columns?: number,
    rows?: number,
    columnValues?: { [key: string]: string }
    fontFamily: string,
    fontType: string,
    textAlignment: "left" | "center" | "right"
}

const Tables: React.FC<ITableProps> = ({ fontFamily, fontType, textAlignment, columns, columnValues, rows }) => {
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

    const rowData = Array.from({ length: rows }).map((_, rowIndex) => {
        const row = {};
        Array.from({ length: columns }).forEach((_, colIndex) => {
            row[`field${colIndex + 1}`] = `Row ${rowIndex + 1} Col ${colIndex + 1}`;
        });
        return row;
    });

    return (
        <div className='table-container '>
            <ReactTabulator
                data={rowData}
                columns={columnDefinitions}
                layout={"fitData"}
                options={{
                    cellStyled: {
                        'font-family': fontFamily,
                        'font-style': fontType,
                        'font-weight': fontType,
                    }
                }}
            />
        </div>
    )
}

export default Tables;