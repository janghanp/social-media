import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

interface DeleteComment {
  commentId: string;
  postId: string;
  isChild: boolean;
}

export default function useDeleteComment() {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (deleteComment: DeleteComment) => {
      const { commentId, postId, isChild } = deleteComment;

      return axios.delete("/api/comment", {
        data: {
          commentId,
          postId,
          isChild,
        },
      });
    },
    {
      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries(`comments/${variables.postId}`);
      },
    }
  );

  return { mutate, isLoading, isError, isSuccess };
}
