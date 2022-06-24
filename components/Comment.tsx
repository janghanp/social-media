import { SetStateAction, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiOutlineEllipsis } from "react-icons/ai";
import { useSession } from "next-auth/react";
import axios from "axios";

import { Comment as CommentType } from "../pages/index";
import ControlMenu from "./ControlMenu";

dayjs.extend(relativeTime);

interface Props {
  comment: CommentType;
  postAuthorId: string;
  deleteComment: (commentdId: string) => {};
  setCommentInput: React.Dispatch<SetStateAction<string>>;
  setIsEdit: React.Dispatch<SetStateAction<boolean>>;
  setEditingCommentId: React.Dispatch<SetStateAction<string | undefined>>;
}

const Comment = ({
  comment,
  postAuthorId,
  deleteComment,
  setCommentInput,
  setIsEdit,
  setEditingCommentId,
}: Props) => {
  const { data: session } = useSession();

  const [toggleControlMenu, setToggleControlMenu] = useState<boolean>(false);

  const deleteHandler = async () => {
    await axios.delete("/api/comment", {
      data: {
        commentId: comment.id,
      },
    });

    deleteComment(comment.id);
  };

  const editHandler = async () => {
    setToggleControlMenu(false);
    setEditingCommentId(comment.id);
    setCommentInput(comment.comment);
    setIsEdit(true);
  };

  return (
    <div className="group flex w-full flex-row items-center justify-between gap-x-2">
      <div className="flex flex-row items-center justify-center gap-x-2 ">
        <div className="avatar overflow-hidden rounded-full">
          <Image src={comment.user.image} width={40} height={40} />
        </div>
        <div className="flex flex-col">
          <div>
            <span className="mr-3 text-sm font-bold">
              {comment.user.username}
            </span>
            <span className="text-sm">{comment.comment}</span>
          </div>
          <div className="flex gap-x-5 text-xs text-gray-500">
            <div className="flex gap-x-3 font-semibold">
              <span className="hover:cursor-pointer">Like</span>
              <span className="hover:cursor-pointer">Reply</span>
            </div>
            <span>{dayjs().to(dayjs(comment.createdAt))}</span>
          </div>
        </div>
      </div>
      {(session?.user.id === comment.userId ||
        session?.user.id === postAuthorId) && (
        <div
          onClick={() => setToggleControlMenu(true)}
          className="hidden rounded-full p-1 transition duration-300 hover:cursor-pointer hover:bg-gray-200/50 group-hover:block"
        >
          <AiOutlineEllipsis className="h-5 w-5 stroke-red-500" />
        </div>
      )}
      {toggleControlMenu && (
        <ControlMenu
          setToggleControlMenu={setToggleControlMenu}
          deleteHandler={deleteHandler}
          editHandler={editHandler}
          type="comment"
        />
      )}
    </div>
  );
};

export default Comment;
