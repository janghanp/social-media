import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { Comment as CommentType } from '../types';

interface Props {
  children: React.ReactNode;
  initialPreviewComments: CommentType[];
  initialTotalCommentsCount: number;
  initialIsLiked: boolean;
  initialLikesCount: number;
  postId: string;
  postAuthorId: string;
}

interface PostContextType {
  previewComments: CommentType[];
  totalCommentsCount: number;
  isLiked: boolean;
  totalLikesCount: number;
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
  postId,
  postAuthorId,
}: Props) {
  const [previewComments, setPreviewComments] = useState<CommentType[]>(
    initialPreviewComments
  );
  const [totalCommentsCount, setTotalCommentsCount] = useState<number>(
    initialTotalCommentsCount
  );
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
  const [totalLikesCount, setTotalLikesCount] =
    useState<number>(initialLikesCount);

  return (
    <postContext.Provider
      value={{
        previewComments,
        totalCommentsCount,
        isLiked,
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
