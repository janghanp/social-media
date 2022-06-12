import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const jwt = await getToken({ req, secret: process.env.SECRET });

    if (!jwt) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      //Create a comment
      await prisma.comment.create({
        data: {
          comment: req.body.comment,
          userId: jwt.sub,
          postId: req.body.postId,
        },
      });

      return res.status(201).json({ message: "Succesfully created!" });
    } catch (err) {
      return res.status(500).json({ message: "Something went wrong..." });
    }
  }
}
