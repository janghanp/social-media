import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { getToken } from "next-auth/jwt";

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const s3 = new AWS.S3();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ mesage: "Method not allowed" });
  }

  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { type }: { type: string } = req.body;
    const fileExtension = type.split("/")[1];
    const Key = `${uuidv4()}.${fileExtension}`;

    const fileParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `temp/${Key}`,
      Expires: 1 * 60 * 60 * 24,
      ContentType: type,
      ACL: "public-read",
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", fileParams);

    res.status(200).json({ uploadURL, Key });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong please try again..." });
  }
}
