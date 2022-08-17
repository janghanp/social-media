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

  if (req.method === 'POST') {
    const { userName }: { userName: string } = req.body;

    try {
      const user = await prisma.user.findFirst({
        where: {
          username: userName,
        },
      });

      if (user) {
        return res
          .status(409)
          .json({ message: 'The user name was already taken.' });
      }

      await prisma.user.update({
        where: {
          id: jwt.sub,
        },
        data: {
          username: userName,
        },
      });

      return res.status(201).json({ message: 'Successfully created!' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }
}
