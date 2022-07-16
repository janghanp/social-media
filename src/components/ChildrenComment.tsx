import SyncLoader from "react-spinners/SyncLoader";

import { Comment as CommentType } from "../types";
import ChildComment from "./ChildComment";
import useChildrenComment from "../hooks/useChildrenComment";

interface Props {
  parentId: string;
}

const ChildrenComment = ({ parentId }: Props) => {
  const { data, error } = useChildrenComment(parentId);

  if (error) {
    return <div>error...</div>;
  }

  if (!data) {
    return (
      <div className="relative flex w-full justify-center">
        <SyncLoader size={7} color="gray" margin={2} />
      </div>
    );
  }

  return (
    <div className="mt-1 flex w-full flex-col gap-y-5 pl-12">
      {data.children.map((childComment: CommentType) => (
        <ChildComment key={childComment.id} childComment={childComment} />
      ))}
    </div>
  );
};

export default ChildrenComment;
