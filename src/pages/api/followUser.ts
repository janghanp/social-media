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
      requesterId,
      receiverId,
      unfollow,
    }: { requesterId: string; receiverId: string; unfollow: boolean } =
      req.body;

    let updatedCurrentUser: User;

    try {
      if (unfollow) {
        const requester = await prisma.user.findUnique({
          where: {
            id: requesterId,
          },
        });

        updatedCurrentUser = await prisma.user.update({
          where: {
            id: requesterId,
          },
          data: {
            followingIds: {
              set: requester?.followingIds.filter(
                (followingId) => followingId !== receiverId
              ),
            },
          },
        });

        const postAuthor = await prisma.user.findUnique({
          where: {
            id: receiverId,
          },
        });

        await prisma.user.update({
          where: {
            id: receiverId,
          },
          data: {
            followedByIds: {
              set: postAuthor?.followedByIds.filter(
                (followedById) => followedById !== requesterId
              ),
            },
          },
        });
      } else {
        updatedCurrentUser = await prisma.user.update({
          where: {
            id: requesterId,
          },
          data: {
            followingIds: {
              push: receiverId,
            },
          },
        });

        await prisma.user.update({
          where: {
            id: receiverId,
          },
          data: {
            followedByIds: {
              push: requesterId,
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
