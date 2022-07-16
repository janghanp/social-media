import { SetStateAction, useState, useEffect, memo } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiOutlineEllipsis } from "react-icons/ai";
import { useSession } from "next-auth/react";
import axios from "axios";
import SyncLoader from "react-spinners/SyncLoader";

import { Comment as CommentType } from "../types";
import ControlMenu from "./ControlMenu";
import ChildComment from "./ChildComment";

dayjs.extend(relativeTime);

interface Props {
  comment: CommentType;
  // setCommentInput: React.Dispatch<SetStateAction<string>>;
  // setIsEdit: React.Dispatch<SetStateAction<boolean>>;
  // setIsReply: React.Dispatch<SetStateAction<boolean>>;
  // setEditingCommentId: React.Dispatch<SetStateAction<string | undefined>>;
  // commentInputRef: React.RefObject<HTMLTextAreaElement>;
  // setReplyingCommentId: React.Dispatch<SetStateAction<string | undefined>>;
  // setCurrentComments: React.Dispatch<SetStateAction<CommentType[]>>;
  // deleteComment: (commentdId: string) => {};
}

const Comment = ({
  comment,
}: // commentInputRef,
// deleteComment,
// setCommentInput,
// setIsEdit,
// setEditingCommentId,
// setIsReply,
// setReplyingCommentId,
// setCurrentComments,
Props) => {
  const { data: session } = useSession();

  const [toggleControlMenu, setToggleControlMenu] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(
    comment._count ? comment._count.likedBy : 0
  );
  const [isLiked, setIsLiked] = useState<boolean>(
    session && comment.likedByIds.includes(session.user.id) ? true : false
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toggleChildren, setToggleChildren] = useState<boolean>(false);
  const [childrenComments, setChildrenComments] = useState<CommentType[]>([]);
  const [childrenCount, setChildrenCount] = useState<number>(
    comment._count ? comment._count.children : 0
  );

  // useEffect(() => {
  //   if (childrenComments.length > 0) {
  //     setChildrenComments((prevState) => {
  //       const newChildrenComments = [...prevState, comment.newChildren!];

  //       return newChildrenComments;
  //     });
  //   }
  // }, [comment.newChildren]);

  // const deleteCommentHandler = async () => {
  //   await axios.delete("/api/comment", {
  //     data: {
  //       commentId: comment.id,
  //       postId: comment.postId,
  //     },
  //   });

  //   deleteComment(comment.id);
  // };

  // const editCommentHandler = async () => {
  //   setToggleControlMenu(false);
  //   setEditingCommentId(comment.id);
  //   setCommentInput(comment.comment);
  //   setIsEdit(true);
  // };

  // const likeCommentHandler = async () => {
  //   setIsLiked((prevState) => !prevState);
  //   setLikesCount((prevState) => {
  //     if (isLiked) {
  //       return prevState - 1;
  //     } else {
  //       return prevState + 1;
  //     }
  //   });
  //   setCurrentComments((prevState) => {
  //     return prevState.map((currentComment) => {
  //       if (currentComment.id === comment.id) {
  //         if (isLiked) {
  //           currentComment.likedByIds = currentComment.likedByIds.filter(
  //             (likeById) => likeById !== session!.user.id
  //           );
  //           return currentComment;
  //         } else {
  //           currentComment.likedByIds.push(session!.user.id);
  //           return { ...currentComment };
  //         }
  //       } else {
  //         return currentComment;
  //       }
  //     });
  //   });

  //   await axios.post("/api/likeComment", {
  //     commentId: comment.id,
  //     userId: session!.user.id,
  //     dislike: isLiked,
  //   });
  // };

  // const replyHandler = async (metionUser: string, commentId: string) => {
  //   setCommentInput(`@${metionUser} `);
  //   setIsReply(true);
  //   setReplyingCommentId(commentId);
  //   commentInputRef.current?.focus();
  // };

  // const fetchChildrenComments = async () => {
  //   if (childrenComments.length > 0) {
  //     setToggleChildren(true);
  //     return;
  //   }

  //   setToggleChildren(true);
  //   setIsLoading(true);

  //   const { data } = await axios.get(`/api/children?parentId=${comment.id}`);

  //   setChildrenComments(data.commentWithChildren.children);

  //   setIsLoading(false);
  // };

  // const toggleChildrenHandler = () => {
  //   if (!toggleChildren && childrenComments.length === 0) {
  //     fetchChildrenComments();
  //     return;
  //   }

  //   if (!toggleChildren && childrenComments.length > 0) {
  //     setToggleChildren(true);
  //     return;
  //   }

  //   setToggleChildren(false);
  // };

  return (
    <>
      <div className="group my-1 flex w-full flex-row items-center justify-between gap-x-2 break-all">
        <div className="flex w-full flex-row items-start justify-start gap-x-2">
          <div className="avatar flex-none overflow-hidden rounded-full">
            <Image src={comment.user.image} width={40} height={40} />
          </div>
          <div className="-mt-2 flex flex-col">
            <div>
              <span className="mr-3 text-sm font-bold">
                {comment.user.username}
              </span>
              <span className="text-sm">{comment.comment}</span>
            </div>
            <div className="mt-2 flex h-5 gap-x-2 text-xs text-gray-500">
              <span>{dayjs().to(dayjs(comment.createdAt))}</span>
              {likesCount > 0 && (
                <span>
                  {likesCount} {likesCount === 1 ? "Like" : "Likes"}
                </span>
              )}
              {session && (
                <div className="flex gap-x-3 font-semibold">
                  <span
                    // onClick={likeCommentHandler}
                    className={`hover:cursor-pointer ${
                      isLiked && "text-red-400"
                    }`}
                  >
                    Like
                  </span>
                  <span
                    // onClick={() =>
                    //   replyHandler(comment.user.username, comment.id)
                    // }
                    className="hover:cursor-pointer"
                  >
                    Reply
                  </span>
                  {/* {(session?.user.id === comment.userId ||
                    session?.user.id === postAuthorId) && (
                    <div
                      onClick={() => setToggleControlMenu(true)}
                      className="hidden hover:cursor-pointer group-hover:block"
                    >
                      <AiOutlineEllipsis className="h-5 w-5 stroke-red-500" />
                    </div>
                  )} */}
                </div>
              )}
            </div>
            {childrenCount > 0 && (
              <div className="mt-2 flex items-center before:mr-2 before:w-7 before:border before:content-['']">
                <span
                  // onClick={toggleChildrenHandler}
                  className="text-sm font-semibold text-gray-400 hover:cursor-pointer"
                >
                  {!toggleChildren
                    ? `View replies (${childrenCount})`
                    : "Hide replies"}
                  {isLoading && (
                    <span className="relative -top-1 ml-2">
                      <SyncLoader size={4} color="gray" margin={2} />
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* {toggleChildren && (
        <div className="flex w-full flex-col gap-y-5 pl-12">
          {childrenComments.map((childComment) => {
            return (
              <ChildComment
                key={childComment.id}
                childComment={childComment}
                replyHandler={replyHandler}
                setChildrenComments={setChildrenComments}
                setChildrenCount={setChildrenCount}
              />
            );
          })}
        </div>
      )}

      {toggleControlMenu && (
        <ControlMenu
          setToggleControlMenu={setToggleControlMenu}
          deleteHandler={deleteCommentHandler}
          editHandler={editCommentHandler}
          type="comment"
          isOwner={session?.user.id === comment.userId}
        />
      )} */}
    </>
  );
};

export default memo(Comment, (prevProps, nextProps) => {
  if (prevProps.comment === nextProps.comment) {
    return true;
  }

  return false;
});
