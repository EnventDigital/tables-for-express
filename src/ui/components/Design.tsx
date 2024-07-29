import React, { useState } from 'react';
import { tableStyles } from '../utils/font';
import { ITableStyle } from '../utils/types';


type IDesignProps = {
    setSelectedStyle:React.Dispatch<React.SetStateAction<ITableStyle>>
}
const Design: React.FC<IDesignProps> = ({setSelectedStyle}) => {
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

    const handleImageClick = (id: number, style: ITableStyle) => {
        setSelectedImageId(id);
        setSelectedStyle(style)
    };
    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent:'center', marginTop:'1rem'}}>
                {tableStyles.map(style => (
                    <div key={style.id} style={{padding: '5px 0px', width: '110px', textAlign: 'center' }}>
                        <img   onClick={() => handleImageClick(style.id, style)} src={`images/${style.image}`}  alt={style.name} style={{ width: '100%', height: 'auto',  cursor: 'pointer',   border: selectedImageId === style.id &&`2px solid ${style.border}` }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Design;