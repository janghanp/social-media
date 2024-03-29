import { useEffect, useState } from 'react';
import Image from 'next/image';
import { HiUser } from 'react-icons/hi';
import axios from 'axios';

import { User } from '../types';
import { useCurrentUserState } from '../store';
import FriendshipModal from './FriendshipModal';
import { sendNotification } from '../lib/sendNotification';

interface Props {
  postAuthor: User;
  totalPostsCount: number;
}

interface FriendshipModalType {
  isOpen: boolean;
  status: 'isFollowing' | 'isFollowedBy' | '';
}

const UserInfo = ({ postAuthor, totalPostsCount }: Props) => {
  const { currentUser, setCurrentUser } = useCurrentUserState((state) => state);

  const [isFollowing, setIsFollowing] = useState<boolean>(
    !!currentUser?.followingIds.find((id) => id === postAuthor.id)
  );
  const [followerCounts, setFollowerCounts] = useState<number>(postAuthor._count!.followedBy);
  const [followingCounts, setFollowingCounts] = useState<number>(postAuthor._count!.following);
  const [toggleFriendshipModal, setToggleFriendshipModal] = useState<FriendshipModalType>({
    isOpen: false,
    status: '',
  });

  useEffect(() => {
    setFollowerCounts(postAuthor._count!.followedBy);
    setFollowingCounts(postAuthor._count!.following);
  }, [postAuthor]);

  useEffect(() => {
    setIsFollowing(!!currentUser?.followingIds.find((id) => id === postAuthor.id));
  }, [postAuthor.id, currentUser?.followingIds]);

  const toggleFriendship = async (
    requesterId: string,
    receiverId: string,
    isFollowing: boolean
  ) => {
    let updatedCurrentUser: User;

    if (!isFollowing) {
      const { data } = await axios.patch('/api/followUser', {
        receiverId,
        requesterId,
      });

      sendNotification(
        requesterId,
        receiverId,
        'FOLLOW',
        `${window.location.origin}/${currentUser?.username}`,
        undefined,
        undefined
      );

      updatedCurrentUser = data;

      if (postAuthor.id === currentUser!.id) {
        setFollowingCounts((prevState) => prevState + 1);
      } else if (receiverId === postAuthor.id) {
        setFollowerCounts((prevState) => prevState + 1);
        setIsFollowing((prevState) => !prevState);
      }
    } else {
      const { data } = await axios.patch('/api/followUser', {
        receiverId,
        requesterId,
        unfollow: true,
      });

      updatedCurrentUser = data;

      if (postAuthor.id === currentUser!.id) {
        setFollowingCounts((prevState) => prevState - 1);
      } else if (receiverId === postAuthor.id) {
        setFollowerCounts((prevState) => prevState - 1);
        setIsFollowing((prevState) => !prevState);
      }
    }

    setCurrentUser(updatedCurrentUser);
  };

  const showFriendshipModal = (status: 'isFollowing' | 'isFollowedBy') => {
    setToggleFriendshipModal({ isOpen: true, status });
  };

  return (
    <>
      <div className="flex h-36 w-full flex-row items-start justify-center gap-x-5 border-b border-gray-300 sm:h-52 sm:gap-x-10">
        <div className="avatar h-20 w-20 flex-none overflow-hidden rounded-full border sm:h-[125px] sm:w-[125px]">
          <Image
            src={postAuthor!.image}
            width={125}
            height={125}
            alt={postAuthor?.username}
            layout="intrinsic"
          />
        </div>
        <div className="flex flex-col gap-y-5">
          <div className="flex gap-x-5">
            <div className="text-xl font-semibold">{postAuthor?.username}</div>
            {currentUser?.username !== postAuthor.username && (
              <button
                className={`btn ${!isFollowing && 'btn-outline'} btn-sm px-10`}
                onClick={() => toggleFriendship(currentUser!.id, postAuthor.id, isFollowing)}
              >
                {isFollowing ? (
                  <span className="text-sm font-semibold normal-case">Following</span>
                ) : (
                  <HiUser className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
          <div className="flex gap-x-5 text-sm sm:text-base">
            <span className="text-center">
              <span className="font-semibold">{totalPostsCount}</span> posts
            </span>
            <span
              onClick={() => showFriendshipModal('isFollowedBy')}
              className="text-center hover:cursor-pointer"
            >
              <span className="font-semibold">{followerCounts}</span> followers
            </span>
            <span
              onClick={() => showFriendshipModal('isFollowing')}
              className="text-center hover:cursor-pointer"
            >
              <span className="font-semibold">{followingCounts}</span> following
            </span>
          </div>
        </div>
      </div>

      {toggleFriendshipModal.isOpen && (
        <FriendshipModal
          postAuthorId={postAuthor.id}
          status={toggleFriendshipModal.status}
          closeFriendshipModal={() => setToggleFriendshipModal({ isOpen: false, status: '' })}
          toggleFriendship={toggleFriendship}
        />
      )}
    </>
  );
};

export default UserInfo;
