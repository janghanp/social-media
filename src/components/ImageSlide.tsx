import { useState, useMemo } from 'react';
import { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

import SwiperPrevButton from './SwiperPrevButton';
import SwiperNextButton from './SwiperNextButton';
import { FileInfo } from '../types';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Props {
  files?: FileInfo[];
}

const ImageSlide = ({ files }: Props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const swiperSlide = useMemo(() => {
    return files?.map((file, index) => {
      let width, height, px, py;

      if (file.ratio === 1) {
        width = 470;
        height = 470;
        px = 'px-0';
        py = 'py-0';
      } else if (file.ratio > 1) {
        width = 470;
        height = 265;
        px = 'px-0';
        py = 'py-[21.9%]';
      } else if (file.ratio < 1) {
        width = 376;
        height = 470;
        px = 'px-[10%]';
        py = 'py-0';
      } else {
        width = 470;
        height = 470;
        px = 'px-0';
        py = 'py-0';
      }

      return (
        <SwiperSlide key={index}>
          <div className={`h-auto w-auto ${px} ${py} bg-white`}>
            <Image
              layout="responsive"
              objectFit="cover"
              width={width}
              height={height}
              src={`${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/posts/${file.Key}`}
              alt="image"
            />
          </div>
        </SwiperSlide>
      );
    });
  }, [files]);

  return (
    <Swiper
      modules={[Pagination, Navigation]}
      slidesPerView={1}
      pagination={{ clickable: true }}
      onSlideChange={({ activeIndex }) => {
        setCurrentIndex(activeIndex);
      }}
    >
      {swiperSlide}
      <div>
        <SwiperPrevButton currentIndex={currentIndex} />
        <SwiperNextButton currentIndex={currentIndex} fileLength={files!.length} />
      </div>
    </Swiper>
  );
};

export default ImageSlide;
