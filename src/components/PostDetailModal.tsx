import { useEffect } from 'react';

import { Post as PostType } from '../types';
import ImageSlide from './ImageSlide';
import CommentSection from './CommentSection';

interface Props {
  isOpen: boolean;
  post: PostType;
  setTogglePostDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostDetailModal = ({ isOpen, post, setTogglePostDetailModal }: Props) => {
  useEffect(() => {
    if (isOpen) {
      window.history.pushState(null, '', `/posts/${post.id}`);
    } else {
      window.history.pushState(null, '', '/');
    }
  }, [isOpen, post.id]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        onClick={() => setTogglePostDetailModal(false)}
        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
      ></div>

      <div className="fixed left-1/2 top-1/2 z-40 h-auto w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-primary bg-white p-3 shadow-lg md:w-11/12 lg:w-10/12 xl:w-[1150px]">
        <div className="mb-2 flex w-full items-center justify-end">
          <button
            onClick={() => setTogglePostDetailModal(false)}
            className={`btn btn-outline btn-circle btn-sm border-2`}
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-5 gap-x-2">
          <div className="relative z-10 col-span-5 w-full md:col-span-3">
            <ImageSlide files={post.files} />
          </div>
          <CommentSection post={post} />
        </div>
      </div>
    </>
  );
};

export default PostDetailModal;
