import { NextPage, GetServerSideProps } from 'next';

import { prisma } from '../lib/prisma';
import { Post } from '../types';
import PostsList from '../components/PostsList';
import { useRouter } from 'next/router';
import PostDetailModal from '../components/PostDetailModal';

interface Props {
  initialPosts: Post[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
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
    props: { initialPosts: posts },
  };
};

const Home: NextPage<Props> = ({ initialPosts }: Props) => {
  const router = useRouter();

  const closeModal = () => {
    router.replace('/', undefined, { shallow: true });
  };

  return (
    <>
      <div className="container mx-auto mt-16 flex min-h-screen max-w-4xl flex-row  px-2 pt-10 lg:px-0">
        <section className="flex w-full lg:w-3/5">
          <PostsList initialPosts={initialPosts} />
        </section>
      </div>

      {router.query.postId && (
        <PostDetailModal
          postId={router.query.postId as string}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default Home;
