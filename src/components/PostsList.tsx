import React, { useCallback, useRef, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import usePosts from '../hooks/usePosts';

import { Post as PostType } from '../types';
import Post from './Post';

interface Props {
  initialPosts: PostType[];
}

const PostsList = ({ initialPosts }: Props) => {
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { posts, isLoading, error, hasMore } = usePosts(pageNumber, initialPosts);

  const observerRef = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (!node) {
        return;
      }

      if (observerRef.current) {
        observerRef.current?.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (hasMore) {
              setPageNumber((prevState) => prevState + 1);
            }
          }
        },
        { threshold: 0.5 }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [hasMore]
  );

  return (
    <div className="flex h-auto w-full flex-col items-center justify-center gap-y-14 pb-24">
      {posts.map((post, index) => {
        if (index + 1 === posts.length) {
          return (
            <div className="w-[470px]" key={post.id} ref={lastElementRef}>
              <Post post={post} />
            </div>
          );
        } else {
          return (
            <div className="w-[470px]" key={post.id}>
              <Post post={post} />
            </div>
          );
        }
      })}

      {isLoading && (
        <div className="mt-5">
          <PropagateLoader color="gray" />
        </div>
      )}

      {error && <div className="mt-5 text-sm text-warning">Please try again...</div>}
    </div>
  );
};

export default PostsList;
