import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineEllipsis,
} from "react-icons/ai";

import { Post } from "../pages/index";
import DetailModal from "./DetailModal";
import ControlMenu from "./ControlMenu";
import PostModal from "./PostModal";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperPrevButton from "./SwiperPrevButton";
import SwiperNextButton from "./SwiperNextButton";
import { Comment } from "../pages/index";

dayjs.extend(relativeTime);

const PostItem = ({ post }: { post: Post }) => {
  const router = useRouter();

  const { data: session } = useSession();

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [customButtons, setCustomButtons] = useState<boolean>(false);
  const [toggleDetailModal, setToggleDetailModal] = useState<boolean>(false);
  const [toggleControlMenu, setToggleControlMenu] = useState<boolean>(false);
  const [togglePostModal, setTogglePostModal] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [totalCommentsCount, setTotalCommentsCount] = useState<number>(
    post._count.comments
  );
  const [isLiked, setIsLiked] = useState<boolean>(
    session ? post.likedByIds.includes(session!.user.id) : false
  );
  const [totalLikesCount, setTotlaLikesCount] = useState<number>(
    post._count.likedBy
  );

  useEffect(() => {
    if (!customButtons) {
      setCustomButtons(true);
    }
  }, []);

  useEffect(() => {
    if (toggleDetailModal || toggleControlMenu) {
      document.body.style.overflowY = "hidden";
      document.body.style.height = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
  }, [toggleDetailModal, toggleControlMenu]);

  const deleteHandler = async () => {
    await axios.delete("/api/post", {
      data: {
        postId: post.id,
      },
    });

    router.reload();
  };

  const editHandler = async () => {
    setToggleControlMenu(false);
    setTogglePostModal(true);
  };

  const likeHandler = async () => {
    if (!session) {
      router.push("/login");

      return;
    }

    setIsLiked((prevState) => !prevState);
    setTotlaLikesCount((prevState) => {
      if (isLiked) {
        return prevState - 1;
      }

      return prevState + 1;
    });

    await axios.post("/api/like", {
      userId: session!.user.id,
      postId: post.id,
      dislike: isLiked,
    });
  };

  return (
    <>
      <div className="relative box-content h-auto w-full max-w-[470px] rounded-md border border-primary bg-white shadow-xl">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center justify-center gap-x-3">
            <div className="avatar overflow-hidden rounded-full">
              <Image src={post.user.image} width={40} height={40} />
            </div>
            <span className="text-sm lowercase text-gray-500">
              {post.user.username} &nbsp;• &nbsp;{" "}
              {dayjs().to(dayjs(post.createdAt))}
            </span>
          </div>
          {session?.user.id === post.userId && (
            <div
              className="rounded-full p-1 transition duration-300 hover:cursor-pointer hover:bg-gray-200/50"
              onClick={() => setToggleControlMenu(true)}
            >
              <AiOutlineEllipsis className="h-6 w-6" />
            </div>
          )}
        </div>
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
                    src={`${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/posts/${file.Key}`}
                    width={width}
                    height={height}
                    layout="responsive"
                    objectFit="cover"
                    alt="image"
                    priority={true}
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
          <div className="flex items-center justify-start space-x-1">
            <div
              onClick={likeHandler}
              className="flex items-center justify-center space-x-2 rounded-lg px-2 py-1 transition duration-200 hover:cursor-pointer hover:bg-gray-300/50"
            >
              <AiOutlineHeart
                className={`h-6 w-6 ${isLiked ? "fill-red-500" : ""}`}
              />
              <span>{totalLikesCount}</span>
            </div>
            <div
              onClick={() => setToggleDetailModal(true)}
              className="flex items-center justify-center space-x-2 rounded-lg px-2 py-1 transition duration-200 hover:cursor-pointer hover:bg-gray-300/50"
            >
              <AiOutlineMessage className="h-6 w-6" />
              <span>{totalCommentsCount}</span>
            </div>
          </div>
          <div className="mt-5">
            <span className="mr-3 text-sm font-bold text-primary">
              {post.user.username}
            </span>
            <span>{post.body}</span>
          </div>
          {comments.length >= 2 ? (
            <>
              <div className="mt-5">
                <ul>
                  {comments.slice(0, 2).map((comment) => (
                    <li key={comment.id} className="mt-2">
                      <div>
                        <span className="mr-3 text-sm font-bold text-primary">
                          {comment.user.username}
                        </span>
                        <span className="break-all">{comment.comment}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                onClick={() => setToggleDetailModal(true)}
                className="mt-4 text-sm text-gray-400 hover:cursor-pointer"
              >
                View {totalCommentsCount === 1 ? "" : "all"}{" "}
                {totalCommentsCount}{" "}
                {totalCommentsCount === 1 ? "comment" : "comments"}
              </div>
            </>
          ) : (
            <div className="mt-5">
              <ul>
                {comments.map((comment) => (
                  <li key={comment.id} className="mt-2">
                    <div>
                      <span className="mr-3 text-sm font-bold text-primary">
                        {comment.user.name}
                      </span>
                      <span>{comment.comment}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {toggleDetailModal && (
        <DetailModal
          post={post}
          comments={comments}
          totalCommentsCount={totalCommentsCount}
          setToggleDetailModal={setToggleDetailModal}
          setComments={setComments}
          setTotalCommentsCount={setTotalCommentsCount}
        />
      )}

      {toggleControlMenu && (
        <ControlMenu
          setToggleControlMenu={setToggleControlMenu}
          deleteHandler={deleteHandler}
          editHandler={editHandler}
          type="post"
          isOwner={session?.user.id === post.userId}
        />
      )}

      {togglePostModal && (
        <PostModal
          setIsOpen={setTogglePostModal}
          initialBody={post.body}
          initialFiles={post.files}
          postId={post.id}
        />
      )}
    </>
  );
};

export default PostItem;
