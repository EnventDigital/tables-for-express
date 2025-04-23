import React, { useState } from 'react';
import { tableStyles } from '../utils/font';
import { ITableStyle } from '../utils/types';
import './App.css';

type IDesignProps = {
    setStyle: React.Dispatch<React.SetStateAction<ITableStyle>>
}

const Design: React.FC<IDesignProps> = ({ setStyle }) => {
    const [selectedImageId, setSelectedImageId] = useState<number | null>(7); // Default to style 7 (Basic brown)

    const handleImageClick = (id: number, style: ITableStyle) => {
        setSelectedImageId(id);
        setStyle(style);
    };

    return (
        <div style={{ width: '100%', marginTop: '0.5rem', padding: '0 4px' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns
                gap: '8px', // Reduced from 12px to 8px
                justifyContent: 'center',
                maxHeight: '250px',
                overflowY: 'auto', // Allow vertical scrolling if needed
                paddingRight: '5px', // Add padding to prevent items from touching the scrollbar
                paddingBottom: '5px' // Reduced from 10px to 5px
            }}>
                {tableStyles.map(style => (
                    <div 
                        key={style.id} 
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '3px', // Reduced from 5px to 3px
                            cursor: 'pointer',
                            backgroundColor: selectedImageId === style.id ? '#f0f0f0' : 'transparent',
                            borderRadius: '4px',
                            width: '100%' // Ensure full width
                        }}
                        onClick={() => handleImageClick(style.id, style)}
                        title={style.name} // Add title attribute for tooltip on hover
                    >
                        <img
                            src={`images/${style.image}`}
                            alt={style.name}
                            style={{
                                width: '60px',
                                height: 'auto',
                                cursor: 'pointer',
                                border: selectedImageId === style.id ? `2px solid ${style.border}` : '1px solid #e0e0e0',
                                borderRadius: '4px',
                                padding: '2px'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Design;