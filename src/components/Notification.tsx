import { useState } from 'react';
import { HiOutlineBell } from 'react-icons/hi';

import { useCurrentUserState } from '../store';
import NotificationList from './NotificationList';

const Notification = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const currentUser = useCurrentUserState((state) => state.currentUser);

  const unReadNotificationsCount = currentUser?._count?.notifications;

  return (
    <div className="relative pb-1">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="ml-5 mt-1 hover:cursor-pointer"
      >
        <HiOutlineBell className="h-7 w-7 hover:cursor-pointer" />
        {unReadNotificationsCount! > 0 && (
          <div className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-white bg-red-500 text-xs font-bold text-white">
            {unReadNotificationsCount}
          </div>
        )}
      </div>
      {isOpen && (
        <NotificationList
          setIsOpen={setIsOpen}
          unReadNotifications={unReadNotificationsCount}
        />
      )}
    </div>
  );
};

export default Notification;
