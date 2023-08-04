import axios from 'axios';
import { useState } from 'react';
import { HiOutlineBell } from 'react-icons/hi';
import useSWR from 'swr';

import { Notification as NotificationType } from '../types';
import NotificationList from './NotificationList';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Notification = () => {
  const {
    data: unReadNotifications,
    error,
    mutate,
  } = useSWR<NotificationType[]>('/api/notification?filter=unread', fetcher);

  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  return (
    <div className="relative pb-1">
      <div
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="ml-5 mt-1 hover:cursor-pointer"
      >
        <HiOutlineBell className="h-7 w-7 hover:cursor-pointer" />
        {unReadNotifications?.length! > 0 && (
          <div className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-white bg-red-500 text-xs font-bold text-white">
            {unReadNotifications?.length}
          </div>
        )}
      </div>
      {isNotificationOpen && (
        <NotificationList
          isNotificationOpen={isNotificationOpen}
          setIsNotificationOpen={setIsNotificationOpen}
          unReadNotifications={unReadNotifications?.length}
          reFetchUnReadNotifications={mutate}
        />
      )}
    </div>
  );
};

export default Notification;
