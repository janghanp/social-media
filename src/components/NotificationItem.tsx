import Image from 'next/image';
import dayjs from 'dayjs';

import { Notification as NotificationType } from '../types';
import NotificationMessage from './NotificationMessage';

interface Props {
  notification: NotificationType;
}

const NotificationItem = ({ notification }: Props) => {
  return (
    <li
      key={notification.id}
      className="flex items-center justify-start space-x-3 rounded-sm p-3 transition duration-300 hover:cursor-pointer hover:bg-gray-200"
    >
      <div className="avatar flex-none overflow-hidden rounded-full">
        <Image
          src={notification.sender.image}
          width={40}
          height={40}
          alt="Image"
        />
      </div>
      <div className="flex flex-col text-sm">
        <div
          className={`${
            notification.is_read ? 'text-gray-300' : 'text-primary'
          }`}
        >
          <NotificationMessage
            senderUsername={notification.sender.username}
            type={notification.type}
          />
        </div>
        <span
          className={`text-sm ${
            notification.is_read ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {dayjs().to(dayjs(notification.createdAt))}
        </span>
      </div>
    </li>
  );
};

export default NotificationItem;
