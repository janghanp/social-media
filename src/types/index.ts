import { Type } from "@prisma/client";

export interface User {
  id: string;
  name?: string;
  username: string;
  email?: string;
  emailVerified?: string;
  image: string;
  likedPostsIds: string[];
  likedCommentsIds: string[];
  followingIds: string[];
  followedByIds: string[];
  _count?: { following: number; followedBy: number };
  notificationsIds: string[];
}

export interface Post {
  id: string;
  body: string;
  files?: FileInfo[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  comments: Comment[];
  _count: { comments: number; likedBy: number };
  likedByIds: string[];
  parentCommentsCount: number;
}

export interface FileInfo {
  ratio: number;
  Key: string;
}

export interface Comment {
  id: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  postId: string;
  parentId?: string;
  likedByIds: string[];
  _count: { likedBy: number; children: number };
  newChildren?: Comment;
  mentionUser?: string;
}

export interface CustomFile extends File {
  preview: string;
  uploaded: boolean;
  isUploading: boolean;
  type: string;
  croppedPreview?: string;
  croppedImage?: Blob;
  zoomInit?: number;
  cropInit?: { x: number; y: number };
  aspectInit?: { value: number; text: string };
  Key?: string;
}

export interface FormikValues {
  body: string;
  files: CustomFile[];
}

export interface Notification {
  id: string;
  senderId: string;
  receiverId: string;
  type: Type;
  is_read: boolean;
  createdAt: Date;
  sender: User;
}
