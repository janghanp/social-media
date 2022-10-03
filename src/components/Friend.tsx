import Image from 'next/image';
import { useRouter } from 'next/router';

import { User } from '../types';

interface Props {
  friend: User;
  closeFriendshipModal: () => void;
}

const Friend = ({ friend, closeFriendshipModal }: Props) => {
  const router = useRouter();

  const avatarClickHandler = () => {
    closeFriendshipModal();
    router.push(`/${friend.username}`);
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
      <button className="btn btn-outline btn-sm px-10">test</button>
    </div>
  );
};

export default Friend;
