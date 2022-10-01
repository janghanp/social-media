import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { postId } = req.query;

    const post = await prisma.post.findUnique({
      where: {
        id: postId as string,
      },
      include: {
        user: true,
      },
    });

    return res.status(200).send(post);
  }
}
