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
  const swiperRef = useRef<any>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [customButtons, setCustomButtons] = useState<boolean>(false);

  useEffect(() => {
    //Re-render to activate the custom prev and next buttons.
    if (!customButtons) {
      setCustomButtons(true);
    }
  }, []);

  return (
    <div className="w-full bg-base-100 shadow-xl border border-primary rounded-md overflow-hidden p-5 relative">
      <Swiper
        className="flex justify-center items-center relative z-10 w-full h-full"
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
        onInit={(swiper) => {
          swiperRef.current = swiper;
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
        <div>
          <SwiperPrevButton prevRef={prevRef} currentIndex={currentIndex} />
          <SwiperNextButton
            nextRef={nextRef}
            currentIndex={currentIndex}
            fileLength={post.files ? post.files.length : 0}
          />
        </div>
      </Swiper>
      <div>{post.body}</div>
    </div>
  );
};

export default PostItem;
