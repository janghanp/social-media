import { NextApiRequest, NextApiResponse } from "next";
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

  if (req.method === "GET") {
    const { postId, currentPage } = req.query;

    try {
      const post = await prisma.post.findFirst({
        where: {
          id: postId as string,
        },
        include: {
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            skip: +currentPage * 20,
            take: 20,
            include: {
              user: true,
            },
          },
        },
      });

      return res.status(200).json({ comments: post?.comments });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong..." });
    }
  }

  if (req.method === "POST") {
    const { postId, comment: body }: { postId: string; comment: string } =
      req.body;

    try {
      const comment = await prisma.comment.create({
        data: {
          comment: body,
          userId: jwt.sub,
          postId,
        },
      });

      const commentWithUser = await prisma.comment.findUnique({
        where: {
          id: comment.id,
        },
        include: {
          user: true,
        },
      });

      return res
        .status(201)
        .json({ message: "Succesfully created!", commentWithUser });
    } catch (err) {
      return res.status(500).json({ message: "Something went wrong..." });
    }
  }
}
