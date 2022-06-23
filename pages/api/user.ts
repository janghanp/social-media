import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const jwt = await getToken({ req, secret: process.env.SECRET });

    const user = await prisma.user.findFirst({
      where: {
        id: jwt?.sub,
      },
    });

    return res.status(200).json({ user });
  }
}
