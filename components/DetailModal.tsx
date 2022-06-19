import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai";
import SyncLoader from "react-spinners/SyncLoader";

import { Post } from "../pages/index";
import SwiperPrevButton from "./SwiperPrevButton";
import SwiperNextButton from "./SwiperNextButton";

import { Comment } from "../pages/index";

interface Props {
  post: Post;
  setToggleDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  totalCommentsCount: number;
  setTotalCommentsCount: React.Dispatch<React.SetStateAction<number>>;
}

dayjs.extend(relativeTime);

const DetailModal = ({
  post,
  setToggleDetailModal,
  comments,
  setComments,
  totalCommentsCount,
  setTotalCommentsCount,
}: Props) => {
  const router = useRouter();

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [customButtons, setCustomButtons] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!customButtons) {
      setCustomButtons(true);
    }

    router.push("/", `/posts/${post.id}`, { shallow: true });

    return () => {
      router.push("/", "/", { shallow: true });
    };
  }, []);

  const cancelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setToggleDetailModal(false);
  };

  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const {
      data: { commentWithUser: newComment },
    } = await axios.post("/api/comment", {
      postId: post.id,
      comment: commentInput,
    });

    setCommentInput("");
    setComments((prevState) => [newComment, ...prevState]);
    setTotalCommentsCount((prevState) => prevState + 1);
  };

  const fetchComments = async () => {
    setIsLoading(true);

    const {
      data: { comments },
    } = await axios.get("/api/comment", {
      params: {
        id: post.id,
        currentPage: currentPage.toString(),
      },
    });

    setCurrentPage((prevState) => prevState + 1);
    setComments((prevState) => [...prevState, ...comments]);

    setIsLoading(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"></div>

      <div className="fixed left-1/2 top-1/2 z-40 h-auto w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-primary bg-white p-3 shadow-lg">
        <div className="mb-2 flex w-full items-center justify-end">
          <button
            onClick={cancelHandler}
            className={`btn btn-outline btn-circle btn-sm border-2`}
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-5 gap-x-2">
          <Swiper
            spaceBetween={50}
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
                      src={`${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/posts/${file.Key}`}
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
          <div className="col-span-5 mt-3 block border-t md:hidden">
            <form className="w-full">
              <div className="flex items-center justify-center">
                <textarea
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setCommentInput(e.target.value);
                  }}
                  className="h-[50px] w-full resize-none border-none p-2 leading-8 outline-none"
                ></textarea>
                <button
                  className={`font-semibold text-primary disabled:cursor-not-allowed disabled:text-gray-500`}
                  disabled={commentInput.length === 0}
                  onClick={submitHandler}
                >
                  post
                </button>
              </div>
            </form>
          </div>
          <div className="relative col-span-2 hidden max-h-max md:flex md:flex-col md:justify-between">
            <div className="flex items-center space-x-3 border-b p-3">
              <div className="avatar overflow-hidden rounded-full">
                <Image src={post.user.image} width={40} height={40} />
              </div>
              <span className="text-sm text-gray-500">
                {post.user.name} &nbsp;• &nbsp;{" "}
                {dayjs().to(dayjs(post.createdAt))}
              </span>
            </div>
            <div className="relative flex-1 overflow-scroll">
              <div className="absolute flex h-auto w-full flex-col items-start justify-center gap-y-5 p-3">
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
                {comments.map((comment) => (
                  <div
                    key={comment.id}
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
                <div className="flex w-full items-center justify-center">
                  {totalCommentsCount > 20 &&
                    comments.length < totalCommentsCount && (
                      <>
                        {isLoading ? (
                          <SyncLoader color="gray" size={10} margin={2} />
                        ) : (
                          <AiOutlinePlusCircle
                            className="h-7 w-7 hover:cursor-pointer"
                            onClick={fetchComments}
                          />
                        )}
                      </>
                    )}
                </div>
              </div>
            </div>
            <div className="bottom-0 z-30 w-full border-t bg-white">
              <form className="w-full">
                <div className="flex items-center justify-center">
                  <textarea
                    placeholder="Add a comment..."
                    value={commentInput}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setCommentInput(e.target.value);
                    }}
                    className="h-[50px] w-full resize-none border-none p-2 leading-8 outline-none"
                  ></textarea>
                  <button
                    className={`font-semibold text-primary disabled:cursor-not-allowed disabled:text-gray-500`}
                    disabled={commentInput.length === 0}
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
