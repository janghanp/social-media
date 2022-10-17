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
      <div className="w-full flex-row items-start justify-center border-b border-gray-300 pb-10">
        <div className="h-[85vh] w-full rounded-md border-2 border-primary p-3 sm:h-auto">
          <div className="flex h-full flex-col items-center justify-start sm:h-full sm:flex-row sm:items-stretch sm:justify-around">
            <div className="relative z-10 flex w-full max-w-[600px] justify-center ">
              <div className="w-[90%]">
                <ImageSlide files={mainPost.files} />
              </div>
            </div>
            <CommentSection post={mainPost} />
          </div>
        </div>
      </div>
    </PostProvider>
  );
};

export default MainPostDetail;
