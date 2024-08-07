import React, { useState } from 'react';
import { tableStyles } from '../utils/font';
import { ITableStyle } from '../utils/types';


type IDesignProps = {
    setSelectedStyle: React.Dispatch<React.SetStateAction<ITableStyle>>
}
const Design: React.FC<IDesignProps> = ({ setSelectedStyle }) => {
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

    const handleImageClick = (id: number, style: ITableStyle) => {
        setSelectedImageId(id);
        setSelectedStyle(style)
    };
    return (
        <div style={{ width: '100%', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1rem', width: 'max-content', whiteSpace: 'nowrap' }}>
                {tableStyles.map(style => (
                    <div key={style.id} style={{ display: 'inline-block', padding: '5px 0px', textAlign: 'center' }}>
                        <img
                            onClick={() => handleImageClick(style.id, style)}
                            src={`images/${style.image}`}
                            alt={style.name}
                            style={{
                                width: '110px',
                                height: 'auto',
                                cursor: 'pointer',
                                border: selectedImageId === style.id ? `2px solid ${style.border}` : 'none'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Design;