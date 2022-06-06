import { useState, useEffect, useRef } from "react";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";

import { Post } from "../pages/index";
import DetailModal from "./DetailModal";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperPrevButton from "./SwiperPrevButton";
import SwiperNextButton from "./SwiperNextButton";

dayjs.extend(relativeTime);

const PostItem = ({ post }: { post: Post }) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [customButtons, setCustomButtons] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    //Re-render to activate the custom prev and next buttons.
    if (!customButtons) {
      setCustomButtons(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
      document.body.style.height = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
  }, [isOpen]);

  const trimName = (name: string) => {
    return name.split(" ")[0];
  };

  return (
    <>
      <div className="bg-base-100 shadow-xl border border-primary rounded-md overflow-hidden relative w-full max-w-[470px]">
        {/* User info */}
        <div className="flex items-center space-x-3 p-3">
          <div className="avatar rounded-full overflow-hidden">
            <Image src={post.user.image} width={40} height={40} />
          </div>
          <span className="text-gray-500 text-sm lowercase">
            {trimName(post.user.name!)} &nbsp;• &nbsp;{" "}
            {dayjs().to(dayjs(post.createdAt))}
          </span>
        </div>
        <Swiper
          className="flex justify-center items-center relative z-10 w-full h-auto"
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
          {post.files?.map((file, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-auto xs:w-[470px] h-[470px]">
                <Image
                  src={file}
                  layout="fill"
                  objectFit="cover"
                  alt="image"
                />
              </div>
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
        <div className="p-3">
          {/* Reactions */}
          <div className="flex justify-start items-center space-x-1">
            <div className="flex justify-center items-center space-x-2 hover:bg-gray-300/50 hover:cursor-pointer rounded-lg px-2 py-1 transition duration-200">
              <AiOutlineHeart className="w-6 h-6" />
              <span>100</span>
            </div>
            <div
              onClick={() => setIsOpen(true)}
              className="flex justify-center items-center space-x-2 hover:bg-gray-300/50 hover:cursor-pointer rounded-lg px-2 py-1 transition duration-200"
            >
              <AiOutlineMessage className="w-6 h-6" />
              <span>50</span>
            </div>
          </div>
          {/* Post body */}
          <div className="mt-5">
            <span className="text-primary text-sm font-bold mr-3">
              {post.user.name}
            </span>
            <span>{post.body}</span>
          </div>
        </div>
      </div>
      {/* Detail Modal */}
      {isOpen && <DetailModal post={post} setIsOpen={setIsOpen} />}
    </>
  );
};

export default PostItem;
