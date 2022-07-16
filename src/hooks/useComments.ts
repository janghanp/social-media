import useSWRInfinite from "swr/infinite";
import { Comment as CommentType } from "../types";

export default function useComments(postId: string) {
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (pageIndex) => {
      return `/api/comment?postId=${postId}&currentPage=${pageIndex + 1}`;
    },
    {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  // const postComment = useCallback(
  //   async (postId: string, commentInput: string) => {
  //     setIsLoading(true);

  //     const {
  //       data: { commentWithUser },
  //     } = await axios.post("/api/comment", {
  //       postId,
  //       comment: commentInput,
  //     });

  //     // mutate(async() => {},false);

  //     return commentWithUser;
  //   },

  //   []
  // );

  const currentComments: CommentType[] = data ? [].concat(...data) : [];
  const isEmpty = data?.[0]?.length === 0;
  const isLoadingInitialData = !data && !error;
  const isLastPage = data && data[data.length - 1].length < 20;
  const isRefreshing = isValidating && data && data.length === size;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");

  return {
    currentComments,
    isEmpty,
    isLoadingInitialData,
    isLastPage,
    isRefreshing,
    isLoadingMore,
    error,
    mutate,
    size,
    setSize,
  };
}
