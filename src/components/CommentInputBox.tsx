interface Props {
  commentInput: string;
  setCommentInput: React.Dispatch<React.SetStateAction<string>>;
  submitHandler: (e: React.MouseEvent<HTMLButtonElement>) => {};
  isEdit: boolean;
  commentInputRef: React.RefObject<HTMLTextAreaElement>;
  setIsReply: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentInputBox = ({
  commentInput,
  setCommentInput,
  submitHandler,
  isEdit,
  commentInputRef,
  setIsReply,
}: Props) => {
  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    if (inputValue.length === 0 || inputValue[0] !== "@") {
      setIsReply(false);
    }

    setCommentInput(inputValue);
  };

  return (
    <form className="w-full">
      <div className="flex items-center justify-center">
        <textarea
          ref={commentInputRef}
          placeholder="Add a comment..."
          value={commentInput}
          onChange={changeHandler}
          className="h-[50px] w-full resize-none border-none p-2 leading-8 outline-none"
        ></textarea>
        <button
          className={`font-semibold text-primary disabled:cursor-not-allowed disabled:text-gray-500`}
          disabled={commentInput.length === 0}
          onClick={submitHandler}
        >
          {isEdit ? "Edit" : "Post"}
        </button>
      </div>
    </form>
  );
};

export default CommentInputBox;
