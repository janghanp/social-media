import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const jwt = await getToken({ req, secret: process.env.SECRET });

    if (!jwt) {
      res.status(500).json({ message: "Something went wrong..." });
    }

    const { body, fileUrls } = req.body;

    console.log(body);
    console.log(fileUrls);

    // const post = await prisma.post.create({
    //   data: {
    //     body: req.body.body,
    //     userId: jwt!.sub,
    //   },
    // });

    // res.status(201).json({ data: post });
  }
}
