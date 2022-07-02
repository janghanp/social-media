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

  if (req.method === "GET") {
    const { parentId } = req.query;

    try {
      const comment = await prisma.comment.findFirst({
        where: {
          id: parentId as string,
        },
        include: {
          children: {
            include: {
              user: true,
              _count: {
                select: { likedBy: true },
              },
            },
          },
        },
      });

      return res.status(200).json({ commentWithChildren: comment });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong..." });
    }
  }
}
