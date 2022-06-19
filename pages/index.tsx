import type { NextPage, GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";

import PostsList from "../components/PostsList";
import Widget from "../components/Widget";

export interface User {
  id: string;
  name?: string;
  email?: string;
  image: string;
}

export interface Comment {
  id: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  postId: string;
  parentId?: string;
}

export interface File {
  ratio: number;
  Key: string;
}

export interface Post {
  id: string;
  body: string;
  files?: File[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  comments: Comment[];
  _count: { comments: number };
}

interface Props {
  posts: Post[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      _count: {
        select: { comments: true },
      },
      comments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
        include: {
          user: true,
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
