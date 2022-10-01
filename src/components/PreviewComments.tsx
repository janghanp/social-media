import Link from 'next/link';
import { usePostContext } from '../context/postContext';

const PreviewComments = () => {
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
      <Link href={`/?postId=${postId}`} as={`/posts/${postId}`} shallow replace>
        <a>
          <div className="mt-4 text-sm text-gray-400 hover:cursor-pointer">
            View {totalCommentsCount === 1 ? '' : 'all'} {totalCommentsCount}{' '}
            {totalCommentsCount === 1 ? 'comment' : 'comments'}
          </div>
        </a>
      </Link>
    </>
  );
};

export default PreviewComments;
