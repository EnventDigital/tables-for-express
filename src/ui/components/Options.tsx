import React, { useState } from 'react';
import { Picker, PickerType } from '@swc-react/picker';
import { FieldLabel, FieldLabelType } from '@swc-react/field-label';
import {
    MenuItem
} from '@swc-react/menu';
import './App.css'
import { winFontsC } from '../utils/font';

type IOptions={
    setFontFamily:React.Dispatch<React.SetStateAction<string>>,
    setFontType:React.Dispatch<React.SetStateAction<string>>,
    setTextAlignment:React.Dispatch<React.SetStateAction<string>>
}

const Options: React.FC<IOptions> = ({setFontFamily, setFontType, setTextAlignment}) => {
    const position = [
        { key: 'left', value: 'left' },
        { key: 'right', value: 'right' },
        { key: 'center', value: 'center' },
    ];
    
    const handleFontChange = (event: any) => {
        const { id, value } = event.target;
        if (id === 'font-family') {
            setFontFamily(value);
        } else if (id === 'font-type') {
            setFontType(value);
        } else if (id === 'text-alignment') {
            setTextAlignment(value);
        }
    };

    return (
        <div className='option'>
            {/* <div className='rows_col'>
                <div className='row'>
                    <FieldLabel for='font-family' size="m">Font family</FieldLabel>
                    <Picker
                        key='font-family'
                        style={{ width: "100%", display: 'block' }}
                        id='font-family' size="m" label="Selection type" placeholder='Font family'
                        change={(e) => handleFontChange(e)}
                    >
                        {winFontsC.map((font, fontIndex) => (
                            <MenuItem key={fontIndex} value={font}>{font}</MenuItem>
                        ))}

                    </Picker>
                </div>
                <div className='row'>
                    <FieldLabel for='font-type' size="m">Font Type</FieldLabel>
                    <Picker
                        key='font-type'
                        style={{ width: "100%", display: 'block' }}
                        id='font-type' size="m" label="Selection type" placeholder='Font type'
                        change={(e) => handleFontChange(e)}
                    >
                        <MenuItem key={'normal'} value='normal'>Normal</MenuItem>
                        <MenuItem key={'bold'} value='bold'>Bold</MenuItem>
                        <MenuItem key={'italic'} value='italic'>Italics</MenuItem>
                    </Picker>
                </div>
            </div> */}
            <FieldLabel for='text-alignment' size="m"  style={{marginTop: '1rem' }}>Text alignment in each cell: </FieldLabel>
            <Picker
                key='text-alignment'
                style={{ width: "100%", marginBottom: '1rem' }}
                id='text-alignment' size="m" label="Selection type" placeholder='Text alignment'
                change={(e) => handleFontChange(e)}
            >
                {position.map((item, itemIndex) => (
                    <MenuItem key={item.key} value={item.value}>{item.value}</MenuItem>
                ))}
            </Picker>
        </div>
    );
}

export default Options;