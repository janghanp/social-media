import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai";
import SyncLoader from "react-spinners/SyncLoader";
import { useSession } from "next-auth/react";

import { Post, Comment as CommentType } from "../types";
import SwiperPrevButton from "./SwiperPrevButton";
import SwiperNextButton from "./SwiperNextButton";
import Comment from "./Comment";
import CommentInputBox from "./CommentInputBox";

const thresholds = [
  { l: "s", r: 1 },
  { l: "m", r: 1 },
  { l: "mm", r: 59, d: "minute" },
  { l: "h", r: 1 },
  { l: "hh", r: 23, d: "hour" },
  { l: "d", r: 1 },
  { l: "dd", r: 29, d: "day" },
  { l: "M", r: 1 },
  { l: "MM", r: 11, d: "month" },
  { l: "y" },
  { l: "yy", d: "year" },
];

const config = {
  thresholds,
};

dayjs.extend(relativeTime, config);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

interface Props {
  post: Post;
  setToggleDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentComments: CommentType[];
  setCurrentComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
  setTotalCommentsCount: React.Dispatch<React.SetStateAction<number>>;
  parentCommentsCountRef: React.MutableRefObject<number>;
}

const DetailModal = ({
  post,
  currentComments,
  setToggleDetailModal,
  setCurrentComments,
  setTotalCommentsCount,
  parentCommentsCountRef,
}: Props) => {
  const { data: session } = useSession();

  const router = useRouter();

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [customButtons, setCustomButtons] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isReply, setIsReply] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<string | undefined>(
    ""
  );
  const [replyingCommentId, setReplyingCommentId] = useState<
    string | undefined
  >("");

  useEffect(() => {
    if (!customButtons) {
      setCustomButtons(true);
    }

    router.push("/", `/posts/${post.id}`, { shallow: true });

    return () => {
      router.push("/", "/", { shallow: true });
    };
  }, []);

  useEffect(() => {
    if (parentCommentsCountRef.current === 0) {
      parentCommentsCountRef.current = post.parentCommentsCount;
    }
  }, []);

  const cancelHandler = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    e.preventDefault();
    setToggleDetailModal(false);
  };

  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isReply) {
      const commentInputChunks = commentInput.split(" ");

      const mentionUser = commentInputChunks.shift()?.replace("@", "");
      const comment = commentInputChunks.join(" ");

      const {
        data: { newCommentWithUser: newReply },
      } = await axios.post("/api/reply", {
        userId: session?.user.id,
        comment,
        postId: post.id,
        parentId: replyingCommentId,
        mentionUser,
      });

      setCommentInput("");
      setTotalCommentsCount((prevState) => prevState + 1);
      setCurrentComments((prevState) => {
        const newCurrentComments = prevState.map((currentComment) => {
          if (currentComment.id === replyingCommentId) {
            currentComment._count.children++;

            currentComment.newChildren = newReply;

            return { ...currentComment };
          } else {
            return currentComment;
          }
        });

        return newCurrentComments;
      });

      return;
    }

    if (isEdit) {
      await axios.put("/api/comment", {
        commentId: editingCommentId,
        comment: commentInput,
      });

      setCommentInput("");
      setIsEdit(false);
      setCurrentComments((prevState) => {
        const updatedComments = prevState.map((currentComment) => {
          if (currentComment.id === editingCommentId) {
            currentComment.comment = commentInput;
            return { ...currentComment };
          } else {
            return currentComment;
          }
        });

        return updatedComments;
      });

      return;
    }

    const {
      data: { commentWithUser: newComment },
    } = await axios.post("/api/comment", {
      postId: post.id,
      comment: commentInput,
    });

    setCommentInput("");
    setCurrentComments((prevState) => [newComment, ...prevState]);
    parentCommentsCountRef.current++;
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
    setCurrentComments((prevState) => [...prevState, ...comments]);
    setIsLoading(false);
  };

  const deleteComment = async (commentId: string) => {
    let deleteChildrenCount: number;

    currentComments.forEach((currentComment) => {
      if (currentComment.id == commentId) {
        deleteChildrenCount = currentComment._count.children;
      }
    });

    setCurrentComments((prevState) =>
      prevState.filter((comment) => comment.id !== commentId)
    );
    //Assume that this is the only case when a parent comment is deleted.
    parentCommentsCountRef.current--;
    setTotalCommentsCount((prevState) => prevState - (1 + deleteChildrenCount));
  };

  return (
    <>
      <div
        onClick={cancelHandler}
        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
      ></div>

      <div className="fixed left-1/2 top-1/2 z-40 h-auto w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-primary bg-white p-3 shadow-lg md:w-11/12 lg:w-10/12 xl:w-[1150px]">
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
          {session && (
            <div className="col-span-5 mt-3 block border-t md:hidden">
              <CommentInputBox
                commentInput={commentInput}
                setCommentInput={setCommentInput}
                submitHandler={submitHandler}
                isEdit={isEdit}
                commentInputRef={commentInputRef}
                setIsReply={setIsReply}
              />
            </div>
          )}
          <div className="relative col-span-2 hidden max-h-max md:flex md:flex-col md:justify-between">
            <div className="flex items-center space-x-3 border-b p-3">
              <div className="avatar overflow-hidden rounded-full">
                <Image src={post.user.image} width={40} height={40} />
              </div>
              <span className="text-sm text-gray-500">
                {post.user.username} &nbsp;• &nbsp;{" "}
                {dayjs().to(dayjs(post.createdAt))}
              </span>
            </div>
            <div className="relative flex-1 overflow-scroll">
              <div className="absolute flex h-auto w-full flex-col items-start justify-center gap-y-5 p-3">
                <div className="mb-5 flex flex-row items-center justify-center gap-x-2">
                  <div className="avatar overflow-hidden rounded-full">
                    <Image src={post.user.image} width={40} height={40} />
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <span className="mr-3 text-sm font-bold">
                        {post.user.username}
                      </span>
                      <span className="text-sm">{post.body}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {dayjs().to(dayjs(post.createdAt))}
                    </span>
                  </div>
                </div>
                {currentComments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    postAuthorId={post.userId}
                    deleteComment={deleteComment}
                    setCommentInput={setCommentInput}
                    setIsEdit={setIsEdit}
                    setIsReply={setIsReply}
                    setEditingCommentId={setEditingCommentId}
                    commentInputRef={commentInputRef}
                    setReplyingCommentId={setReplyingCommentId}
                    setCurrentComments={setCurrentComments}
                  />
                ))}
                <div className="flex w-full items-center justify-center">
                  {parentCommentsCountRef.current > 20 &&
                    currentComments.length < parentCommentsCountRef.current && (
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
            {session && (
              <div className="bottom-0 z-30 w-full border-t bg-white">
                <CommentInputBox
                  commentInput={commentInput}
                  setCommentInput={setCommentInput}
                  submitHandler={submitHandler}
                  isEdit={isEdit}
                  commentInputRef={commentInputRef}
                  setIsReply={setIsReply}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailModal;
