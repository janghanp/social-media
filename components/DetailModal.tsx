import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";

import { Post } from "../pages/index";
import SwiperPrevButton from "./SwiperPrevButton";
import SwiperNextButton from "./SwiperNextButton";

interface Props {
  post: Post;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

dayjs.extend(relativeTime);

const DetailModal = ({ post, setIsOpen }: Props) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [customButtons, setCustomButtons] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    //Re-render to activate the custom prev and next buttons.
    if (!customButtons) {
      setCustomButtons(true);
    }

    // Change the current url associated with the post
    router.push("/", `/posts/${post.id}`, { shallow: true });

    //Put the changed url back to /
    return () => {
      router.push("/", "/", { shallow: true });
    };
  }, []);

  const cancelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await axios.post("/api/comment", {
      postId: post.id,
      comment,
    });
  };

  return (
    <>
      {/* Fade away background */}
      <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"></div>

      <div className="fixed left-1/2 top-1/2 z-40 h-auto w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-primary bg-white p-3 shadow-lg">
        {/* X button */}
        <div className="mb-2 flex w-full items-center justify-end">
          <button
            onClick={cancelHandler}
            className={`btn btn-outline btn-circle btn-sm border-2`}
          >
            ✕
          </button>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-5 gap-x-2">
          {/* Images */}
          <Swiper
            className="relative z-10 col-span-5 flex h-full w-full items-center justify-center md:col-span-3"
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
          {/* Input field */}
          <div className="col-span-5 mt-3 block border-t md:hidden">
            <form className="w-full">
              <div className="flex items-center justify-center">
                <textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setComment(e.target.value);
                  }}
                  className="h-[50px] w-full resize-none border-none p-2 leading-8 outline-none"
                ></textarea>
                <button
                  className={`font-semibold text-primary disabled:cursor-not-allowed disabled:text-gray-500`}
                  disabled={comment.length === 0}
                  onClick={submitHandler}
                >
                  post
                </button>
              </div>
            </form>
          </div>
          <div className="relative col-span-2 hidden md:block">
            {/* User info */}
            <div className="flex items-center space-x-3 border-b p-3">
              <div className="avatar overflow-hidden rounded-full">
                <Image src={post.user.image} width={40} height={40} />
              </div>
              <span className="text-sm text-gray-500">
                {post.user.name} &nbsp;• &nbsp;{" "}
                {dayjs().to(dayjs(post.createdAt))}
              </span>
            </div>

            {/* Comments */}
            <div className="flex flex-col items-start justify-center p-3 gap-y-5">
              <div className="flex flex-row items-center justify-center gap-x-2">
                <div className="avatar overflow-hidden rounded-full">
                  <Image src={post.user.image} width={40} height={40} />
                </div>
                <div className="flex flex-col">
                  <div>
                    <span className="mr-3 text-sm font-bold">
                      {post.user.name}
                    </span>
                    <span className="text-sm">{post.body}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {dayjs().to(dayjs(post.createdAt))}
                  </span>
                </div>
              </div>

              {post.comments.map((comment) => (
                <div
                  key={+comment.id}
                  className="flex flex-row items-center justify-center gap-x-2"
                >
                  <div className="avatar overflow-hidden rounded-full">
                    <Image src={comment.user.image} width={40} height={40} />
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <span className="mr-3 text-sm font-bold">
                        {comment.user.name}
                      </span>
                      <span className="text-sm">{comment.comment}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {dayjs().to(dayjs(comment.createdAt))}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input field */}
            <div className="absolute bottom-0 w-full border-t">
              <form className="w-full">
                <div className="flex items-center justify-center">
                  <textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setComment(e.target.value);
                    }}
                    className="h-[50px] w-full resize-none border-none p-2 leading-8 outline-none"
                  ></textarea>
                  <button
                    className={`font-semibold text-primary disabled:cursor-not-allowed disabled:text-gray-500`}
                    disabled={comment.length === 0}
                    onClick={submitHandler}
                  >
                    post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailModal;
