import Image from 'next/image';
import { useRef, useState } from 'react';
import { HiDocumentDuplicate } from 'react-icons/hi';
import { useRouter } from 'next/router';

import { Post } from '../types';
import PostDetailModal from '../components/PostDetailModal';
import axios from 'axios';
import PostModal from './PostModal';

interface Props {
  post: Post;
}

const UserPost = ({ post }: Props) => {
  const router = useRouter();

  const prevUrlRef = useRef<string>(window.location.pathname);

  const [isPostDetailModalOpen, setIsPostDetailModalOpen] = useState<boolean>(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

  const openModal = () => {
    window.history.replaceState({}, '', `/posts/${post.id}`);
    setIsPostDetailModalOpen(true);
  };

  const closePostDetailModal = () => {
    window.history.replaceState({}, '', prevUrlRef.current);
    setIsPostDetailModalOpen(false);
  };

  const deletePostHandler = async () => {
    await axios.delete('/api/post', {
      data: {
        postId: post.id,
      },
    });

    router.reload();
  };

  const editPostHandler = async () => {
    if (isPostDetailModalOpen) {
      closePostDetailModal();
    }

    setIsPostModalOpen(true);
  };

  return (
    <>
      <div className="relative h-full w-full hover:cursor-pointer" onClick={openModal}>
        {post.files!.length > 1 && (
          <div className="absolute right-2 top-2 z-10">
            <HiDocumentDuplicate className="h-7 w-7" fill="white" />
          </div>
        )}
        <Image
          src={`${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/posts/${post.files![0].Key}`}
          width={275}
          height={300}
          layout="responsive"
          objectFit="cover"
          alt="userProfile"
        />
      </div>

      {isPostModalOpen && (
        <PostModal
          setIsPostModalOpen={setIsPostModalOpen}
          initialBody={post.body}
          initialFiles={post.files}
          postId={post.id}
        />
      )}

      {isPostDetailModalOpen && (
        <PostDetailModal
          postId={post.id}
          closeModal={closePostDetailModal}
          deletePostHandler={deletePostHandler}
          editPostHandler={editPostHandler}
        />
      )}
    </>
  );
};

export default UserPost;
