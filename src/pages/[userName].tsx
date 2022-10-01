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

  const postAuthor = await prisma.user.findFirst({
    where: {
      username: context.query.userName as string,
    },
    include: {
      following: true,
      followedBy: true,
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
        <UserInfo postAuthor={postAuthor} totalPostsCount={posts.length} />
        <UserPosts posts={posts} />
      </div>
    </>
  );
};

export default Profile;
