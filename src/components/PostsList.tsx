import React from "react";

import { Post } from "../types";
import PostItem from "./PostItem";

interface Props {
  posts: Post[];
}

const PostsList = ({ posts }: Props) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-24">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsList;
