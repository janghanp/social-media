import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Comment as CommentType } from "../pages/index";

dayjs.extend(relativeTime);

interface Props {
  comment: CommentType;
}

const Comment = ({ comment }: Props) => {
  return (
    <div className="flex flex-row items-center justify-center gap-x-2">
      <div className="avatar overflow-hidden rounded-full">
        <Image src={comment.user.image} width={40} height={40} />
      </div>
      <div className="flex flex-col">
        <div>
          <span className="mr-3 text-sm font-bold">{comment.user.name}</span>
          <span className="text-sm">{comment.comment}</span>
        </div>
        <span className="text-xs text-gray-500">
          {dayjs().to(dayjs(comment.createdAt))}
        </span>
      </div>
    </div>
  );
};

export default Comment;
