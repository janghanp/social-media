import { Post } from '../types';
import CommentSection from './CommentSection';
import ImageSlide from './ImageSlide';
import { PostProvider } from '../context/postContext';

interface Props {
  mainPost: Post;
}

const MainPostDetail = ({ mainPost }: Props) => {
  return (
    <PostProvider postId={mainPost.id} postAuthorId={mainPost.userId} initialIsModal={false}>
      <div className="flex w-full flex-row items-start justify-center border-b border-gray-300 pb-10">
        <div className="relative rounded-md border-2 border-primary bg-white p-3 shadow-lg md:w-11/12 lg:w-10/12 xl:w-[1150px]">
          <div className="mb-2 flex w-full items-center justify-end"></div>
          <div className="grid grid-cols-5 gap-x-2">
            <div className="relative z-10 col-span-5 w-full md:col-span-3">
              <ImageSlide files={mainPost.files} />
            </div>
            <CommentSection post={mainPost} />
          </div>
        </div>
      </div>
    </PostProvider>
  );
};

export default MainPostDetail;
