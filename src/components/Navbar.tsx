import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { HiOutlinePlus } from 'react-icons/hi';

import Avatar from './Avatar';
import PostModal from './PostModal';
import { useCurrentUserState } from '../store';

const Navbar = () => {
  const { data: session } = useSession();

  const { setCurrentUser, currentUser } = useCurrentUserState();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = 'hidden';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    }
  }, [isOpen]);

  const signOutHandler = async () => {
    setCurrentUser(null);
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <div className="fixed top-0 z-20 w-full border-b-2 border-primary bg-base-100 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <div className="navbar justify-between bg-base-100 px-5 lg:px-0">
            {/* left */}
            <Link href={'/'}>
              <div className="text-xl font-semibold normal-case hover:cursor-pointer">
                Social Media
              </div>
            </Link>

            {/* right */}
            {session && currentUser ? (
              <div className="flex flex-row items-center justify-center">
                <HiOutlinePlus
                  onClick={() => setIsOpen(true)}
                  className="h-8 w-8 hover:cursor-pointer"
                />
                <Avatar
                  image={currentUser.image}
                  username={currentUser.username}
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
      <PostModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Navbar;
