import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import { Post as PostType, Comment as CommentType } from '../types';
import Comment from './Comment';
import CommentsList from './CommentsList';
import CommentInputBox from './CommentInputBox';
import { usePostContext } from '../context/postContext';
import { sendNotification } from '../lib/sendNotification';
import { useCurrentUserState } from '../store';

const thresholds = [
  { l: 's', r: 1 },
  { l: 'm', r: 1 },
  { l: 'mm', r: 59, d: 'minute' },
  { l: 'h', r: 1 },
  { l: 'hh', r: 23, d: 'hour' },
  { l: 'd', r: 1 },
  { l: 'dd', r: 29, d: 'day' },
  { l: 'M', r: 1 },
  { l: 'MM', r: 11, d: 'month' },
  { l: 'y' },
  { l: 'yy', d: 'year' },
];

const config = {
  thresholds,
};

dayjs.extend(relativeTime, config);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1M',
    MM: '%dM',
    y: '1y',
    yy: '%dy',
  },
});

interface Props {
  post: PostType;
}

const CommentSection = ({ post }: Props) => {
  const { data: session } = useSession();

  const currentUser = useCurrentUserState((state) => state.currentUser);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isReply, setIsReply] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<string>('');
  const [replyingCommentId, setReplyingCommentId] = useState<string>('');
  const [currentCommentInput, setCurrentCommentInput] = useState<string>('');
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentComments, setCurrentComments] = useState<CommentType[]>([]);
  const [skip, setSkip] = useState<number>(0);

  const { setTotalCommentsCount, setPreviewComments } = usePostContext();

  useEffect(() => {
    async function fetchComments(): Promise<void> {
      try {
        setIsLoading(true);

        const { data } = await axios.get(
          `/api/comment?postId=${post.id}&currentPage=${currentPage}`
        );

        if (data.length < 20) {
          setIsLastPage(true);
        }

        if (data.length === 0) {
          return;
        }

        setCurrentComments((prevState) => [...prevState, ...data]);
      } catch (err) {
        console.log(err);

        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (currentComments.length === 0) {
      fetchComments();
    }
  }, [currentComments, post.id, currentPage]);

  const loadMore = async () => {
    setIsLoadingMore(true);

    const { data } = await axios.get(
      `/api/comment?postId=${post.id}&currentPage=${
        currentPage + 1
      }&skip=${skip}`
    );

    if (data.length < 20) {
      setIsLastPage(true);
    }

    setCurrentComments((prevState) => [...prevState, ...data]);
    setIsLoadingMore(false);
    setCurrentPage((prevState) => prevState + 1);
  };

  const createComment = async (commentInput: string) => {
    const {
      data: { newComment },
    } = await axios.post('/api/comment', {
      postId: post.id,
      comment: commentInput,
    });

    if (currentUser!.id !== post.userId) {
      sendNotification(
        currentUser!.id,
        post.userId,
        'COMMENT',
        `${window.location.origin}/posts/${post.id}`
      );
    }

    setCurrentComments((prevState) => [newComment, ...prevState]);
    setTotalCommentsCount((prevState) => prevState + 1);
    setPreviewComments((prevState) => [newComment, ...prevState]);
    setSkip((prevState) => prevState + 1);
  };

  const editComment = async (commentInput: string) => {
    const {
      data: { updatedComment },
    } = await axios.put('/api/comment', {
      commentId: editingCommentId,
      comment: commentInput,
    });

    setCurrentComments((prevState) => {
      const newCurrentComments = prevState.map((prevComment) => {
        if (prevComment.id === editingCommentId) {
          return updatedComment;
        } else {
          return prevComment;
        }
      });

      setPreviewComments(newCurrentComments.slice(0, 2));

      return newCurrentComments;
    });

    setIsEdit(false);
    setEditingCommentId('');
    setCurrentCommentInput('');
  };

  const replyComment = async (commentInput: string) => {
    const commentInputChunks = commentInput.split(' ');

    const mentionUser = commentInputChunks.shift()?.replace('@', '');
    const comment = commentInputChunks.join(' ');

    const {
      data: { newCommentWithUser: newReply },
    } = await axios.post('/api/reply', {
      userId: session?.user.id,
      comment,
      postId: post.id,
      parentId: replyingCommentId,
      mentionUser,
    });

    setIsReply(false);
    setReplyingCommentId('');
    setCurrentCommentInput('');
    setCurrentComments((prevState) => {
      const newCurrentComments = prevState.map((currentComment) => {
        if (currentComment.id === replyingCommentId) {
          currentComment._count.children++;
          currentComment.newChildren = newReply;

          return { ...currentComment };
        }
        return currentComment;
      });

      return newCurrentComments;
    });
    setTotalCommentsCount((state) => state + 1);
  };

  const deleteComment = async (commentId: string, postId: string) => {
    await axios.delete('/api/comment', {
      data: {
        commentId,
        postId,
      },
    });

    const comment = currentComments.filter(
      (currentComment) => currentComment.id === commentId
    )[0];

    setTotalCommentsCount(
      (prevState) => prevState - (comment._count.children + 1)
    );
    setCurrentComments((prevState) => {
      const newCurrentComments = prevState.filter(
        (prevComment) => prevComment.id !== commentId
      );
      setPreviewComments(newCurrentComments.slice(0, 2));

      return newCurrentComments;
    });
  };

  const stillIsReplying = (inputValue: string) => {
    if ((inputValue.length === 0 && isReply) || inputValue[0] !== '@') {
      setIsReply(false);
      setCurrentCommentInput('');
    }
  };

  return (
    <div className="relative col-span-5 max-h-max md:col-span-2 md:flex md:flex-col md:justify-between">
      <div className="hidden max-h-max md:flex md:flex-col md:justify-between">
        <div className="flex items-center space-x-3 border-b p-3">
          <div className="avatar overflow-hidden rounded-full">
            <Image src={post.user.image} width={40} height={40} alt="Image" />
          </div>
          <span className="text-sm text-gray-500">
            {post.user.username} &nbsp;• &nbsp;{' '}
            {dayjs().to(dayjs(post.createdAt))}
          </span>
        </div>
        <div className="absolute top-20 bottom-16 w-full overflow-y-auto">
          <div className="flex w-auto gap-x-2 p-3">
            <div className="avatar overflow-hidden">
              <div className="flex h-[40px]  w-[40px] items-center justify-center rounded-full">
                <Image
                  src={post.user.image}
                  width={40}
                  height={40}
                  alt="Image"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col">
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
          <CommentsList
            isError={isError}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            isLastPage={isLastPage}
            loadMore={loadMore}
          >
            {currentComments.map((currentComment) => {
              return (
                <Fragment key={currentComment.id}>
                  <Comment
                    key={currentComment.id}
                    comment={currentComment}
                    postId={post.id}
                    postAuthorId={post.userId}
                    setIsEdit={setIsEdit}
                    setIsReply={setIsReply}
                    setEditingCommentId={setEditingCommentId}
                    setCurrentCommentInput={setCurrentCommentInput}
                    deleteComment={deleteComment}
                    setCurrentComments={setCurrentComments}
                    setReplyingCommentId={setReplyingCommentId}
                  />
                </Fragment>
              );
            })}
          </CommentsList>
        </div>
      </div>
      <div className="border-t-0 md:border-t">
        <CommentInputBox
          isEdit={isEdit}
          isReply={isReply}
          currentCommentInput={currentCommentInput}
          stillIsReplying={stillIsReplying}
          createComment={createComment}
          editComment={editComment}
          replyComment={replyComment}
        />
      </div>
    </div>
  );
};

export default CommentSection;
