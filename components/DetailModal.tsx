import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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
  const [body, setBody] = useState<string>("");

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

  const submitHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(body);
    console.log("submit");
  };

  return (
    <>
      {/* Fade away background */}
      <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"></div>

      <div className="absolute inset-0 z-40 mx-auto flex flex-col items-center justify-center">
        <div className="fixed top-10 z-40 h-auto w-5/6 rounded-md border-2 border-primary bg-white p-7 shadow-lg sm:w-[1200px] sm:p-10">
          <button
            onClick={cancelHandler}
            className={`btn btn-outline btn-circle btn-sm absolute right-5 top-5 border-2`}
          >
            ✕
          </button>
          {/* Grid */}
          <div className="grid grid-cols-5 space-x-5">
            {/* Images */}
            <Swiper
              className="relative z-10 col-span-3 flex h-full w-full items-center justify-center"
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
              {post.files!.map((file, index) => (
                <SwiperSlide key={index}>
                  <div className="xs:w-[670px] relative h-[670px] w-auto">
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
                <SwiperPrevButton
                  prevRef={prevRef}
                  currentIndex={currentIndex}
                />
                <SwiperNextButton
                  nextRef={nextRef}
                  currentIndex={currentIndex}
                  fileLength={post.files ? post.files.length : 0}
                />
              </div>
            </Swiper>
            <div className="relative col-span-2">
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
              <div className="felx-col flex items-center justify-start p-3">
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
              </div>

              {/* Input field */}
              <div className="absolute bottom-0 w-full border-t">
                <form className="w-full">
                  <div className="flex items-center justify-center">
                    <textarea
                      placeholder="Add a comment..."
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setBody(e.target.value);
                      }}
                      className="h-[50px] w-full resize-none border-none p-2 outline-none"
                    ></textarea>
                    <button
                      className={`font-semibold text-primary disabled:cursor-not-allowed disabled:text-gray-500`}
                      disabled={body.length === 0}
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
      </div>
    </>
  );
};

export default DetailModal;
