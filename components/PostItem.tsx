import { useState, useEffect, useRef } from "react";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import { Post } from "../pages/index";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperPrevButton from "./SwiperPrevButton";
import SwiperNextButton from "./SwiperNextButton";

const PostItem = ({ post }: { post: Post }) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    setCurrentIndex(0);
  });

  console.log(nextRef);

  return (
    <div className="w-full bg-base-100 shadow-xl border border-primary rounded-md overflow-hidden p-5 relative">
      <Swiper
        modules={[Pagination, Navigation]}
        slidesPerView={1}
        navigation={
          {
            // prevEl: prevRef.current!,
            // nextEl: nextRef.current!,
          }
        }
        pagination={{ clickable: true }}
        onSlideChange={(slide) => {
          console.log(slide.activeIndex);

          setCurrentIndex(slide.activeIndex);
        }}
      >
        {post.files?.map((file, index) => (
          <SwiperSlide key={index}>
            <Image
              className="object-cover"
              src={file}
              width={640}
              height={700}
              alt="image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div>{post.body}</div>
      {/* <div className="relative z-50">
        <SwiperPrevButton prevRef={prevRef} currentIndex={currentIndex} />
        <SwiperNextButton
          nextRef={nextRef}
          currentIndex={currentIndex}
          fileLength={post.files ? post.files.length : 0}
        />
      </div> */}
    </div>
  );
};

export default PostItem;
