import { useState, useEffect, useRef } from "react";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Post } from "../pages/index";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperPrevButton from "./SwiperPrevButton";
import SwiperNextButton from "./SwiperNextButton";

dayjs.extend(relativeTime);

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
    <div className="bg-base-100 shadow-xl border border-primary rounded-md overflow-hidden relative w-full max-w-[470px]">
      {/* User info */}
      <div className="flex items-center space-x-3 p-3">
        <div className="avatar">
          <Image src={post.user.image} width={40} height={40} />
        </div>
        <span className="text-gray-500 text-sm">
          {post.user.name} &nbsp;• &nbsp; {dayjs().to(dayjs(post.createdAt))}
        </span>
      </div>
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
            <Image src={file} width={470} height={700} alt="image" />
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
      {/* Post body */}
      <div className="p-3">
        <span className="text-primary text-sm font-semibold mr-3">
          {post.user.name}
        </span>
        <span>{post.body}</span>
      </div>
    </div>
  );
};

export default PostItem;
