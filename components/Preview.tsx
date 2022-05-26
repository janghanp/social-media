import { memo, useRef, useState, useEffect } from "react";
import { CustomFile } from "./DropZone";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
  MdClose,
} from "react-icons/md";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Preview = ({
  files,
  setFiles,
}: {
  files: CustomFile[];
  setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>;
}) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    //To active next and prev custom buttons
    setCurrentIndex(0);
  }, []);

  const deleteHandler = () => {
    URL.revokeObjectURL(files[currentIndex!].preview);

    setFiles((prevState) => {
      const updatedFiles = prevState.filter(
        (_, index) => index !== currentIndex
      );

      return [...updatedFiles];
    });
  };

  return (
    <div className="relative z-10 w-full h-full mt-5 rounded-lg overflow-hidden border border-primary">
      <div
        className="btn btn-circle btn-ghost btn-sm absolute z-10 right-3 top-3 bg-black/50 hover:bg-black/30"
        onClick={deleteHandler}
      >
        <MdClose className="w-4 h-4 text-white" />
      </div>
      <Swiper
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
        {files.map((file, index) => {
          const fileContent = (
            <>
              {file.type.includes("video") ? (
                <>
                  <video className="w-full h-80 object-cover">
                    <source src={file.preview} type={file.type} />
                  </video>
                </>
              ) : (
                <>
                  <img
                    className="w-full h-80 object-cover"
                    src={file.preview}
                    alt={file.name}
                  />
                </>
              )}
            </>
          );

          return (
            <SwiperSlide key={file.name + index}>{fileContent}</SwiperSlide>
          );
        })}
        {/* custom prev and next buttons */}
        <div
          ref={prevRef}
          className={`btn btn-circle btn-sm btn-ghost absolute top-32 left-3 z-10 text-white bg-black/50 hover:bg-black/30 ${
            (currentIndex === 0 || !prevRef.current) && "hidden"
          }`}
        >
          <MdOutlineArrowBackIosNew />
        </div>
        <div
          ref={nextRef}
          className={`btn btn-circle btn-sm btn-ghost absolute top-32 right-3 z-10 text-white bg-black/50 hover:bg-black/30 ${
            currentIndex === files.length - 1 && "hidden"
          }`}
        >
          <MdOutlineArrowForwardIos />
        </div>
      </Swiper>
    </div>
  );
};

export default memo(Preview);
