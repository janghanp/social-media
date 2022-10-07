import { useCallback, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { PropagateLoader } from 'react-spinners';

import ImageSlide from './ImageSlide';
import CommentSection from './CommentSection';
import usePreventScroll from '../hooks/usePreventScroll';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface Props {
  postId: string;
  closeModal: () => void;
}
const PostDetailModal = ({ postId, closeModal }: Props) => {
  const { data: post, error } = useSWR(`/api/detail/${postId}`, fetcher);

  const keyEventHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    },
    [closeModal]
  );

  usePreventScroll();

  useEffect(() => {
    document.addEventListener('keydown', keyEventHandler);

    return () => {
      document.removeEventListener('keydown', keyEventHandler);
    };
  }, [keyEventHandler]);

  return (
    <>
      <div
        onClick={closeModal}
        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
      ></div>
      {error && <div className="text-red-500">failed to load</div>}

      {!post && !error ? (
        <div className="fixed left-1/2 top-1/2 z-40 h-auto w-3/5 -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-center">
            <PropagateLoader color="gray" />
          </div>
        </div>
      ) : (
        <div className="fixed left-1/2 top-1/2 z-40 h-auto w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-primary bg-white p-3 shadow-lg md:w-11/12 lg:w-10/12 xl:w-[1150px]">
          <div className="mb-2 flex w-full items-center justify-end">
            <button
              onClick={closeModal}
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
      )}
    </>
  );
};

export default PostDetailModal;
