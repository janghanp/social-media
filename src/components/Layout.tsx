import React, { useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import Navbar from './Navbar';
import { useCurrentUserState } from '../store';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const router = useRouter();

  const { status, data: session } = useSession();

  const { setCurrentUser, currentUser } = useCurrentUserState();

  const checkUserNameRef = useRef<boolean>(false);

  useEffect(() => {
    if (session) {
      axios
        .get('/api/user')
        .then((res) => {
          setCurrentUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [status]);

  if (status === 'loading' || (session && !currentUser)) {
    return <></>;
  }

  if (!checkUserNameRef.current && currentUser && !currentUser.username) {
    checkUserNameRef.current = true;

    router.push('/welcome');
  }

  return (
    <>
      <Head>
        <title>Social Media</title>
      </Head>
      <Navbar />
      <main className="bg-gray-50/50 min-h-screen">{children}</main>
    </>
  );
};

export default Layout;
