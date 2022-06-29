import { SetStateAction, useState, memo } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiOutlineEllipsis } from "react-icons/ai";
import { useSession } from "next-auth/react";
import axios from "axios";

import { Comment as CommentType } from "../pages/index";
import ControlMenu from "./ControlMenu";

dayjs.extend(relativeTime);

interface Props {
  comment: CommentType;
  postAuthorId: string;
  deleteComment: (commentdId: string) => {};
  setCommentInput: React.Dispatch<SetStateAction<string>>;
  setIsEdit: React.Dispatch<SetStateAction<boolean>>;
  setIsReply: React.Dispatch<SetStateAction<boolean>>;
  setEditingCommentId: React.Dispatch<SetStateAction<string | undefined>>;
  commentInputRef: React.RefObject<HTMLTextAreaElement>;
  setReplyingCommentId: React.Dispatch<SetStateAction<string | undefined>>;
  setCurrentComments: React.Dispatch<SetStateAction<CommentType[]>>;
}

const Comment = ({
  comment,
  commentInputRef,
  postAuthorId,
  deleteComment,
  setCommentInput,
  setIsEdit,
  setEditingCommentId,
  setIsReply,
  setReplyingCommentId,
  setCurrentComments,
}: Props) => {
  const { data: session } = useSession();

  const [toggleControlMenu, setToggleControlMenu] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(
    comment._count ? comment._count.likedBy : 0
  );
  const [isLiked, setIsLiked] = useState<boolean>(
    session && comment.likedByIds.includes(session.user.id) ? true : false
  );

  const childrenCount = comment._count ? comment._count.children : 0;

  const deleteHandler = async () => {
    await axios.delete("/api/comment", {
      data: {
        commentId: comment.id,
        postId: comment.postId,
      },
    });

    deleteComment(comment.id);
  };

  const editHandler = async () => {
    setToggleControlMenu(false);
    setEditingCommentId(comment.id);
    setCommentInput(comment.comment);
    setIsEdit(true);
  };

  const likeCommentHandler = async () => {
    setIsLiked((prevState) => !prevState);
    setLikesCount((prevState) => {
      if (isLiked) {
        return prevState - 1;
      } else {
        return prevState + 1;
      }
    });
    setCurrentComments((prevState) => {
      return prevState.map((currentComment) => {
        if (currentComment.id === comment.id) {
          if (isLiked) {
            currentComment.likedByIds = currentComment.likedByIds.filter(
              (likeById) => likeById !== session!.user.id
            );
            return currentComment;
          } else {
            currentComment.likedByIds.push(session!.user.id);
            return currentComment;
          }
        } else {
          return currentComment;
        }
      });
    });

    await axios.post("/api/likeComment", {
      commentId: comment.id,
      userId: session!.user.id,
      dislike: isLiked,
    });
  };

  const replyHandler = async () => {
    setCommentInput(`@${comment.user.username} `);
    setIsReply(true);
    setReplyingCommentId(comment.id);
    commentInputRef.current?.focus();
  };

  return (
    <div className="group my-1 flex w-full flex-row items-center justify-between gap-x-2 break-all">
      <div className="flex flex-row items-start justify-center gap-x-2">
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
          <div className="mt-1 flex h-5 gap-x-2 text-xs text-gray-500">
            <span>{dayjs().to(dayjs(comment.createdAt))}</span>
            {likesCount > 0 && (
              <span>
                {likesCount} {likesCount === 1 ? "Like" : "Likes"}
              </span>
            )}
            {session && (
              <div className="flex gap-x-3 font-semibold">
                <span
                  onClick={likeCommentHandler}
                  className={`hover:cursor-pointer ${
                    isLiked && "text-red-400"
                  }`}
                >
                  Like
                </span>
                <span onClick={replyHandler} className="hover:cursor-pointer">
                  Reply
                </span>
                {(session?.user.id === comment.userId ||
                  session?.user.id === postAuthorId) && (
                  <div
                    onClick={() => setToggleControlMenu(true)}
                    className="hidden hover:cursor-pointer group-hover:block"
                  >
                    <AiOutlineEllipsis className="h-5 w-5 stroke-red-500" />
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            {childrenCount > 0 && (
              <span className="text-sm font-semibold text-gray-400 hover:cursor-pointer">
                View replies ({childrenCount})
              </span>
            )}
          </div>
        </div>
      </div>
      {toggleControlMenu && (
        <ControlMenu
          setToggleControlMenu={setToggleControlMenu}
          deleteHandler={deleteHandler}
          editHandler={editHandler}
          type="comment"
          isOwner={session?.user.id === comment.userId}
        />
      )}
    </div>
  );
};

export default memo(Comment);
