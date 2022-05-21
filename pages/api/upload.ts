import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getToken } from "next-auth/jwt";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const jwt = await getToken({ req, secret: process.env.SECRET });

    if (!jwt) {
      res.status(500).json({ message: "Something went wrong..." });
    }

    try {
      const form = formidable();

      form.parse(req, async (err, fields, files: any) => {
        if (err || !files.file) {
          res.status(400).json({ message: "No file uploaded..." });
        }

        const input = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: files.file.originalFilename,
          Body: fs.createReadStream(files.file.filepath),
        };

        const command = new PutObjectCommand(input);

        const response = await s3.send(command);

        console.log(response);

        res.status(201).json({ message: "Successfully uploaded!" });
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "Somethig went wrong please try again...." });
    }
  }
}
