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
  id: String;
  comment: String;
  createdAt: Date;
  updatedAt: Date;
  userId: String;
  user: User;
  postId: String;
  parentId: String;
}

export interface File {
  url: string;
  ratio: number;
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
      comments: {
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
