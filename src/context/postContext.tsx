import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

import { Comment as CommentType } from '../types';

interface Props {
  children: React.ReactNode;
  initialPreviewComments?: CommentType[];
  initialTotalCommentsCount?: number;
  initialIsLiked?: boolean;
  initialLikesCount?: number;
  postId: string;
  postAuthorId: string;
  initialIsModal: boolean;
}

interface PostContextType {
  previewComments: CommentType[];
  totalCommentsCount: number;
  isLiked: boolean;
  totalLikesCount: number;
  isModal: boolean;
  postId: string;
  postAuthorId: string;
  setPreviewComments: Dispatch<SetStateAction<CommentType[]>>;
  setTotalCommentsCount: Dispatch<SetStateAction<number>>;
  setIsLiked: Dispatch<SetStateAction<boolean>>;
  setTotalLikesCount: Dispatch<SetStateAction<number>>;
}

const defaultValue: PostContextType = {
  previewComments: [],
  totalCommentsCount: 0,
  isLiked: false,
  totalLikesCount: 0,
  postId: '',
  postAuthorId: '',
  isModal: true,
  setPreviewComments: () => {},
  setTotalCommentsCount: () => {},
  setIsLiked: () => {},
  setTotalLikesCount: () => {},
};

const postContext = createContext(defaultValue);

export function PostProvider({
  children,
  initialPreviewComments,
  initialTotalCommentsCount,
  initialIsLiked,
  initialLikesCount,
  initialIsModal,
  postId,
  postAuthorId,
}: Props) {
  const [previewComments, setPreviewComments] = useState<CommentType[]>(
    initialPreviewComments || []
  );
  const [totalCommentsCount, setTotalCommentsCount] = useState<number>(
    initialTotalCommentsCount || 0
  );
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked || false);
  const [totalLikesCount, setTotalLikesCount] = useState<number>(initialLikesCount || 0);
  const [isModal, _setIsModal] = useState<boolean>(initialIsModal);

  return (
    <postContext.Provider
      value={{
        previewComments,
        totalCommentsCount,
        isLiked,
        isModal,
        totalLikesCount,
        postId,
        postAuthorId,
        setPreviewComments,
        setTotalCommentsCount,
        setIsLiked,
        setTotalLikesCount,
      }}
    >
      {children}
    </postContext.Provider>
  );
}

export function usePostContext() {
  return useContext(postContext);
}
