import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

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
    !!currentUser!.followingIds.find((id) => id === friend.id)
  );

  const isMe = friend.id === currentUser!.id;

  const avatarClickHandler = () => {
    closeFriendshipModal();
    router.push(`/${friend.username}`);
  };

  const toggleFriendshipHandler = () => {
    toggleFriendship(currentUser!.id, friend.id, isCurrenUserFollowingThisUser);
    setIsCurrentUserFollowingThisUser((prevState) => !prevState);
  };

  const trimText = (text: string | undefined) => {
    if (text && text.length > 20) {
      const trimmedText = text.slice(0, 20);

      return `${trimmedText} ...`;
    } else {
      return text;
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex">
        <div
          onClick={avatarClickHandler}
          className="avatar h-[42px] flex-none overflow-hidden rounded-full hover:cursor-pointer"
        >
          <Image src={friend.image} width={40} height={40} alt="Image" />
        </div>
        <div className="flex flex-col pl-3">
          <span className="text-sm font-semibold">{trimText(friend.name)}</span>
          <span className="text-sm text-gray-400">{trimText(friend.username)}</span>
        </div>
      </div>
      {isMe ? (
        ''
      ) : (
        <button
          onClick={toggleFriendshipHandler}
          className={`absolute right-5 flex-none rounded-md border-2 border-black px-3 py-[6px] ${
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
