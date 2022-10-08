import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import Formidable from 'formidable';
import fs from 'fs';

const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function hanlder(req: NextApiRequest, res: NextApiResponse) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const form = Formidable({ multiples: true });

    form.parse(req, (err, fields, files: any) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong...' });
      }

      fs.readFile(files.file.filepath, async (err, file) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Something went wrong...' });
        }

        const type = files.file.mimetype;
        const fileExtension = type.split('/')[1];
        const Key = `${uuidv4()}.${fileExtension}`;

        let input;

        if (fields.isProfile) {
          input = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `profile/${Key}`,
            Body: file,
          };
        } else {
          input = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `temp/${Key}`,
            Body: file,
          };
        }

        const putCommand = new PutObjectCommand(input);

        await s3.send(putCommand);

        return res.status(201).json({ Key });
      });
    });
  }
}
