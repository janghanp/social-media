import { useState, useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import axios from "axios";
import produce from "immer";
import { useSWRConfig } from "swr";
import { useInfiniteQuery } from "react-query";

import { Comment as CommentType } from "../types";

export default function useComments(postId: string) {
  const fetchComments = async ({ pageParam = 1 }) => {
    return axios
      .get(`/api/comment?postId=${postId}&currentPage=${pageParam}`)
      .then((response) => response.data);
  };

  const {
    isLoading,
    data,
    error,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery(`comments/${postId}`, fetchComments, {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) {
        return undefined;
      }

      return allPages.length + 1;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
}

// export default function useComments(postId: string) {
//   const { cache } = useSWRConfig();

//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
//     (pageIndex) => {
//       return `/api/comment?postId=${postId}&currentPage=${pageIndex + 1}`;
//     },
//     {
//       revalidateFirstPage: false,
//       revalidateIfStale: true,
//     }
//   );

//   const postComment = useCallback(
//     async (postId: string, commentInput: string) => {
//       setIsLoading(true);

//       const {
//         data: { commentWithUser },
//       } = await axios.post("/api/comment", {
//         postId,
//         comment: commentInput,
//       });

//       // mutate(async() => {},false);

//       return commentWithUser;
//     },

//     []
//   );

//   const currentComments = data ? [].concat(...data) : [];
//   const isRefreshing = data && isValidating ? true : false;
//   const isLastPage = data && data[data.length - 1].length < 20;

//   return {
//     currentComments,
//     isLastPage,
//     isLoading,
//     error,
//     mutate,
//     size,
//     setSize,
//     isRefreshing,
//     postComment,
//   };
// }
