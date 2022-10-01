import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AiOutlineEllipsis } from 'react-icons/ai';

import { Post as PostType } from '../types';
import ControlMenu from './ControlMenu';
import PostModal from './PostModal';
import ImageSlide from './ImageSlide';
import { preventScroll } from '../lib/preventScroll';
import Reaction from './Reaction';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
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

  const [togglePostDetailModal, setTogglePostDetailModal] =
    useState<boolean>(false);
  const [toggleControlMenu, setToggleControlMenu] = useState<boolean>(false);
  const [togglePostModal, setTogglePostModal] = useState<boolean>(false);

  useEffect(() => {
    preventScroll(!!router.query.postId, toggleControlMenu);
  }, [router.query.postId, toggleControlMenu]);

  const deletePostHandler = async () => {
    await axios.delete('/api/post', {
      data: {
        postId: post.id,
      },
    });

    router.reload();
  };

  const editPostHandler = async () => {
    setToggleControlMenu(false);
    setTogglePostModal(true);
  };

  const avatarClickHandler = () => {
    router.push(
      {
        pathname: `/${post.user.username}`,
        query: { userId: post.user.id },
      },
      `/${post.user.username}`
    );
  };

  const openPostDetailModal = () => {
    window.history.replaceState({}, '', `/posts/${post.id}`)
    setTogglePostDetailModal(true);
  }

  const closePostDetailModal = () => {
    window.history.replaceState({}, '', '/');
    setTogglePostDetailModal(false);
  };

  return (
    <PostProvider
      postId={post.id}
      postAuthorId={post.userId}
      initialIsLiked={
        session ? post.likedByIds.includes(session!.user.id) : false
      }
      initialLikesCount={post._count.likedBy}
      initialPreviewComments={post.comments}
      initialTotalCommentsCount={post._count.comments}
    >
      <div className="relative box-content h-auto w-full max-w-[470px] rounded-md border border-primary bg-white shadow-xl">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center justify-center gap-x-3">
            <div
              onClick={avatarClickHandler}
              className="avatar overflow-hidden rounded-full hover:cursor-pointer"
            >
              <Image src={post.user.image} width={40} height={40} alt="Test" />
            </div>
            <span className="text-sm lowercase text-gray-500">
              {post.user.username} &nbsp;• &nbsp;{' '}
              {dayjs().to(dayjs(post.createdAt))}
            </span>
          </div>
          {session?.user.id === post.userId && (
            <div
              className="rounded-full p-1 transition duration-300 hover:cursor-pointer hover:bg-gray-200/50"
              onClick={() => setToggleControlMenu(true)}
            >
              <AiOutlineEllipsis className="h-6 w-6" />
            </div>
          )}
        </div>
        <ImageSlide files={post.files} />
        <div className="p-3">
          <Reaction openPostDetailModal={openPostDetailModal} />
          <div className="mt-5">
            <span className="mr-3 text-sm font-bold text-primary">
              {post.user.username}
            </span>
            <span>{post.body}</span>
          </div>
          <PreviewComments openDetailPostModal={openPostDetailModal} />
        </div>
      </div>

      {togglePostDetailModal && (
        <PostDetailModal postId={post.id} closeModal={closePostDetailModal} />
      )}

      <ControlMenu
        type="post"
        isOpen={toggleControlMenu}
        isOwner={session?.user.id === post.userId}
        setToggleControlMenu={setToggleControlMenu}
        deleteHandler={deletePostHandler}
        editHandler={editPostHandler}
      />

      <PostModal
        isOpen={togglePostModal}
        setIsOpen={setTogglePostModal}
        initialBody={post.body}
        initialFiles={post.files}
        postId={post.id}
      />
    </PostProvider>
  );
};

export default memo(Post);
