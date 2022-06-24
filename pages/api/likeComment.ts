import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    const {
      commentId,
      userId,
      dislike,
    }: { commentId: string; userId: string; dislike: boolean } = req.body;

    try {
      if (dislike) {
        const user = await prisma.user.findFirst({
          where: {
            id: userId,
          },
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            likedCommentsIds: {
              set: user?.likedCommentsIds.filter(
                (likedCommentId) => likedCommentId !== commentId
              ),
            },
          },
        });

        const comment = await prisma.comment.findFirst({
          where: {
            id: commentId,
          },
        });

        await prisma.comment.update({
          where: {
            id: commentId,
          },
          data: {
            likedByIds: {
              set: comment?.likedByIds.filter(
                (likedById) => likedById !== userId
              ),
            },
          },
        });

        return res.status(204).json({ message: "Successfully updated" });
      }

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likedCommentsIds: {
            push: commentId,
          },
        },
      });

      console.log(user);

      const comment = await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likedByIds: {
            push: userId,
          },
        },
      });

      console.log(comment);

      return res.status(204).json({ message: "Successfully updated" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong..." });
    }
  }
}
