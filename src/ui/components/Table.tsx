import React, { useEffect, useState } from 'react';
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
    textAlignment: "left" | "center" | "right",
    selectedStyle: ITableStyle,
}

const Tables: React.FC<ITableProps> = ({ selectedStyle, rowData, csvData, textAlignment, columns, rows }) => {
    const headerFormatter = (cell, formatterParams, onRendered) => {
        cell.getElement().style.backgroundColor = selectedStyle.colors.header;
        cell.getElement().style.color = selectedStyle.colors.header_text;
        console.log(cell.getValue());
        return cell.getValue();
    };

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


    return (
        <div className='table-container fixed-height' id="example-table">
            {(csvData.length > 0) && (
                <ReactTabulator
                    key={JSON.stringify({ selectedStyle, textAlignment, columns, rows })}
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
                        // headerFormatter: headerFormatter,
                    }))}
                    layout="fitData"
                    rowFormatter={(row) => {
                        const rowElement = row.getElement();
                        const rowIndex = row.getPosition(true) % 2 === 0;
                        rowElement.style.backgroundColor = rowIndex ? selectedStyle.colors.alt_row : selectedStyle.colors.row;
                        rowElement.style.color = rowIndex ? selectedStyle.colors.alt_row_text : selectedStyle.colors.row_text;
                    }}
                />
            )}
        </div>
    )
}

export default Tables;