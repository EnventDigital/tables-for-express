import React from 'react';
import { Picker, PickerType } from '@swc-react/picker';
import { FieldLabel, FieldLabelType } from '@swc-react/field-label';
import {
    MenuItem
} from '@swc-react/menu';
import './App.css'
import { winFontsC } from '../utils/font';
const Options: React.FC = () => {
    const position = [
        { key: 'left', value: 'Left' },
        { key: 'right', value: 'Right' },
        { key: 'center', value: 'Center' },
        { key: 'justify', value: 'Justify' }
    ];
    
    const handleFontChange = (event: any) => {

    }
    return (
        <div className='option'>
            <div className='rows_col'>
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
                        <MenuItem key={'normal'} value='Normal'>Normal</MenuItem>
                        <MenuItem key={'bold'} value='Bold'>Bold</MenuItem>
                        <MenuItem key={'italics'} value='Italics'>Italics</MenuItem>
                    </Picker>
                </div>
            </div>
            <FieldLabel for='text-alignment' size="m">Text alignment in each cell: </FieldLabel>
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