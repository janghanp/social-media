import { SetStateAction, useState, memo } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import dayjs from 'dayjs';

import { Comment as CommentType } from '../types';
import { AiOutlineEllipsis } from 'react-icons/ai';
import ControlMenu from './ControlMenu';
import { usePostContext } from '../context/postContext';
import { useCurrentUserState } from '../store';
import { sendNotification } from '../lib/sendNotification';

interface Props {
  childComment: CommentType;
  setChildrenComments: React.Dispatch<SetStateAction<CommentType[]>>;
  setChildrenCount: React.Dispatch<SetStateAction<number>>;
  replyHandler: (mentionUser: string, commentId: string) => {};
}

const ChildComment = ({
  childComment,
  replyHandler,
  setChildrenComments,
  setChildrenCount,
}: Props) => {
  const { data: session } = useSession();

  const currentUser = useCurrentUserState((state) => state.currentUser);

  const [isLiked, setIsLiked] = useState<boolean>(
    session && childComment.likedByIds.includes(session.user.id) ? true : false
  );
  const [likesCount, setLikesCount] = useState<number>(
    childComment._count ? childComment._count.likedBy : 0
  );
  const [toggleControlMenu, setToggleControlMenu] = useState<boolean>(false);

  const { postId, setTotalCommentsCount } = usePostContext();

  const likeCommentHandler = async () => {
    await axios.post('/api/likeComment', {
      commentId: childComment.id,
      userId: session!.user.id,
      dislike: isLiked,
    });

    if (currentUser!.id !== childComment.userId) {
      sendNotification(
        currentUser!.id,
        childComment.userId,
        'LIKECOMMENT',
        `${window.location.origin}/posts/${postId}`,
        childComment.id
      );
    }

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
  };

  const deleteCommentHandler = async () => {
    setToggleControlMenu(false);
    setChildrenComments((prevState) =>
      prevState.filter((child) => child.id !== childComment.id)
    );

    setChildrenCount((prevState) => prevState - 1);

    await axios.delete('/api/comment', {
      data: {
        commentId: childComment.id,
        postId: childComment.postId,
        isChild: true,
      },
    });

    setTotalCommentsCount((prevState) => prevState - 1);
  };

  return (
    <>
      <div className="group flex w-full flex-row items-start justify-start gap-x-2">
        <div className="avatar flex-none overflow-hidden rounded-full">
          <Image
            src={childComment.user.image}
            width={40}
            height={40}
            alt="user-image"
          />
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
                {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
              </span>
            )}
            {session && (
              <div className="flex gap-x-3 font-semibold">
                <span
                  onClick={likeCommentHandler}
                  className={`hover:cursor-pointer ${
                    isLiked && 'text-red-400'
                  }`}
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
                {session?.user.id === childComment.userId && (
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
        </div>
      </div>

      <ControlMenu
        isChild={true}
        isOpen={toggleControlMenu}
        setToggleControlMenu={setToggleControlMenu}
        deleteHandler={deleteCommentHandler}
        type="comment"
        isOwner={session?.user.id === childComment.userId}
      />
    </>
  );
};

export default memo(ChildComment, (prevProps, nextProps) => {
  if (prevProps.childComment === nextProps.childComment) {
    return true;
  }

  return false;
});
