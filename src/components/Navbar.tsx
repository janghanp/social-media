import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { HiOutlinePlus } from 'react-icons/hi';
import dynamic from 'next/dynamic';

import Avatar from './Avatar';
import { useCurrentUserState } from '../store';

const DynamicPostModal = dynamic(() => import('../components/PostModal'));
const DynamicNotification = dynamic(() => import('../components/Notification'));

const Navbar = () => {
  const { data: session } = useSession();

  const { setCurrentUser, currentUser } = useCurrentUserState();

  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

  const isLoggedIn = session && currentUser ? true : false;

  const signOutHandler = async () => {
    setCurrentUser(null);
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <div className="fixed top-0 z-20 w-full border-b-2 border-primary bg-base-100 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <div className="navbar justify-between bg-base-100 px-5 lg:px-0">
            <Link href={'/'}>
              <div className="text-xl font-semibold normal-case hover:cursor-pointer">
                Social Media
              </div>
            </Link>
            {isLoggedIn ? (
              <div className="flex flex-row items-center justify-center">
                <HiOutlinePlus
                  onClick={() => setIsPostModalOpen(true)}
                  className="h-8 w-8 hover:cursor-pointer"
                />
                <DynamicNotification />
                <Avatar
                  userId={currentUser!.id}
                  userImage={currentUser!.image}
                  userName={currentUser!.username}
                  signout={signOutHandler}
                />
              </div>
            ) : (
              <div className="flex flex-row">
                <Link href={'/login'}>
                  <div className="btn btn-ghost">log in</div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {isPostModalOpen && (
        <DynamicPostModal setIsPostModalOpen={setIsPostModalOpen} />
      )}
    </>
  );
};

export default Navbar;
