import { useState, memo } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AiOutlineEllipsis } from 'react-icons/ai';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Post as PostType } from '../types';
import ControlMenu from './ControlMenu';
import PostModal from './PostModal';
import ImageSlide from './ImageSlide';
import Reaction from './Reaction';
import PreviewComments from './PreviewComments';
import { PostProvider } from '../context/postContext';
import PostDetailModal from '../components/PostDetailModal';

dayjs.extend(relativeTime);

interface Props {
  post: PostType;
}

const Post = ({ post }: Props) => {
  const router = useRouter();

  const { data: session } = useSession();

  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [isPostDetailModalOpen, setIsPostDetailModalOpen] = useState<boolean>(false);
  const [isControlMenuOpen, setIsControlMenuOpen] = useState<boolean>(false);

  const avatarClickHandler = () => {
    router.push(`/${post.user.username}`);
  };

  const openPostDetailModal = () => {
    if (!session) {
      router.push('/login');
      return;
    }

    window.history.replaceState({}, '', `/posts/${post.id}`);
    setIsPostDetailModalOpen(true);
  };

  const closePostDetailModal = () => {
    window.history.replaceState({}, '', '/');
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

    setIsControlMenuOpen(false);
    setIsPostModalOpen(true);
  };

  return (
    <PostProvider
      postId={post.id}
      postAuthorId={post.userId}
      initialIsLiked={session ? post.likedByIds.includes(session!.user.id) : false}
      initialLikesCount={post._count.likedBy}
      initialPreviewComments={post.comments}
      initialTotalCommentsCount={post._count.comments}
      initialIsModal={true}
    >
      <div className="relative box-content h-auto w-full rounded-md border border-primary bg-white shadow-xl">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center justify-center gap-x-3">
            <div
              onClick={avatarClickHandler}
              className="avatar overflow-hidden rounded-full hover:cursor-pointer"
            >
              <Image src={post.user.image} width={40} height={40} alt="userImage" />
            </div>
            <span className="text-sm text-gray-500">
              {post.user.username} &nbsp;• &nbsp; {dayjs().to(dayjs(post.createdAt))}
            </span>
          </div>
          {session?.user.id === post.userId && (
            <div
              className="rounded-full p-1 transition duration-300 hover:cursor-pointer hover:bg-gray-200/50"
              onClick={() => setIsControlMenuOpen(true)}
            >
              <AiOutlineEllipsis className="h-6 w-6" />
            </div>
          )}
        </div>
        <ImageSlide files={post.files} />
        <div className="p-3">
          <Reaction openPostDetailModal={openPostDetailModal} />
          <div className="mt-5">
            <span className="mr-3 text-sm font-bold text-primary">{post.user.username}</span>
            <span>{post.body}</span>
          </div>
          <PreviewComments openDetailPostModal={openPostDetailModal} />
        </div>
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

      {isControlMenuOpen && (
        <ControlMenu
          type="post"
          isOwner={session?.user.id === post.userId}
          setIsControlMenuOpen={setIsControlMenuOpen}
          deleteHandler={deletePostHandler}
          editHandler={editPostHandler}
        />
      )}
    </PostProvider>
  );
};

export default memo(Post);
