import { Table,
    TableBody,
    TableCell,
    TableCheckboxCell,
    TableHead,
    TableHeadCell,
    TableRow } from '@swc-react/table';
import React from 'react';
import './App.css'

type ITableProps = {
    columns: number,
    rows: number,
    columnValues: { [key: string]: string }
}

const Tables: React.FC<ITableProps> = ({ columns, columnValues, rows }) => {
    return (
        <div className='table-container '>
            <Table
                id="table-virtualized-demo"
                style={{ height: "300px" }}
                scroller={true}
            >
                <TableHead>
                    {Array.from({ length: columns }).map((_, index) => (
                        <TableCell key={`Column ${index + 1}`}>{columnValues[`Column ${index + 1}`] || `Column ${index + 1}`}</TableCell>
                    ))}
                </TableHead>
                {rows > 0 && <TableBody
                    style={{ width: '98%' }}
                >
                    {Array.from({ length: rows }).map((_, index) => (
                        <TableRow key={index}>
                            {Array.from({ length: columns }).map((_, index) => (
                                <TableCell key={`cell${index}`}>Rows {index + 1}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>}
            </Table>
        </div>
    )
}

export default Tables;