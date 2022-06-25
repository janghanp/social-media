import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { prisma } from "../../lib/prisma";

export default async function hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    const {
      userId,
      parentId,
      comment,
      postId,
    }: { userId: string; parentId: string; comment: string; postId: string } =
      req.body;

    try {
      await prisma.comment.create({
        data: {
          userId,
          comment,
          parentId,
          postId,
        },
      });

      return res.status(201).json({ message: "Successfully created" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong..." });
    }
  }
}
