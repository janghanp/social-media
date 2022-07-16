import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

interface CreateComment {
  postId: string;
  comment: string;
}

export default function useCreateComment(postId: string) {
  const key = `comments/${postId}`;

  const queryClient = useQueryClient();

  const { isLoading, isError, isSuccess, mutateAsync } = useMutation(
    (newComment: CreateComment) => {
      return axios.post("/api/comment", newComment);
    },
    {
      onMutate: async (newComment) => {
        // await queryClient.cancelQueries([key]);
        // const previousComments = queryClient.getQueriesData([key]);
        // queryClient.setQueryData(key, (old: any) => {
        //   old.pages[0].unshift(newComment);
        //   return old;
        // });
        // return { previousComments };
      },
      onError: (err, newComment, context) => {
        // queryClient.setQueriesData([key], context?.previousComments);
      },
      onSettled: (newComment, error, variables, context) => {
        queryClient.invalidateQueries(key);
      },
    }
  );

  return { isLoading, isError, isSuccess, mutateAsync };
}
