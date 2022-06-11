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
      <div className="relative box-content h-auto w-full max-w-[470px] rounded-md border border-primary shadow-xl">
        {/* User info */}
        <div className="flex items-center space-x-3 p-3">
          <div className="avatar overflow-hidden rounded-full">
            <Image src={post.user.image} width={40} height={40} />
          </div>
          <span className="text-sm lowercase text-gray-500">
            {trimName(post.user.name!)} &nbsp;• &nbsp;{" "}
            {dayjs().to(dayjs(post.createdAt))}
          </span>
        </div>
        {/* Images */}
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
          {post.files?.map((file, index) => {
            let width, height, px, py;

            if (file.ratio === 1) {
              width = 470;
              height = 470;
              px = "px-0";
              py = "py-0";
            } else if (file.ratio > 1) {
              width = 470;
              height = 265;
              px = "px-0";
              py = "py-[21.9%]";
            } else if (file.ratio < 1) {
              width = 376;
              height = 470;
              px = "px-[10%]";
              py = "py-0";
            } else {
              width = 470;
              height = 470;
              px = "px-0";
              py = "py-0";
            }

            return (
              <SwiperSlide key={index}>
                <div className={`h-auto w-auto ${px} ${py}`}>
                  <Image
                    src={file.url}
                    width={width}
                    height={height}
                    layout="responsive"
                    objectFit="cover"
                    alt="image"
                  />
                </div>
              </SwiperSlide>
            );
          })}
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
          <div className="flex items-center justify-start space-x-1">
            <div className="flex items-center justify-center space-x-2 rounded-lg px-2 py-1 transition duration-200 hover:cursor-pointer hover:bg-gray-300/50">
              <AiOutlineHeart className="h-6 w-6" />
              <span>100</span>
            </div>
            <div
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center space-x-2 rounded-lg px-2 py-1 transition duration-200 hover:cursor-pointer hover:bg-gray-300/50"
            >
              <AiOutlineMessage className="h-6 w-6" />
              <span>50</span>
            </div>
          </div>
          {/* Post body */}
          <div className="mt-5">
            <span className="mr-3 text-sm font-bold text-primary">
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
