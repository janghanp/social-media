import {
  useContext,
  createContext,
  useState,
  SetStateAction,
  Dispatch,
} from "react";

interface Props {
  children: React.ReactNode;
}

interface commentContextType {
  isReply: boolean;
  isEdit: boolean;
  editingCommentId: string;
  replyingCommentId: string;
  currentComment: string;
  setIsReply: Dispatch<SetStateAction<boolean>>;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  setEditingCommentId: Dispatch<SetStateAction<string>>;
  setReplyingCommentId: Dispatch<SetStateAction<string>>;
  setCurrentComment: Dispatch<SetStateAction<string>>;
}

const defaultValue: commentContextType = {
  isReply: false,
  isEdit: false,
  editingCommentId: "",
  replyingCommentId: "",
  currentComment: "",
  setIsReply: () => {},
  setIsEdit: () => {},
  setEditingCommentId: () => {},
  setReplyingCommentId: () => {},
  setCurrentComment: () => {},
};

const commentContext = createContext(defaultValue);

export function CommentProvider({ children }: Props) {
  const [isReply, setIsReply] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<string>("");
  const [replyingCommentId, setReplyingCommentId] = useState<string>("");
  const [currentComment, setCurrentComment] = useState<string>("");

  return (
    <commentContext.Provider
      value={{
        isReply,
        isEdit,
        editingCommentId,
        replyingCommentId,
        currentComment,
        setIsReply,
        setIsEdit,
        setEditingCommentId,
        setReplyingCommentId,
        setCurrentComment,
      }}
    >
      {children}
    </commentContext.Provider>
  );
}

export function useCommentContext() {
  return useContext(commentContext);
}
