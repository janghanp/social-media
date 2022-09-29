import { NextPage, GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';

import { prisma } from '../lib/prisma';
import { Post, User } from '../types';
import UserInfo from '../components/UserInfo';
import UserPosts from '../components/UserPosts';

interface Props {
  posts: Post[];
  user: User;
}

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
    include: {
      user: true,
      _count: {
        select: { comments: true, likedBy: true },
      },
      comments: {
        where: {
          parent: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 2,
        include: {
          user: true,
          _count: {
            select: { likedBy: true, children: true },
          },
        },
      },
    },
  });

  return {
    props: { user, posts },
  };
};

const Profile: NextPage<Props> = ({ user, posts }: Props) => {
  return (
    <div className="container mx-auto mt-16 flex min-h-screen max-w-4xl flex-col px-2 pt-10 lg:px-0">
      <UserInfo user={user} totalPostsCount={posts.length} />
      <UserPosts posts={posts} />
    </div>
  );
};

export default Profile;
