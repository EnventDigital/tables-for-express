// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Theme } from "@swc-react/theme";
import React, { useState } from "react";
import { DocumentSandboxApi } from "../../models/DocumentSandboxApi";
import "./App.css";

import { AddOnSDKAPI } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import AddTables from "../pages/AddTable";
import { ColumnDefinition } from "react-tabulator";
import { ITableStyle } from "../utils/types";
import { tableStyles } from "../utils/font";

const App = ({ addOnUISdk, sandboxProxy }: { addOnUISdk: AddOnSDKAPI; sandboxProxy: DocumentSandboxApi }) => {
    const [csvData, setCsvData] = useState<ColumnDefinition[]>([]);
    const [rowData, setRowData] = useState<any[]>([]);
    const [rows, setRows] = useState<number>(0);
    const [columns, setColumns] = useState<number>(0);
    const [columnValues, setColumnValues] = useState<{ [key: string]: string }>({});
    const [fontFamily, setFontFamily] = useState<string>('Arial');
    const [fontType, setFontType] = useState<string>('normal');
    const [textAlignment, setTextAlignment] = useState<"left" | "center" | "right">('left');
    const [isImport, setIsImport] = useState<boolean>(false);
    const [imported, setImported] = useState<boolean>(false);
    const [selectedStyle, setSelectedStyle] = useState<ITableStyle>(tableStyles[7]);

    return (
        // Please note that the below "<Theme>" component does not react to theme changes in Express.
        // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
        <Theme theme="express" scale="medium" color="light">
            <div className="container">
                <AddTables 
                    sandboxProxy={sandboxProxy} 
                    csvData={csvData} 
                    rowData={rowData} 
                    rows={rows} 
                    columns={columns} 
                    columnValues={columnValues} 
                    fontFamily={fontFamily} 
                    fontType={fontType} 
                    textAlignment={textAlignment} 
                    isImport={isImport} 
                    imported={imported} 
                    selectedStyle={selectedStyle} 
                    setCsvData={setCsvData} 
                    setColumnValues={setColumnValues} 
                    setColumns={setColumns} 
                    setRowData={setRowData} 
                    setRows={setRows} 
                    setImported={setImported} 
                    setIsImport={setIsImport} 
                    setStyle={setSelectedStyle} 
                    setFontFamily={setFontFamily} 
                    setTextAlignment={setTextAlignment} 
                    setFontType={setFontType} 
                />
            </div>
        </Theme>
    );
};

export default App;
