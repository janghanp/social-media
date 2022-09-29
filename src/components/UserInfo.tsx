import Image from 'next/image';
import { HiUser } from 'react-icons/hi';
import { useCurrentUserState } from '../store';

import { User } from '../types';

interface Props {
  user: User;
  totalPostsCount: number;
}

const UserInfo = ({ user, totalPostsCount }: Props) => {
  const currentUser = useCurrentUserState((state) => state.currentUser);

  return (
    <div className="flex h-52 w-full flex-row items-start justify-center gap-x-10 border-b border-gray-300">
      <div className="avatar overflow-hidden rounded-full border">
        <Image
          src={user!.image}
          width={125}
          height={125}
          alt={user?.username}
        />
      </div>
      <div className="flex flex-col gap-y-5">
        <div className="flex gap-x-5">
          <div className="text-xl font-semibold">{user?.username}</div>
          {/* <button className="btn btn-outline btn-sm">Message</button> */}
          {currentUser?.username !== user.username && (
            <button className="btn btn-outline btn-sm px-10">
              <HiUser className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="flex gap-x-5">
          <span>
            <span className="font-semibold">{totalPostsCount}</span> posts
          </span>
          <span>
            <span className="font-semibold">100</span> followers
          </span>
          <span>
            <span className="font-semibold">100</span> following
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
