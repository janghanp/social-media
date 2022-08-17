import React, { useState, useEffect, memo } from 'react';
import SyncLoader from 'react-spinners/SyncLoader';

interface Props {
  isEdit: boolean;
  isReply: boolean;
  currentCommentInput: string;
  createComment: (commentInput: string) => Promise<void>;
  editComment: (commentInput: string) => Promise<void>;
  replyComment: (commentInput: string) => Promise<void>;
  stillIsEditing: (inputValue: string) => void;
  stillIsReplying: (inputValue: string) => void;
}

const CommentInputBox = ({
  isEdit,
  isReply,
  currentCommentInput,
  createComment,
  editComment,
  replyComment,
  stillIsEditing,
  stillIsReplying,
}: Props) => {
  const [commentInput, setCommentInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentCommentInput) {
      setCommentInput(currentCommentInput);
    }
  }, [currentCommentInput]);

  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (isEdit) {
      await editComment(commentInput);
    } else if (isReply) {
      await replyComment(commentInput);
    } else {
      await createComment(commentInput);
    }

    setIsLoading(false);

    setCommentInput('');
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    if (isEdit) {
      stillIsEditing(inputValue);
    }

    if (isReply) {
      stillIsReplying(inputValue);
    }

    setCommentInput(inputValue);
  };

  return (
    <div className="relative">
      <form className="w-full">
        <div className="flex items-center justify-center">
          <textarea
            ref={(input) => input && input.focus()}
            placeholder="Add a comment..."
            value={commentInput}
            onChange={inputChangeHandler}
            className="h-[50px] w-full resize-none border-none p-2 leading-8 outline-none"
          ></textarea>
          <button
            className={`font-semibold text-primary disabled:cursor-not-allowed disabled:text-gray-500`}
            disabled={commentInput.length === 0}
            onClick={submitHandler}
          >
            {isEdit ? 'Edit' : 'Post'}
          </button>
        </div>
      </form>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50">
          <SyncLoader color="gray" size={8} />
        </div>
      )}
    </div>
  );
};

export default memo(CommentInputBox);
