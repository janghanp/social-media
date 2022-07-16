import { usePostContext } from "../context/postContext";

interface Props {
  togglePostDetailModalHandler: () => void;
}

const PreviewComments = ({ togglePostDetailModalHandler }: Props) => {
  const { previewComments, totalCommentsCount } = usePostContext();

  return (
    <>
      <div className="mt-5">
        <ul>
          {previewComments.map((previewComment) => (
            <li key={previewComment.id} className="mt-2">
              <div>
                <span className="mr-3 text-sm font-bold text-primary">
                  {previewComment.user.username}
                </span>
                <span className="break-all">{previewComment.comment}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {previewComments.length === 2 && (
        <div
          onClick={togglePostDetailModalHandler}
          className="mt-4 text-sm text-gray-400 hover:cursor-pointer"
        >
          View {totalCommentsCount === 1 ? "" : "all"} {totalCommentsCount}{" "}
          {totalCommentsCount === 1 ? "comment" : "comments"}
        </div>
      )}
    </>
  );
};

export default PreviewComments;
