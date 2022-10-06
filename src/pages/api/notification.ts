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

  if (req.method === 'GET') {
    const { filter } = req.query;

    try {
      //unread notifications
      if (filter === 'unread') {
        const unReadNotifications = await prisma.notification.findMany({
          where: {
            AND: [
              {
                receiverId: jwt.sub,
              },
              {
                is_read: false,
              },
            ],
          },
        });

        return res.status(200).send(unReadNotifications);
      }

      //All notifications
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
        type,
      }: { senderId: string; receiverId: string; message: string; type: Type } =
        req.body;

      if (type === 'FOLLOW') {
        //Don't send a notification when a user re-follows people.
        const hasSentWithFollow = await prisma.notification.findFirst({
          where: {
            AND: [{ senderId }, { receiverId }, { type: 'FOLLOW' }],
          },
        });

        if (hasSentWithFollow) {
          return res.status(204).json({ message: '' });
        }
      }

      const newNotification = await prisma.notification.create({
        data: {
          senderId,
          receiverId,
          message,
          type,
        },
      });

      return res.status(200).json({ newNotification });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }

  if (req.method === 'PATCH') {
    //read all notifications at once.
    try {
      await prisma.notification.updateMany({
        where: {
          AND: [{ receiverId: jwt.sub }, { is_read: false }],
        },
        data: {
          is_read: true,
        },
      });

      return res.status(200).json({ message: 'Success' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }
}
