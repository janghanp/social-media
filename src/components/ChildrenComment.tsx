import Image from "next/image";
import dayjs from "dayjs";

import { Comment as CommentType } from "../types";

interface Props {
  childrenComment: CommentType;
}

const ChildrenComment = ({ childrenComment }: Props) => {
  return (
    <div className="flex w-full flex-row items-start justify-start gap-x-2">
      <div className="avatar flex-none overflow-hidden rounded-full">
        <Image src={childrenComment.user.image} width={40} height={40} />
      </div>
      <div className="-mt-2 flex flex-col">
        <div>
          <span className="mr-3 text-sm font-bold">
            {childrenComment.user.username}
          </span>
          <span className="mr-2 text-sm text-blue-500 hover:cursor-pointer hover:underline">
            @{childrenComment.mentionUser}
          </span>
          <span className="text-sm">{childrenComment.comment}</span>
        </div>
        <div className="mt-2 flex h-5 gap-x-2 text-xs text-gray-500">
          <span>{dayjs().to(dayjs(childrenComment.createdAt))}</span>
          {/* {likesCount > 0 && (
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
              <span onClick={replyHandler} className="hover:cursor-pointer">
                Reply
              </span>
              {(session?.user.id === childrenComment.userId ||
                session?.user.id === postAuthorId) && (
                <div
                  onClick={() => setToggleControlMenu(true)}
                  className="hidden hover:cursor-pointer group-hover:block"
                >
                  <AiOutlineEllipsis className="h-5 w-5 stroke-red-500" />
                </div>
              )}
            </div>
          )} */}
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

export default ChildrenComment;
