import { GetServerSideProps } from 'next';

import { prisma } from '../../lib/prisma';
import { Post } from '../../types';
import UserPosts from '../../components/UserPosts';
import MainPostDetail from '../../components/MainPostDetail';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const mainPost = await prisma.post.findUnique({
    where: {
      id: context.query.postId as string,
    },
    include: {
      user: true,
    },
  });

  if (!mainPost) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: mainPost.userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: { mainPost, posts },
  };
};

interface Props {
  posts: Post[];
  mainPost: Post;
}

const PostDetailPage = ({ mainPost, posts }: Props) => {
  return (
    <>
      <div className="container mx-auto mt-16 flex min-h-screen max-w-4xl flex-col px-2 pt-10 lg:px-0">
        <MainPostDetail mainPost={mainPost} />
        <UserPosts posts={posts} />
      </div>
    </>
  );
};

export default PostDetailPage;
