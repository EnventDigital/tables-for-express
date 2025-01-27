import React, { useState } from 'react';
import { tableStyles } from '../utils/font';
import { ITableStyle } from '../utils/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Scrollbar, Thumbs } from 'swiper/modules';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';



type IDesignProps = {
    setStyle: React.Dispatch<React.SetStateAction<ITableStyle>>
}
const Design: React.FC<IDesignProps> = ({ setStyle }) => {
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

    const handleImageClick = (id: number, style: ITableStyle) => {
        setSelectedImageId(id);
        setStyle(style)
    };
    return (
        <div style={{ width: '100%', display: 'block', marginTop: '1rem'}} >
            <Swiper
                modules={[FreeMode, Navigation, Thumbs, Scrollbar]}
                slidesPerView={3}
                navigation={true}
                allowTouchMove={true}
                scrollbar={{ draggable: true }}
            >
                {tableStyles.map(style => (
                    <SwiperSlide>
                        <div key={style.id} style={{ display: 'inline-block', padding: '5px 0px', textAlign: 'center' }}>
                            <img
                                onClick={() => handleImageClick(style.id, style)}
                                src={`images/${style.image}`}
                                alt={style.name}
                                style={{
                                    width:  '75px',
                                    height: 'auto',
                                    cursor: 'pointer',
                                    border: selectedImageId === style.id ? `2px solid ${style.border}` : 'none'
                                }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Design;