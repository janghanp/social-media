import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'PATCH') {
    const {
      postAuthorId,
      currentUserId,
      unfollow,
    }: { postAuthorId: string; currentUserId: string; unfollow: boolean } =
      req.body;

    let updatedCurrentUser: User;

    try {
      if (unfollow) {
        const currentUser = await prisma.user.findUnique({
          where: {
            id: currentUserId,
          },
        });

        updatedCurrentUser = await prisma.user.update({
          where: {
            id: currentUserId,
          },
          data: {
            followingIds: {
              set: currentUser?.followingIds.filter(
                (followingId) => followingId !== postAuthorId
              ),
            },
          },
        });

        const postAuthor = await prisma.user.findUnique({
          where: {
            id: postAuthorId,
          },
        });

        await prisma.user.update({
          where: {
            id: postAuthorId,
          },
          data: {
            followedByIds: {
              set: postAuthor?.followedByIds.filter(
                (followedById) => followedById !== currentUserId
              ),
            },
          },
        });
      } else {
        updatedCurrentUser = await prisma.user.update({
          where: {
            id: currentUserId,
          },
          data: {
            followingIds: {
              push: postAuthorId,
            },
          },
        });

        await prisma.user.update({
          where: {
            id: postAuthorId,
          },
          data: {
            followedByIds: {
              push: currentUserId,
            },
          },
        });
      }

      return res.status(200).send(updatedCurrentUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }
}
