import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (req.method === 'GET') {
    if (jwt) {
      const user = await prisma.user.findFirst({
        where: {
          id: jwt?.sub,
        },
      });

      return res.status(200).json({ user });
    }
  }

  if (req.method === 'PATCH') {
    const { imageUrl }: { imageUrl: string } = req.body;

    if (jwt) {
      const user = await prisma.user.update({
        where: {
          id: jwt?.sub,
        },
        data: {
          image: imageUrl,
        },
      });

      return res.status(200).json({ user });
    }
  }

  if (req.method === 'PUT') {
    const { name, userName }: { name: string; userName: string } = req.body;

    try {
      const user = await prisma.user.findFirst({
        where: {
          username: userName,
          NOT: {
            id: jwt?.sub,
          },
        },
      });

      if (user) {
        return res
          .status(400)
          .json({ message: 'This username is already taken.' });
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: jwt?.sub,
        },
        data: {
          name,
          username: userName,
        },
      });

      return res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }
}
