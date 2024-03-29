import { Type } from '@prisma/client';

interface Props {
  senderUsername: string;
  type: Type;
}

const NotificationMessage = ({ senderUsername, type }: Props) => {
  let message;

  switch (type) {
    case 'FOLLOW':
      message = (
        <span>
          <span className="font-bold">{senderUsername}</span> started following you.
        </span>
      );
      break;
    case 'LIKEPOST':
      message = (
        <span>
          <span className="font-bold">{senderUsername}</span> liked your post.
        </span>
      );
      break;
    case 'COMMENT':
      message = (
        <span>
          <span className="font-bold">{senderUsername}</span> left a comment on your post.
        </span>
      );
      break;
    case 'LIKECOMMENT':
      message = (
        <span>
          <span className="font-bold">{senderUsername}</span> liked your comment.
        </span>
      );
      break;
    case 'REPLY':
      message = (
        <span>
          <span className="font-bold">{senderUsername}</span> replied to your comment.
        </span>
      );
      break;
    default:
      break;
  }

  return <span>{message}</span>;
};

export default NotificationMessage;
