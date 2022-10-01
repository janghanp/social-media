import { Post } from '../types';
import UserPost from './UserPost';

interface Props {
  posts: Post[];
}

const UserPosts = ({ posts }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-5 pt-10">
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <UserPost post={post} />
          </div>
        );
      })}
    </div>
  );
};

export default UserPosts