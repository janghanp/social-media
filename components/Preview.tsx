import { useRef, useState } from "react";
import { CustomFile } from "./DropZone";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
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
      className="flex justify-center items-center relative z-10 w-full h-full mt-5 rounded-lg overflow-hidden border border-primary"
      modules={[Pagination, Navigation]}
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
        <SwiperSlide key={index}>
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
