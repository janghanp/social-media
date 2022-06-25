import type { NextPage, GetServerSideProps } from "next";
import { Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";
import PostsList from "../components/PostsList";
// import Widget from "../components/Widget";

export interface User {
  id: string;
  name?: string;
  username: string;
  email?: string;
  image: string;
  likedPostsIds: string[];
  likedCommentsIds: string[];
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
  likedByIds: string[];
  _count: { likedBy: number; children: number };
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
  _count: { comments: number; likedBy: number };
  likedByIds: string[];
}

interface Props {
  posts: Post[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  //How to get commentsCount with parentId and without parentId.
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
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
          createdAt: "desc",
        },
        take: 20,
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
  console.log(posts);

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
