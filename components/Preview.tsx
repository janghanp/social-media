import { useRef, useState } from "react";
import { CustomFile } from "./DropZone";
import { Pagination, Navigation, EffectFade } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import PreviewImageItem from "./PreviewImageItem";
import SwiperPrevButton from "./SwiperPrevButton";
import SwiperNextButton from "./SwiperNextButton";

type Props = {
  files: CustomFile[];
  setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>;
};

const Preview = ({ files, setFiles }: Props) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <Swiper
      className="z-10 mx-0 mt-5 flex h-[546px] w-full items-center justify-center overflow-hidden rounded-lg border border-primary sm:w-[546px]"
      effect="fade"
      allowTouchMove={false}
      modules={[Pagination, Navigation, EffectFade]}
      slidesPerView={1}
      navigation={{
        prevEl: prevRef.current!,
        nextEl: nextRef.current!,
      }}
      pagination={{ clickable: true }}
      onSlideChange={(slide) => {
        setCurrentIndex(slide.activeIndex);
      }}
    >
      {files.map((file, index) => (
        <SwiperSlide className="bg-white" key={index}>
          <PreviewImageItem file={file} setFiles={setFiles} />
        </SwiperSlide>
      ))}
      {/* custom prev and next buttons */}
      <SwiperPrevButton prevRef={prevRef} currentIndex={currentIndex} />
      <SwiperNextButton
        nextRef={nextRef}
        currentIndex={currentIndex}
        fileLength={files.length}
      />
    </Swiper>
  );
};

export default Preview;
