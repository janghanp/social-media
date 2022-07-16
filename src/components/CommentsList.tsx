import { Fragment } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { AiOutlinePlusCircle } from "react-icons/ai";

import { Comment as CommentType } from "../types";
import useFetchComments from "../hooks/useFetchComments";
import Comment from "./Comment";

interface Props {
  postId: string;
  postAuthorId: string;
}

const CommentsList = ({ postId, postAuthorId }: Props) => {
  const {
    data,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFetchComments(postId);

  if (error) {
    return <div>Error...</div>;
  }

  if (isLoading) {
    return (
      <div className="relative flex w-full justify-center">
        <SyncLoader size={7} color="gray" margin={2} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-y-5">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.map((comment: CommentType) => (
              <Comment
                key={comment.id}
                comment={comment}
                postAuthorId={postAuthorId}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div className="flex w-full items-center justify-center">
        {hasNextPage && (
          <>
            {isFetchingNextPage ? (
              <SyncLoader size={8} color="gray" />
            ) : (
              <AiOutlinePlusCircle
                className="h-6 w-6 hover:cursor-pointer"
                onClick={() => fetchNextPage()}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CommentsList;
