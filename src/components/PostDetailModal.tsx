import { useEffect } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import { Post as PostType } from "../types";
import ImageSlide from "./ImageSlide";
import CommentInputBox from "./CommentInputBox";
import CommentsList from "./CommentsList";
import { CommentProvider } from "../context/commentContext";

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
  post: PostType;
  isOpen: boolean;
  parentCommentsCountRef: React.MutableRefObject<number>;
  setTogglePostDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostDetailModal = ({ post, isOpen, setTogglePostDetail }: Props) => {
  useEffect(() => {
    if (!isOpen) {
      window.history.pushState("state", "title", "/");
    }
  }, [isOpen]);

  const cancelHandler = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    e.preventDefault();
    setTogglePostDetail(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <CommentProvider>
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
          <div className="relative z-10 col-span-5 w-full md:col-span-3">
            <ImageSlide files={post.files} />
          </div>
          <div className="col-span-5 mt-3 block border-t md:hidden">
            <CommentInputBox postId={post.id} />
          </div>
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
            <div className="relative flex-1 overflow-y-auto">
              <div className="absolute flex h-auto w-full flex-col items-start justify-center gap-y-5 p-3">
                <div className="mb-5 flex w-full flex-row items-center justify-start gap-x-2">
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
                <CommentsList postId={post.id} postAuthorId={post.user.id} />
              </div>
            </div>
            <CommentInputBox postId={post.id} />
          </div>
        </div>
      </div>
    </CommentProvider>
  );
};

export default PostDetailModal;

// if (isReply) {
//   const commentInputChunks = commentInput.split(" ");

//   const mentionUser = commentInputChunks.shift()?.replace("@", "");
//   const comment = commentInputChunks.join(" ");

//   const {
//     data: { newCommentWithUser: newReply },
//   } = await axios.post("/api/reply", {
//     userId: session?.user.id,
//     comment,
//     postId: post.id,
//     parentId: replyingCommentId,
//     mentionUser,
//   });

//   setCommentInput("");
//   setTotalCommentsCount((prevState) => prevState + 1);
//   setCurrentComments((prevState) => {
//     const newCurrentComments = prevState.map((currentComment) => {
//       if (currentComment.id === replyingCommentId) {
//         currentComment._count.children++;

//         currentComment.newChildren = newReply;

//         return { ...currentComment };
//       } else {
//         return currentComment;
//       }
//     });

//     return newCurrentComments;
//   });

//   return;
// }

// if (isEdit) {
//   await axios.put("/api/comment", {
//     commentId: editingCommentId,
//     comment: commentInput,
//   });

//   setCommentInput("");
//   setIsEdit(false);
//   setCurrentComments((prevState) => {
//     const updatedComments = prevState.map((currentComment) => {
//       if (currentComment.id === editingCommentId) {
//         currentComment.comment = commentInput;
//         return { ...currentComment };
//       } else {
//         return currentComment;
//       }
//     });

//     return updatedComments;
//   });

//   return;
// }

// const fetchComments = async () => {
//   setIsLoading(true);

//   const {
//     data: { comments },
//   } = await axios.get("/api/comment", {
//     params: {
//       id: post.id,
//       currentPage: currentPage.toString(),
//     },
//   });

//   setCurrentPage((prevState) => prevState + 1);
//   setCurrentComments((prevState) => [...prevState, ...comments]);
//   setIsLoading(false);
// };

// const deleteComment = async (commentId: string) => {
//   let deleteChildrenCount: number;

//   currentComments.forEach((currentComment) => {
//     if (currentComment.id == commentId) {
//       deleteChildrenCount = currentComment._count.children;
//     }
//   });

//   setCurrentComments((prevState) =>
//     prevState.filter((comment) => comment.id !== commentId)
//   );
//   //Assume that this is the only case when a parent comment is deleted.
//   parentCommentsCountRef.current--;
//   setTotalCommentsCount((prevState) => prevState - (1 + deleteChildrenCount));
// };

// useEffect(() => {
//   if (parentCommentsCountRef.current === 0) {
//     parentCommentsCountRef.current = post.parentCommentsCount;
//   }
// }, []);
