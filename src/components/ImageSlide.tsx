import { useState, useMemo } from 'react';
import { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

import SwiperPrevButton from './SwiperPrevButton';
import SwiperNextButton from './SwiperNextButton';
import { calculateRatio } from '../lib/calculateRatio';
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
      const { width, height, px, py } = calculateRatio(file.ratio);

      return (
        <SwiperSlide className="h-full" key={index}>
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
