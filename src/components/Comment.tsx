import { SetStateAction, useState, useEffect, memo } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import SyncLoader from 'react-spinners/SyncLoader';

import { Comment as CommentType } from '../types';
import ControlMenu from './ControlMenu';
import ChildComment from './ChildComment';
import { useCurrentUserState } from '../store';
import { sendNotification } from '../lib/sendNotification';
import { usePostContext } from '../context/postContext';

dayjs.extend(relativeTime);

interface Props {
  comment: CommentType;
  postId: string;
  postAuthorId: string;
  setIsEdit: React.Dispatch<SetStateAction<boolean>>;
  setIsReply: React.Dispatch<SetStateAction<boolean>>;
  setEditingCommentId: React.Dispatch<SetStateAction<string>>;
  setCurrentCommentInput: React.Dispatch<SetStateAction<string>>;
  setCurrentComments: React.Dispatch<SetStateAction<CommentType[]>>;
  setReplyingCommentId: React.Dispatch<SetStateAction<string>>;
  deleteComment: (commentId: string, postId: string) => void;
}

const Comment = ({
  comment,
  postId,
  postAuthorId,
  deleteComment,
  setIsEdit,
  setIsReply,
  setEditingCommentId,
  setCurrentCommentInput,
  setCurrentComments,
  setReplyingCommentId,
}: Props) => {
  const { data: session } = useSession();

  const currentUser = useCurrentUserState((state) => state.currentUser);

  const { postThumbnail } = usePostContext();

  const [isControlMenuOpen, setIsControlMenuOpen] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(comment._count ? comment._count.likedBy : 0);
  const [isLiked, setIsLiked] = useState<boolean>(
    session && comment.likedByIds.includes(session.user.id) ? true : false
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toggleChildren, setToggleChildren] = useState<boolean>(false);
  const [childrenComments, setChildrenComments] = useState<CommentType[]>([]);
  const [childrenCount, setChildrenCount] = useState<number>(
    comment._count ? comment._count.children : 0
  );

  useEffect(() => {
    if (childrenComments.length > 0) {
      setChildrenComments((prevState) => {
        const newChildrenComments = [...prevState, comment.newChildren!];

        return newChildrenComments;
      });

      setChildrenCount((prevState) => prevState + 1);
    }
  }, [comment.newChildren, childrenComments.length]);

  useEffect(() => {
    setChildrenCount(comment._count.children);
  }, [comment._count.children]);

  const deleteCommentHandler = async () => {
    setIsControlMenuOpen(false);
    deleteComment(comment.id, comment.postId);
  };

  const editCommentHandler = async () => {
    setIsControlMenuOpen(false);
    setIsEdit(true);
    setEditingCommentId(comment.id);
    setCurrentCommentInput(comment.comment);
  };

  const likeCommentHandler = async () => {
    await axios.post('/api/likeComment', {
      commentId: comment.id,
      userId: session!.user.id,
      dislike: isLiked,
    });

    if (currentUser!.id !== comment.userId) {
      sendNotification(
        currentUser!.id,
        comment.userId,
        'LIKECOMMENT',
        `${window.location.origin}/posts/${postId}`,
        comment.id,
        postThumbnail
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
            return { ...currentComment };
          }
        } else {
          return currentComment;
        }
      });
    });
  };

  const replyHandler = async (metionUser: string, commentId: string) => {
    setIsReply(true);
    setReplyingCommentId(commentId);
    setCurrentCommentInput(`@${metionUser} `);
  };

  const fetchChildrenComments = async () => {
    if (childrenComments.length > 0) {
      setToggleChildren(true);
      return;
    }

    setToggleChildren(true);
    setIsLoading(true);

    const { data } = await axios.get(`/api/children?parentId=${comment.id}`);

    setChildrenComments(data.commentWithChildren.children);
    setIsLoading(false);
  };

  const toggleChildrenHandler = () => {
    if (!toggleChildren && childrenComments.length === 0) {
      fetchChildrenComments();
      return;
    }

    if (!toggleChildren && childrenComments.length > 0) {
      setToggleChildren(true);
      return;
    }
    setToggleChildren(false);
  };

  return (
    <>
      <div className="group my-1 flex w-full flex-row items-center justify-between gap-x-2 break-all">
        <div className="flex w-full flex-row items-start justify-start gap-x-2">
          <div className="avatar flex-none overflow-hidden rounded-full">
            <Image src={comment.user.image} width={40} height={40} alt={comment.user.id} />
          </div>
          <div className="-mt-2 flex flex-col">
            <div>
              <span className="mr-3 text-sm font-bold">{comment.user.username}</span>
              <span className="text-sm">{comment.comment}</span>
            </div>
            <div className="mt-2 flex h-5 gap-x-2 text-xs text-gray-500">
              <span>{dayjs().to(dayjs(comment.createdAt))}</span>
              {likesCount > 0 && (
                <span>
                  {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
                </span>
              )}
              {session && (
                <div className="flex gap-x-3 font-semibold">
                  <span
                    onClick={likeCommentHandler}
                    className={`hover:cursor-pointer ${isLiked && 'text-red-400'}`}
                  >
                    Like
                  </span>
                  <span
                    onClick={() => replyHandler(comment.user.username, comment.id)}
                    className="hover:cursor-pointer"
                  >
                    Reply
                  </span>
                  {(session?.user.id === comment.userId || session?.user.id === postAuthorId) && (
                    <div
                      onClick={() => setIsControlMenuOpen(true)}
                      className="hidden hover:cursor-pointer group-hover:block"
                    >
                      <AiOutlineEllipsis className="h-5 w-5 stroke-red-500" />
                    </div>
                  )}
                </div>
              )}
            </div>
            {comment._count.children > 0 && (
              <div className="mt-2 flex items-center before:mr-2 before:w-7 before:border before:content-['']">
                <span
                  onClick={toggleChildrenHandler}
                  className="text-sm font-semibold text-gray-400 hover:cursor-pointer"
                >
                  {!toggleChildren
                    ? `View replies (${comment._count ? childrenCount : 0})`
                    : 'Hide replies'}
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

      {toggleChildren && (
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

      {isControlMenuOpen && (
        <ControlMenu
          type="comment"
          isOwner={session?.user.id === comment.userId}
          setIsControlMenuOpen={setIsControlMenuOpen}
          deleteHandler={deleteCommentHandler}
          editHandler={editCommentHandler}
        />
      )}
    </>
  );
};

export default memo(Comment, (prevProps, nextProps) => {
  if (prevProps.comment === nextProps.comment) {
    return true;
  }

  return false;
});
