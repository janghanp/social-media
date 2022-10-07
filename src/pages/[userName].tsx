import { NextPage, GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { getToken } from 'next-auth/jwt';

import { prisma } from '../lib/prisma';
import { Post, User } from '../types';

const DynamicUserInfo = dynamic(() => import('../components/UserInfo'));
const DynamicUserPosts = dynamic(() => import('../components/UserPosts'));

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

  const postAuthor = await prisma.user.findFirst({
    where: {
      username: context.query.userName as string,
    },
    include: {
      _count: {
        select: {
          following: true,
          followedBy: true,
        },
      },
    },
  });

  if (!postAuthor) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: postAuthor.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: { postAuthor, posts },
  };
};

interface Props {
  posts: Post[];
  postAuthor: User;
}

const Profile: NextPage<Props> = ({ postAuthor, posts }: Props) => {
  return (
    <>
      <div className="container mx-auto mt-16 flex max-w-4xl flex-col px-2 pt-10 lg:px-0">
        <DynamicUserInfo
          postAuthor={postAuthor}
          totalPostsCount={posts.length}
        />
        <DynamicUserPosts posts={posts} />
      </div>
    </>
  );
};

export default Profile;
