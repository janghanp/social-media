import { AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { usePostContext } from '../context/postContext';

interface Props {
  openPostDetailModal: () => void;
}

const Reaction = ({ openPostDetailModal }: Props) => {
  const router = useRouter();

  const { data: session } = useSession();

  const {
    totalCommentsCount,
    isLiked,
    totalLikesCount,
    postId,
    setIsLiked,
    setTotalLikesCount,
  } = usePostContext();

  const likePostHandler = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsLiked((prevState) => !prevState);
    setTotalLikesCount((prevState) => {
      if (isLiked) {
        return prevState - 1;
      }

      return prevState + 1;
    });

    await axios.post('/api/likePost', {
      userId: session!.user.id,
      postId,
      dislike: isLiked,
    });
  };

  return (
    <div className="flex items-center justify-start space-x-1">
      <div
        onClick={likePostHandler}
        className="flex items-center justify-center space-x-2 rounded-lg px-2 py-1 transition duration-200 hover:cursor-pointer hover:bg-gray-300/50"
      >
        <AiOutlineHeart
          className={`h-6 w-6 ${isLiked ? 'fill-red-500' : ''}`}
        />
        <span>{totalLikesCount}</span>
      </div>
      <div
        className="flex items-center justify-center space-x-2 rounded-lg px-2 py-1 transition duration-200 hover:cursor-pointer hover:bg-gray-300/50"
        onClick={openPostDetailModal}
      >
        <AiOutlineMessage className="h-6 w-6" />
        <span>{totalCommentsCount}</span>
      </div>
    </div>
  );
};

export default Reaction;
