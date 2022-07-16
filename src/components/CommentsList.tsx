import { Fragment } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { AiOutlinePlusCircle } from "react-icons/ai";

import { Comment as CommentType } from "../types";
import useFetchComments from "../hooks/useFetchComments";
import Comment from "./Comment";
import useComments from "../hooks/useComments";

interface Props {
  postId: string;
}

const CommentsList = ({ postId }: Props) => {
  const {
    currentComments,
    error,
    isLoadingInitialData,
    isRefreshing,
    isLastPage,
    isLoadingMore,
    mutate,
    size,
    setSize,
  } = useComments(postId);

  if (error) {
    return <div>An error occurred while loading comments...</div>;
  }

  if (isLoadingInitialData) {
    return (
      <div className="relative flex w-full justify-center">
        <SyncLoader size={7} color="gray" margin={2} />
      </div>
    );
  }

  console.log("comentslist");

  return (
    <div className="relative overflow-y-hidden">
      <div className="flex flex-col gap-y-5 p-3">
        {currentComments.map((currentComment, i) => (
          <Fragment key={i}>
            <Comment key={currentComment.id} comment={currentComment} />
          </Fragment>
        ))}
      </div>
      <div className="flex w-full items-center justify-center">
        {!isLastPage && (
          <>
            {isLoadingMore ? (
              <SyncLoader size={8} color="gray" />
            ) : (
              <AiOutlinePlusCircle
                className="h-6 w-6 hover:cursor-pointer"
                onClick={() => setSize(size + 1)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentsList;
