import { SetStateAction, useState, memo } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";

import { Comment as CommentType } from "../types";

interface Props {
  childComment: CommentType;
  setChildrenComments: React.Dispatch<SetStateAction<CommentType[]>>;
  replyHandler: (mentionUser: string, commentId: string) => {};
}

const ChildComment = ({
  childComment,
  replyHandler,
  setChildrenComments,
}: Props) => {
  const { data: session } = useSession();

  const [isLiked, setIsLiked] = useState<boolean>(
    session && childComment.likedByIds.includes(session.user.id) ? true : false
  );
  const [likesCount, setLikesCount] = useState<number>(
    childComment._count ? childComment._count.likedBy : 0
  );

  const likeCommentHandler = async () => {
    setIsLiked((prevState) => !prevState);
    setLikesCount((prevState) => {
      if (isLiked) {
        return prevState - 1;
      } else {
        return prevState + 1;
      }
    });

    setChildrenComments((prevState) => {
      return prevState.map((comment) => {
        if (comment.id === childComment.id) {
          if (isLiked) {
            comment.likedByIds = comment.likedByIds.filter(
              (likeById) => likeById !== session!.user.id
            );
            return comment;
          } else {
            comment.likedByIds.push(session!.user.id);
            return { ...comment };
          }
        } else {
          return comment;
        }
      });
    });

    await axios.post("/api/likeComment", {
      commentId: childComment.id,
      userId: session!.user.id,
      dislike: isLiked,
    });
  };

  console.log("childComment render");

  return (
    <div className="flex w-full flex-row items-start justify-start gap-x-2">
      <div className="avatar flex-none overflow-hidden rounded-full">
        <Image src={childComment.user.image} width={40} height={40} />
      </div>
      <div className="-mt-2 flex flex-col">
        <div>
          <span className="mr-3 text-sm font-bold">
            {childComment.user.username}
          </span>
          <span className="mr-1 text-sm text-blue-900 hover:cursor-pointer">
            @{childComment.mentionUser}
          </span>
          <span className="text-sm">{childComment.comment}</span>
        </div>
        <div className="mt-2 flex h-5 gap-x-2 text-xs text-gray-500">
          <span>{dayjs().to(dayjs(childComment.createdAt))}</span>
          {likesCount > 0 && (
            <span>
              {likesCount} {likesCount === 1 ? "Like" : "Likes"}
            </span>
          )}
          {session && (
            <div className="flex gap-x-3 font-semibold">
              <span
                onClick={likeCommentHandler}
                className={`hover:cursor-pointer ${isLiked && "text-red-400"}`}
              >
                Like
              </span>
              <span
                onClick={() =>
                  replyHandler(
                    childComment.user.username,
                    childComment.parentId!
                  )
                }
                className="hover:cursor-pointer"
              >
                Reply
              </span>
              {/* {(session?.user.id === childComment.userId ||
                session?.user.id === postAuthorId) && (
                <div
                  onClick={() => setToggleControlMenu(true)}
                  className="hidden hover:cursor-pointer group-hover:block"
                >
                  <AiOutlineEllipsis className="h-5 w-5 stroke-red-500" />
                </div>
              )} }  */}
            </div>
          )}
        </div>
        {/* {childrenCount > 0 && (
          <div className="mt-2 flex items-center before:mr-2 before:w-7 before:border before:content-['']">
            <span
              onClick={showChildernHandler}
              className="text-sm font-semibold text-gray-400 hover:cursor-pointer"
            >
              View replies ({childrenCount})
              {isLoading && (
                <span className="relative -top-1 ml-2">
                  <SyncLoader size={4} color="gray" margin={2} />
                </span>
              )}
            </span>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default memo(ChildComment, (prevProps, nextProps) => {
  if (prevProps.childComment === nextProps.childComment) {
    return true;
  }

  return false;
});
