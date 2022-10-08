import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { User } from '../types';
import { useCurrentUserState } from '../store';

interface Props {
  friend: User;
  closeFriendshipModal: () => void;
  toggleFriendship: (requesterId: string, receiverId: string, isFollowing: boolean) => void;
}

const Friend = ({ friend, closeFriendshipModal, toggleFriendship }: Props) => {
  const router = useRouter();

  const currentUser = useCurrentUserState((state) => state.currentUser);

  const [isCurrenUserFollowingThisUser, setIsCurrentUserFollowingThisUser] = useState<boolean>(
    !!friend.followedByIds.find((id) => id === currentUser!.id)
  );

  useEffect(() => {
    setIsCurrentUserFollowingThisUser(!!friend.followedByIds.find((id) => id === currentUser!.id));
  }, [friend.followedByIds, currentUser]);

  const isMe = friend.id === currentUser!.id;

  const avatarClickHandler = () => {
    closeFriendshipModal();
    router.push(`/${friend.username}`);
  };

  const toggleFriendshipHandler = () => {
    toggleFriendship(currentUser!.id, friend.id, isCurrenUserFollowingThisUser);
    setIsCurrentUserFollowingThisUser((prevState) => !prevState);
  };

  return (
    <div className="flex w-full items-center justify-between">
      {/* user info */}
      <div className="flex">
        <div
          onClick={avatarClickHandler}
          className="avatar overflow-hidden rounded-full hover:cursor-pointer"
        >
          <Image src={friend.image} width={40} height={40} alt="Image" />
        </div>
        <div className="flex flex-col pl-3">
          <span className="text-sm font-semibold">{friend.name}</span>
          <span className="text-sm text-gray-400">{friend.username}</span>
        </div>
      </div>

      {/* button */}
      {isMe ? (
        ''
      ) : (
        <button
          onClick={toggleFriendshipHandler}
          className={`rounded-md border-2 border-black px-3 py-1 ${
            !isCurrenUserFollowingThisUser ? 'bg-white text-black' : 'bg-black text-white'
          }`}
        >
          <span className="text-sm font-semibold">
            {isCurrenUserFollowingThisUser ? 'Following' : 'Follow'}
          </span>
        </button>
      )}
    </div>
  );
};

export default Friend;
