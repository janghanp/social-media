import React from 'react';

import { Post as PostType } from '../types';
import Post from './Post';

interface Props {
  posts: PostType[];
}

const PostsList = ({ posts }: Props) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-24">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsList;
