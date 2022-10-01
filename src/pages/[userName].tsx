import { NextPage, GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';

import { prisma } from '../lib/prisma';
import { Post, User } from '../types';
import UserInfo from '../components/UserInfo';
import UserPosts from '../components/UserPosts';


export const getServerSideProps: GetServerSideProps = async (context) => {
  const jwt = await getToken({ req: context.req, secret: process.env.SECRET });

  if (!jwt) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      username: context.query.userName as string,
    },
  });

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: { user, posts },
  };
};

interface Props {
  posts: Post[];
  user: User;
}

const Profile: NextPage<Props> = ({ user, posts }: Props) => {
  return (
    <>
      <div className="container mx-auto mt-16 flex max-w-4xl flex-col px-2 pt-10 lg:px-0">
        <UserInfo user={user} totalPostsCount={posts.length} />
        <UserPosts posts={posts} />
      </div>
    </>
  );
};

export default Profile;
