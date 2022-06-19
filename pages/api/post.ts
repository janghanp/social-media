import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

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

  const copyCommand = new CopyObjectCommand(input);
  await s3.send(copyCommand);
};

const deleteObject = (key: string) => {
  const input = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `posts/${key}`,
  };

  const deleteCommand = new DeleteObjectCommand(input);
  s3.send(deleteCommand);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jwt = await getToken({ req, secret: process.env.SECRET });

  if (!jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    const {
      body,
      fileInfos,
    }: { body: string; fileInfos: { Key: string; ratio: number }[] } = req.body;

    try {
      await Promise.all(fileInfos.map((fileInfo) => copyObject(fileInfo.Key)));

      const files = fileInfos.map((fileInfo) => ({
        ratio: fileInfo.ratio,
        Key: fileInfo.Key,
      }));

      await prisma.post.create({
        data: {
          userId: jwt.sub,
          body,
          files,
        },
      });

      return res.status(201).json({ message: "Successfully created!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong..." });
    }
  }

  if (req.method === "DELETE") {
    const { postId }: { postId: string } = req.body;

    try {
      const post = await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      post.files.map((file) => {
        deleteObject(file.Key);
      });

      return res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ message: "Something went wrong..." });
    }
  }

  if (req.method === "PUT") {
    const {
      postId,
      body,
      fileInfos: newFiles,
    }: {
      postId: string;
      body: string;
      fileInfos: { Key: string; ratio: number }[];
    } = req.body;

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(400).json({ mesasge: "Bad request" });
    }

    const currentFiles = post.files.map((file) => ({
      Key: file.Key,
      ratio: file.ratio,
    }));

    console.log("newFiles: ", newFiles);
    console.log("currentFiles: ", currentFiles);

    const currentkeys = currentFiles.map((currentFile) => currentFile.Key);

    const intersectionFiles = newFiles.filter((newFile) =>
      currentkeys.includes(newFile.Key)
    );

    console.log("intersectionFiles: ", intersectionFiles);

    const intersectionKeys = intersectionFiles.map(
      (interFile) => interFile.Key
    );

    const filesToDelete = currentFiles.filter(
      (currentFile) => !intersectionKeys.includes(currentFile.Key)
    );

    const filesToCopy = newFiles.filter(
      (newFile) => !intersectionKeys.includes(newFile.Key)
    );

    console.log("filesToDelete:", filesToDelete);
    console.log("filesToCopy: ", filesToCopy);

    // //Copy object
    await Promise.all(filesToCopy.map((file) => copyObject(file.Key)));

    //Delete object
    filesToDelete.map((file) => deleteObject(file.Key));

    //Update with newrly created files info. - what about ratio?.
    const newPost = await prisma.post.update({
      where: {
        id: postId,
      },

      data: {
        body,
        files: newFiles,
      },
    });

    console.log("newPost: ", newPost);

    return res.status(204).json({ message: "Succesfully updated" });
  }
}
