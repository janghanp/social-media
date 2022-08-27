import { NextPage, GetServerSideProps } from 'next';
import Image from 'next/image';
import { getToken } from 'next-auth/jwt';
import { HiUser, HiDocumentDuplicate } from 'react-icons/hi';

import { prisma } from '../lib/prisma';
import { Post } from '../types';
import { useCurrentUserState } from '../store';

interface Props {
  posts: Post[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const jwt = await getToken({ req: context.req, secret: process.env.SECRET });

  if (!jwt) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: jwt.sub,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: { posts },
  };
};

const Profile: NextPage<Props> = ({ posts }) => {
  const currentUser = useCurrentUserState((state) => state.currentUser);

  return (
    <div className="container mx-auto mt-16 flex min-h-screen max-w-4xl flex-col  px-2 pt-10 lg:px-0">
      <div className="flex h-52 w-full flex-row items-start justify-center gap-x-10 border-b border-gray-300">
        <div className="avatar overflow-hidden rounded-full border">
          <Image
            src={currentUser!.image}
            width={125}
            height={125}
            alt={currentUser?.username}
          />
        </div>
        <div className="flex flex-col gap-y-5">
          <div className="flex gap-x-5">
            <div className="text-xl font-semibold">{currentUser?.username}</div>
            <button className="btn btn-outline btn-sm">Message</button>
            <button className="btn btn-outline btn-sm px-10">
              <HiUser className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-x-5">
            <span>
              <span className="font-semibold">{posts.length}</span> posts
            </span>
            <span>
              <span className="font-semibold">100</span> followers
            </span>
            <span>
              <span className="font-semibold">100</span> following
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 pt-10">
        {posts.map((post) => {
          return (
            <div key={post.id} className="relative h-full w-full">
              {post.files!.length > 1 && (
                <div className="absolute top-2 right-2 z-10">
                  <HiDocumentDuplicate className="h-7 w-7" fill="white" />
                </div>
              )}
              <Image
                src={`${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/posts/${
                  post.files![0].Key
                }`}
                width={275}
                height={300}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
