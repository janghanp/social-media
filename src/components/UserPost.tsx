import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { HiDocumentDuplicate } from 'react-icons/hi';

import { Post } from '../types';
import PostDetailModal from '../components/PostDetailModal';

interface Props {
  post: Post;
}

const UserPost = ({ post }: Props) => {
  const prevUrlRef = useRef<string>(window.location.pathname);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => {
    window.history.replaceState({}, '', `/posts/${post.id}`);
    setIsOpen(true);
  };

  const closeModal = () => {
    window.history.replaceState({}, '', prevUrlRef.current);
    setIsOpen(false);
  };

  return (
    <>
      <div
        className="relative h-full w-full hover:cursor-pointer"
        onClick={openModal}
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

      {isOpen && <PostDetailModal postId={post.id} closeModal={closeModal} />}
    </>
  );
};

export default UserPost;
