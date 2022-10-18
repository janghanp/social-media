import { Post } from '../types';
import UserPost from './UserPost';

interface Props {
  posts: Post[];
  postAuthorName: string;
}

const UserPosts = ({ posts, postAuthorName }: Props) => {
  return (
    <div className="py-5">
      <div className="pb-5 text-gray-400">
        More posts from <span className="tex font-bold text-primary">{postAuthorName}</span>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <UserPost post={post} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserPosts;
