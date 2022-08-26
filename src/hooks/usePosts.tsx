import { useState, useEffect } from 'react';
import axios from 'axios';

import { Post } from '../types';

const usePosts = (pageNumber: number, initialPosts: Post[]) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const response = await axios.get('/api/post', {
          params: { pageNumber },
        });

        if (response.data.length === 0) {
          setHasMore(false);
        }

        setPosts((prevState) => [...prevState, ...response.data]);
      } catch (err) {
        console.log(err);
        setError(true);
      }

      setIsLoading(false);
    };

    if (pageNumber > 1) {
      fetchPosts();
    }
  }, [pageNumber]);

  return { posts, isLoading, error, hasMore };
};

export default usePosts;
