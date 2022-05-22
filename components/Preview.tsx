import { memo } from "react";
import { CustomFile } from "./DropZone";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Preview = ({ files }: { files: CustomFile[] }) => {
  return (
    <div className="relative z-10 w-full h-full">
      <Swiper
        modules={[Pagination, Navigation]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
      >
        {files.map((file, index) => {
          const fileContent = (
            <>
              {file.type.includes("video") ? (
                <>
                  <video className="w-full h-80 object-contain">
                    <source src={file.preview} type={file.type} />
                  </video>
                </>
              ) : (
                <>
                  <img
                    className="w-full h-80 object-contain"
                    src={file.preview}
                    alt={file.name}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                  />
                </>
              )}
            </>
          );

          return (
            <SwiperSlide key={file.name + index}>{fileContent}</SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default memo(Preview);
