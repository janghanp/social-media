import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { prisma } from '../../lib/prisma';

export default async function hanlder(req: NextApiRequest, res: NextApiResponse) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const {
      userId,
      parentId,
      comment,
      postId,
      mentionUser,
    }: {
      userId: string;
      parentId: string;
      comment: string;
      postId: string;
      mentionUser: string;
    } = req.body;

    try {
      const user = await prisma.user.findFirst({
        where: {
          username: mentionUser,
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Couldn't find the user" });
      }

      const newComment = await prisma.comment.create({
        data: {
          userId,
          comment,
          parentId,
          postId,
          mentionUser,
        },
      });

      const newCommentWithUser = await prisma.comment.findFirst({
        where: {
          id: newComment.id,
        },
        include: {
          user: true,
        },
      });

      return res.status(201).json({ message: 'Successfully created', newCommentWithUser });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }
}
