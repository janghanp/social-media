import Image from 'next/image';
import { Notification as NotificationType } from '../types';

interface Props {
  notifications: NotificationType[];
}

const NotificationList = ({ notifications }: Props) => {
  return (
    <div>
      {notifications?.map((notification) => {
        return (
          <div
            key={notification.id}
            className="flex items-center justify-center"
          >
            <div className="avatar overflow-hidden rounded-full">
              <Image
                src={notification.sender.image}
                width={40}
                height={40}
                alt="Image"
              />
            </div>
            <span>{notification.message}</span>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationList;
