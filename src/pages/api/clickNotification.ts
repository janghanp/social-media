import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { prisma } from '../../lib/prisma';
import { Type } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'PATCH') {
    const { notificationId }: { notificationId: string } = req.body;

    try {
      await prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          is_clicked: true,
        },
      });

      return res.status(200).json({ message: 'Success' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }
}
