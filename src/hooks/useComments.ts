import { useState, useEffect, useCallback } from 'react';
import { Comment as CommentType } from '../types';
import axios from 'axios';

export default function useComments(postId: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentComments, setCurrentComments] = useState<CommentType[]>([]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.get(
        `/api/comment?postId=${postId}&currentPage=${currentPage}`
      );

      if (data.length < 20) {
        setIsLastPage(true);
      }

      setCurrentComments((prevState) => [...prevState, ...data]);
    } catch (err) {
      console.log(err);

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    setIsLoadingMore(true);

    const { data } = await axios.get(
      `/api/comment?postId=${postId}&currentPage=${currentPage + 1}`
    );

    if (data.length < 20) {
      setIsLastPage(true);
    }

    setCurrentComments((prevState) => [...prevState, ...data]);
    setIsLoadingMore(false);
    setCurrentPage((prevState) => prevState + 1);
  };

  return {
    isLoading,
    currentComments,
    currentPage,
    isError,
    isLastPage,
    isLoadingMore,
    fetchComments,
    loadMore,
    setCurrentComments,
  };
}
