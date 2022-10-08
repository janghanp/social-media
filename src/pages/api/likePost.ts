import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { userId, postId, dislike }: { userId: string; postId: string; dislike: boolean } =
      req.body;

    try {
      if (dislike) {
        const user = await prisma.user.findFirst({
          where: {
            id: userId,
          },
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            likedPostsIds: {
              set: user?.likedPostsIds.filter((likedPostId) => likedPostId !== postId),
            },
          },
        });

        const post = await prisma.post.findFirst({
          where: {
            id: postId,
          },
        });

        await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            likedByIds: {
              set: post?.likedByIds.filter((likedById) => likedById !== userId),
            },
          },
        });

        return res.status(204).json({ mesasge: 'Successfully updated' });
      }

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likedPostsIds: {
            push: postId,
          },
        },
      });

      console.log(user);

      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likedByIds: {
            push: userId,
          },
        },
      });

      console.log(post);

      return res.status(204).json({ mesasge: 'Successfully updated' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }
}
