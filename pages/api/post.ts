import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3";

import { prisma } from "../../lib/prisma";

const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const copyObject = async (key: string) => {
  const input = {
    Bucket: process.env.AWS_S3_BUCKET,
    CopySource: `${process.env.AWS_S3_BUCKET}/temp/${key}`,
    Key: `posts/${key}`,
    ACL: "public-read",
  };

  //Copy images in use into post directory
  const command = new CopyObjectCommand(input);
  await s3.send(command);
};

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
      const {
        body,
        fileInfos,
      }: { body: string; fileInfos: { Key: string; ratio: number }[] } =
        req.body;

      //Copy objects from temp to posts.
      await Promise.all(fileInfos.map((fileInfo) => copyObject(fileInfo.Key)));

      const files = fileInfos.map((fileInfo) => ({
        url: `${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/posts/${fileInfo.Key}`,
        ratio: fileInfo.ratio,
      }));

      //Store file's info(url and aspect) and body into the mongodb.
      await prisma.post.create({
        data: {
          userId: jwt.sub,
          body,
          files,
        },
      });

      res.status(201).json({ message: "Successfully posted!" });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "Something went wrong please try again..." });
    }
  }
}
