import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { status, postAuthorId } = req.query;

    let friendsList;

    try {
      if (status === 'isFollowing') {
        //users that the postAuthor is following to
        friendsList = await prisma.user.findMany({
          where: {
            followedByIds: {
              has: postAuthorId as string,
            },
          },
        });
      } else {
        //users following the postAuthor
        friendsList = await prisma.user.findMany({
          where: {
            followingIds: {
              has: postAuthorId as string,
            },
          },
        });
      }

      return res.status(200).send(friendsList);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }
}
