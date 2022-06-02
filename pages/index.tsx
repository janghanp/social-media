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

export interface Post {
  id: string;
  body: string;
  files?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
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
    },
  });

  return {
    props: { posts },
  };
};

const Home: NextPage<Props> = ({ posts }: Props) => {
  return (
    <div className="container mx-auto max-w-4xl flex flex-row border min-h-screen px-5 lg:px-0 mt-16">
      <section className="w-4/5 p-5">
        <PostsList posts={posts} />
      </section>
      <section className="w-2/5 p-5">
        <Widget />
      </section>
    </div>
  );
};

export default Home;
