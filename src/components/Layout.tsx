import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Navbar from './Navbar';
import useUser from '../hooks/useUser';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const router = useRouter();

  const { status } = useSession();

  const { currentUser, isError } = useUser();

  const userNameCheckedRef = useRef<boolean>(false);

  if (status === 'loading' || !currentUser) {
    return <></>;
  }

  if (isError) {
    return <div>An error has ocuurred...</div>;
  }

  if (
    !userNameCheckedRef.current &&
    currentUser.user &&
    !currentUser.user.username
  ) {
    userNameCheckedRef.current = true;

    router.push('/welcome');
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50/50">{children}</main>
    </>
  );
};

export default Layout;
