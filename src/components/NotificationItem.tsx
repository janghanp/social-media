import Image from 'next/image';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

import { Notification as NotificationType } from '../types';
import NotificationMessage from './NotificationMessage';
import axios from 'axios';

interface Props {
  notification: NotificationType;
  setIsNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationItem = ({ notification, setIsNotificationOpen }: Props) => {
  const router = useRouter();

  const notificationClickHandler = async () => {
    await axios.patch('/api/clickNotification', {
      notificationId: notification.id,
    });

    router.push(notification.link);
    setIsNotificationOpen(false);
  };

  return (
    <li
      key={notification.id}
      onClick={notificationClickHandler}
      className="flex items-start justify-between space-x-3 p-3 transition duration-300 hover:cursor-pointer hover:bg-gray-200"
    >
      <div className="avatar flex-none overflow-hidden rounded-full">
        <Image src={notification.sender.image} width={40} height={40} alt="Image" />
      </div>
      <div className="flex flex-1 flex-col text-sm">
        <div className={`${notification.is_clicked ? 'text-gray-300' : 'text-primary'}`}>
          <NotificationMessage
            senderUsername={notification.sender.username}
            type={notification.type}
          />
        </div>
        <span className={`text-sm ${notification.is_clicked ? 'text-gray-300' : 'text-gray-600'}`}>
          {dayjs().to(dayjs(notification.createdAt))}
        </span>
      </div>
      {notification.in_what_post && (
        <div className="flex-none">
          <Image
            className="rounded-md"
            src={`${process.env.NEXT_PUBLIC_AWS_BUCKET_URL}/posts/${notification.in_what_post.files[0].Key}`}
            width={40}
            height={40}
            alt="Image"
          />
        </div>
      )}
    </li>
  );
};

export default NotificationItem;
