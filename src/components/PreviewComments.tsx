import { usePostContext } from '../context/postContext';

interface Props {
  openDetailPostModal: () => void;
}

const PreviewComments = ({ openDetailPostModal }: Props) => {
  const { previewComments, totalCommentsCount, postId } = usePostContext();

  return (
    <>
      <div className="mt-5">
        <ul>
          {previewComments.slice(0, 2).map((previewComment) => (
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
      <div
        className="mt-4 text-sm text-gray-400 hover:cursor-pointer"
        onClick={openDetailPostModal}
      >
        {totalCommentsCount === 1 ? 'comment' : 'comments'}
      </div>
    </>
  );
};

export default PreviewComments;
