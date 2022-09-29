import { useState } from 'react';
import Image from 'next/image';
import { HiDocumentDuplicate } from 'react-icons/hi';

import { Post } from '../types';
import PostDetailModal from './PostDetailModal';

interface Props {
  post: Post;
}

const UserPost = ({ post }: Props) => {
  const [togglePostDetailModal, setTogglePostDetailModal] =
    useState<boolean>(false);

  return (
    <>
      <div
        onClick={() => setTogglePostDetailModal(true)}
        className="relative h-full w-full hover:cursor-pointer"
      >
        {post.files!.length > 1 && (
          <div className="absolute top-2 right-2 z-10">
            <HiDocumentDuplicate className="h-7 w-7" fill="white" />
          </div>
        )}
        <Image
          src={`${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/posts/${
            post.files![0].Key
          }`}
          width={275}
          height={300}
          layout="responsive"
          objectFit="cover"
        />
      </div>

      <PostDetailModal
        isOpen={togglePostDetailModal}
        post={post}
        setTogglePostDetailModal={setTogglePostDetailModal}
      />
    </>
  );
};

export default UserPost;
