import { NextPage, GetServerSideProps } from 'next';

import { prisma } from '../lib/prisma';
import { Post } from '../types';
import PostsList from '../components/PostsList';

interface Props {
  posts: Post[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const posts = await prisma.post.findMany({
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
    props: { posts },
  };
};

const Home: NextPage<Props> = ({ posts }: Props) => {
  return (
    <div className="container mx-auto mt-16 flex min-h-screen max-w-4xl flex-row border px-2 pt-10 lg:px-0">
      <section className="w-full lg:w-3/5">
        <PostsList posts={posts} />
      </section>
      {/* <section className="hidden w-2/5 lg:block">
        <Widget />
      </section> */}
    </div>
  );
};

export default Home;
