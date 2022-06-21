interface Props {
  commentInput: string;
  setCommentInput: React.Dispatch<React.SetStateAction<string>>;
  submitHandler: (e: React.MouseEvent<HTMLButtonElement>) => {};
}

const CommentInputBox = ({
  commentInput,
  setCommentInput,
  submitHandler,
}: Props) => {
  return (
    <form className="w-full">
      <div className="flex items-center justify-center">
        <textarea
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCommentInput(e.target.value);
          }}
          className="h-[50px] w-full resize-none border-none p-2 leading-8 outline-none"
        ></textarea>
        <button
          className={`font-semibold text-primary disabled:cursor-not-allowed disabled:text-gray-500`}
          disabled={commentInput.length === 0}
          onClick={submitHandler}
        >
          post
        </button>
      </div>
    </form>
  );
};

export default CommentInputBox;
