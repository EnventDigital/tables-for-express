import React from 'react';
import { tableStyles } from '../utils/font';


const Design: React.FC = () => {
    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {tableStyles.map(style => (
                    <div key={style.id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', width: '200px', textAlign: 'center' }}>
                        <h3>{style.name}</h3>
                        <img   src={`../../images/${style.image}`}  alt={style.name} style={{ width: '100%', height: 'auto' }} />
                        <button style={{ marginTop: '10px' }}>
                            {style.isActive ? 'Active' : 'Select'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Design;