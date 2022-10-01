import Image from 'next/image';
import { HiUser } from 'react-icons/hi';
import axios from 'axios';

import { User } from '../types';
import { useCurrentUserState } from '../store';
import { useState } from 'react';

interface Props {
  postAuthor: User;
  totalPostsCount: number;
}

const UserInfo = ({ postAuthor, totalPostsCount }: Props) => {
  //How to deal with followerCounts and followingCounts in optimistic way.
  //maybe fetch the postAuthor from this component directly.
  const { currentUser, setCurrentUser } = useCurrentUserState((state) => state);

  const [isFllowing, setIsFllowing] = useState<boolean>(
    !!currentUser?.followingIds.find((id) => id === postAuthor.id)
  );

  // const [followerCounts, setFollowerCounts] = useState<number>(
  //   postAuthor.followedByIds.length
  // );

  // const [followingCounts, setFollowingCounts] = useState<number>(
  //   postAuthor.followingIds.length
  // );

  const toggleFollowUser = async () => {
    let updatedCurrentUser: User;

    if (!isFllowing) {
      const { data } = await axios.patch('/api/followUser', {
        postAuthorId: postAuthor.id,
        currentUserId: currentUser?.id,
      });

      updatedCurrentUser = data;
      // setFollowerCounts((prevState) => prevState + 1);
    } else {
      const { data } = await axios.patch('/api/followUser', {
        postAuthorId: postAuthor.id,
        currentUserId: currentUser?.id,
        unfollow: true,
      });

      updatedCurrentUser = data;
      // setFollowerCounts((prevState) => prevState - 1);
    }

    setIsFllowing((prevState) => !prevState);
    setCurrentUser(updatedCurrentUser);
  };

  return (
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
              onClick={toggleFollowUser}
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
          <span>
            <span className="font-semibold">{postAuthor.followedByIds.length}</span> followers
          </span>
          <span>
            <span className="font-semibold">{postAuthor.followingIds.length}</span> following
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
