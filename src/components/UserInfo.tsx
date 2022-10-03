import { useEffect, useState } from 'react';
import Image from 'next/image';
import { HiUser } from 'react-icons/hi';
import axios from 'axios';

import { User } from '../types';
import { useCurrentUserState } from '../store';
import FriendshipModal from './FriendshipModal';

interface Props {
  postAuthor: User;
  totalPostsCount: number;
}

interface FriendshipModal {
  isOpen: boolean;
  status: 'isFollowing' | 'isFollowedBy' | '';
}

const UserInfo = ({ postAuthor, totalPostsCount }: Props) => {
  const { currentUser, setCurrentUser } = useCurrentUserState((state) => state);

  const [isFllowing, setIsFllowing] = useState<boolean>(
    !!currentUser?.followingIds.find((id) => id === postAuthor.id)
  );

  const [followerCounts, setFollowerCounts] = useState<number>(
    postAuthor._count!.followedBy
  );

  const [followingCounts, setFollowingCounts] = useState<number>(
    postAuthor._count!.following
  );

  const [toggleFriendshipModal, setToggleFriendshipModal] =
    useState<FriendshipModal>({
      isOpen: false,
      status: '',
    });

  useEffect(() => {
    setFollowerCounts(postAuthor._count!.followedBy);
    setFollowingCounts(postAuthor._count!.following);
  }, [postAuthor]);

  const toggleFriendship = async () => {
    let updatedCurrentUser: User;

    if (!isFllowing) {
      const { data } = await axios.patch('/api/followUser', {
        postAuthorId: postAuthor.id,
        currentUserId: currentUser?.id,
      });

      updatedCurrentUser = data;
      setFollowerCounts((prevState) => prevState + 1);
    } else {
      const { data } = await axios.patch('/api/followUser', {
        postAuthorId: postAuthor.id,
        currentUserId: currentUser?.id,
        unfollow: true,
      });

      updatedCurrentUser = data;
      setFollowerCounts((prevState) => prevState - 1);
    }

    setIsFllowing((prevState) => !prevState);
    setCurrentUser(updatedCurrentUser);
  };

  const showFriendshipModal = (status: 'isFollowing' | 'isFollowedBy') => {
    setToggleFriendshipModal({ isOpen: true, status });
  };

  return (
    <>
      <div className="flex h-52 w-full flex-row items-start justify-center gap-x-10 border-b border-gray-300">
        <div className="avatar overflow-hidden rounded-full border">
          <Image
            src={postAuthor!.image}
            width={125}
            height={125}
            alt={postAuthor?.username}
          />
        </div>
        <div className="flex flex-col gap-y-5">
          <div className="flex gap-x-5">
            <div className="text-xl font-semibold">{postAuthor?.username}</div>
            {currentUser?.username !== postAuthor.username && (
              <button
                className="btn btn-outline btn-sm px-10"
                onClick={toggleFriendship}
              >
                {isFllowing ? (
                  <span className="text-sm font-semibold normal-case">
                    Following
                  </span>
                ) : (
                  <HiUser className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
          <div className="flex gap-x-5">
            <span>
              <span className="font-semibold">{totalPostsCount}</span> posts
            </span>
            <span
              onClick={() => showFriendshipModal('isFollowedBy')}
              className="hover:cursor-pointer"
            >
              <span className="font-semibold">{followerCounts}</span> followers
            </span>
            <span
              onClick={() => showFriendshipModal('isFollowing')}
              className="hover:cursor-pointer"
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
          closeFriendshipModal={() =>
            setToggleFriendshipModal({ isOpen: false, status: '' })
          }
        />
      )}
    </>
  );
};

export default UserInfo;
