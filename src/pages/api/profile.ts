import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { prisma } from '../../lib/prisma';

const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'DELETE') {
    const user = await prisma.user.findFirst({
      where: {
        id: jwt?.sub,
      },
    });

    const Key = user?.image?.split('/').pop();

    const input = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `profile/${Key}`,
    };

    const deleteCommand = new DeleteObjectCommand(input);
    s3.send(deleteCommand);

    return res.status(200).json({ message: 'Succesfully deleted' });
  }
}
