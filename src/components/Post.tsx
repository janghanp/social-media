import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiOutlineEllipsis } from "react-icons/ai";

import { Post as PostType } from "../types";
import PreviewComments from "./PreviewComments";
import PostDetailModal from "./PostDetailModal";
import ControlMenu from "./ControlMenu";
import PostModal from "./PostModal";
import Reaction from "./Reaction";
import { PostProvider } from "../context/postContext";
import { preventScroll } from "../lib/preventScroll";
import ImageSlide from "./ImageSlide";

dayjs.extend(relativeTime);

interface Props {
  post: PostType;
}

const Post = ({ post }: Props) => {
  const router = useRouter();

  const { data: session, status } = useSession();

  const parentCommentsCountRef = useRef<number>(post.parentCommentsCount);

  const [togglePostDetailModal, setTogglePostDetailModal] =
    useState<boolean>(false);
  const [toggleControlMenu, setToggleControlMenu] = useState<boolean>(false);
  const [togglePostModal, setTogglePostModal] = useState<boolean>(false);

  useEffect(() => {
    preventScroll(togglePostDetailModal, toggleControlMenu);
  }, [togglePostDetailModal, toggleControlMenu]);

  const deletePostHandler = async () => {
    await axios.delete("/api/post", {
      data: {
        postId: post.id,
      },
    });

    router.reload();
  };

  const editPostHandler = async () => {
    setToggleControlMenu(false);
    setTogglePostModal(true);
  };

  const togglePostDetailHandler = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setTogglePostDetailModal(true);
    window.history.pushState("state", "title", `/posts/${post.id}`);
  };

  return (
    <PostProvider
      initialPreviewComments={post.comments}
      initialTotalCommentsCount={post._count.comments}
      initialIsLiked={
        session ? post.likedByIds.includes(session!.user.id) : false
      }
      initialLikesCount={post._count.likedBy}
      postId={post.id}
    >
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
        <ImageSlide files={post.files} />
        <div className="p-3">
          <Reaction togglePostDetailHandler={togglePostDetailHandler} />
          <div className="mt-5">
            <span className="mr-3 text-sm font-bold text-primary">
              {post.user.username}
            </span>
            <span>{post.body}</span>
          </div>
          <PreviewComments togglePostDetailHandler={togglePostDetailHandler} />
        </div>
      </div>

      <PostDetailModal
        isOpen={togglePostDetailModal}
        parentCommentsCountRef={parentCommentsCountRef}
        post={post}
        setTogglePostDetail={setTogglePostDetailModal}
      />
      <ControlMenu
        type="post"
        isOpen={toggleControlMenu}
        isOwner={session?.user.id === post.userId}
        setToggleControlMenu={setToggleControlMenu}
        deleteHandler={deletePostHandler}
        editHandler={editPostHandler}
      />
      <PostModal
        isOepn={togglePostModal}
        postId={post.id}
        initialBody={post.body}
        initialFiles={post.files}
        setIsOpen={setTogglePostModal}
      />
    </PostProvider>
  );
};

export default Post;
