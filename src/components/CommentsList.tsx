import SyncLoader from 'react-spinners/SyncLoader';
import { AiOutlinePlusCircle } from 'react-icons/ai';

interface Props {
  isError: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  isLastPage: boolean;
  children: any;
  loadMore: () => void;
}

const CommentsList = ({
  isError,
  isLastPage,
  isLoading,
  isLoadingMore,
  children,
  loadMore,
}: Props) => {
  if (isError) {
    return <div>An error occurred while loading comments...</div>;
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
      <div className="relative overflow-y-hidden">
        <div className="flex flex-col gap-y-5 p-3">{children}</div>
        <div className="flex w-full items-center justify-center">
          {!isLastPage && (
            <>
              {isLoadingMore ? (
                <SyncLoader size={8} color="gray" />
              ) : (
                <AiOutlinePlusCircle
                  className="h-6 w-6 hover:cursor-pointer"
                  onClick={loadMore}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentsList;
