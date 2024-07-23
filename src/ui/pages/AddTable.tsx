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


const AddTables:React.FC  = () => {
    const [rows, setRows] = useState<number>(0);
    const [columns, setColumns] = useState<number>(0);
    const [columnValues, setColumnValues] = useState<{ [key: string]: string }>({});
    return (
        <div>
            <h2>Add Table</h2>
            <Tabs compact size='m' selected='Data'>
                <Tab label="Data" value="Data"></Tab>
                <Tab label="Design" value="Design"></Tab>
                <Tab label="Options" value="Options"></Tab>
                <TabPanel value="Design"><Design/></TabPanel>
                <TabPanel value="Data"><Data columns={columns} rows={rows} setColumnValues={setColumnValues} setColumns={setColumns} setRows={setRows} /></TabPanel>
                <TabPanel value="Options"><Options/></TabPanel>
            </Tabs>
            <Tables columns={columns} columnValues={columnValues} rows={rows}/>
        </div>
    );
}
 
export default AddTables;
