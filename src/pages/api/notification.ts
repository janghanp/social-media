import { NextApiRequest, NextApiResponse } from 'next';
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

  if (req.method === 'GET') {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          receiverId: jwt.sub,
        },
        include: {
          sender: true,
        },
      });

      return res.status(200).send(notifications);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        senderId,
        receiverId,
        message,
      }: { senderId: string; receiverId: string; message: string } = req.body;

      const newNotification = await prisma.notification.create({
        data: {
          senderId,
          receiverId,
          message,
        },
      });

      return res.status(200).json({ newNotification });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }
}
