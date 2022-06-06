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
      <div className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"></div>

      <div className="absolute inset-0 flex flex-col mx-auto justify-center items-center z-40">
        <div className="bg-white fixed top-10 z-40 w-5/6 sm:w-[1000px] h-auto p-7 sm:p-10 border-2 border-primary shadow-lg rounded-md">
          <button
            onClick={cancelHandler}
            className={`btn btn-sm btn-circle btn-outline border-2 absolute right-5 top-5`}
          >
            ✕
          </button>
          {/* Grid */}
          <div className="grid grid-cols-5">
            {/* Images */}
            <Swiper
              className="flex justify-center items-center relative z-10 w-full h-full col-span-3"
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
                  <div className="relative w-auto xs:w-[470px] h-[600px]">
                    <Image
                      src={file}
                      layout="fill"
                      objectFit="contain"
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
            <div className="col-span-2 relative">
              {/* User info */}
              <div className="flex items-center space-x-3 p-3 border-b">
                <div className="avatar rounded-full overflow-hidden">
                  <Image src={post.user.image} width={40} height={40} />
                </div>
                <span className="text-gray-500 text-sm">
                  {post.user.name} &nbsp;• &nbsp;{" "}
                  {dayjs().to(dayjs(post.createdAt))}
                </span>
              </div>

              {/* Comments */}
              <div className="flex felx-col justify-start items-center p-3">
                <div className="flex flex-row justify-center items-center gap-x-2">
                  <div className="avatar rounded-full overflow-hidden">
                    <Image src={post.user.image} width={40} height={40} />
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <span className="font-bold text-sm mr-3">
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
                  <div className="flex justify-center items-center">
                    <textarea
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setBody(e.target.value);
                      }}
                      className="outline-none border-none w-full p-2 resize-none h-[50px]"
                    ></textarea>
                    <button
                      className={`font-semibold text-primary disabled:text-gray-500 disabled:cursor-not-allowed`}
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
