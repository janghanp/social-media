import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const jwt = await getToken({ req, secret: process.env.SECRET });

    const post = await prisma.post.create({
      data: {
        body: req.body.body,
        userId: jwt ? jwt.sub : "",
      },
    });

    res.status(201).json({ data: post });
  }
}