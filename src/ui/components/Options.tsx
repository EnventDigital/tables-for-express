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
    textAlignment: "left" | "right" | "center"
}

const Options: React.FC<IOptions> = ({textAlignment, setFontFamily, setFontType, setTextAlignment}) => {
    /**
     * Array of position options for alignment.
     * @type {Array<{key: string, value: string}>}
     * @constant
     * @description Defines possible alignment positions: left, right, and center
     * Each object contains:
     * - key: string identifier for the position
     * - value: corresponding position value
     */
    const position = [
        { key: 'left', value: 'left' },
        { key: 'right', value: 'right' },
        { key: 'center', value: 'center' },
    ];
    
    /**
     * Handles changes to font-related options in the form.
     * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event from the select element.
     * @returns {void}
     * 
     * Updates state based on the following select inputs:
     * - font-family: Updates the font family selection
     * - font-type: Updates the font type selection
     * - text-alignment: Updates the text alignment selection
     */
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
                value= {textAlignment}
            >
                {position.map((item, itemIndex) => (
                    <MenuItem key={item.key} value={item.value}>{item.value}</MenuItem>
                ))}
            </Picker>
        </div>
    );
}

export default Options;