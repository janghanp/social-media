import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { postId, currentPage, skip = 0 } = req.query;

    try {
      const post = await prisma.post.findFirst({
        where: {
          id: postId as string,
        },
        include: {
          comments: {
            where: {
              parent: null,
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip: (+currentPage - 1) * 20 + +skip,
            take: 20,
            include: {
              user: true,
              _count: {
                select: {
                  children: true,
                  likedBy: true,
                },
              },
            },
          },
        },
      });

      return res.status(200).send(post?.comments);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }

  if (req.method === 'POST') {
    const { postId, comment: body }: { postId: string; comment: string } = req.body;

    try {
      const comment = await prisma.comment.create({
        data: {
          comment: body,
          userId: jwt.sub,
          postId,
        },
      });

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          parentCommentsCount: {
            increment: 1,
          },
        },
      });

      const commentWithUser = await prisma.comment.findUnique({
        where: {
          id: comment.id,
        },
        include: {
          user: true,
          children: true,
          _count: {
            select: {
              children: true,
              likedBy: true,
            },
          },
        },
      });

      return res.status(201).json({
        message: 'Successfully created!',
        newComment: commentWithUser,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }

  if (req.method === 'DELETE') {
    const { commentId, postId, isChild }: { commentId: string; postId: string; isChild: boolean } =
      req.body;

    try {
      if (isChild) {
        await prisma.comment.delete({
          where: {
            id: commentId,
          },
        });

        return res.status(200).json({ message: 'Successfully deleted' });
      }

      await prisma.comment.deleteMany({
        where: {
          parentId: commentId,
        },
      });

      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          parentCommentsCount: {
            decrement: 1,
          },
        },
      });

      return res.status(200).json({ message: 'Successfully deleted' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }

  if (req.method === 'PUT') {
    const { commentId, comment }: { commentId: string; comment: string } = req.body;

    try {
      const updatedComment = await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          comment,
        },
        include: {
          user: true,
          _count: {
            select: {
              children: true,
              likedBy: true,
            },
          },
        },
      });

      return res.status(200).json({ message: 'Successfully updated', updatedComment });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong...' });
    }
  }
}
