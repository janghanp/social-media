import axios from 'axios';
import { useState } from 'react';
import { HiOutlineBell } from 'react-icons/hi';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

import { Notification as NotificationType } from '../types';
import NotificationList from './NotificationList';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Notification = () => {
  const {
    data: unReadNotifications,
    error,
    mutate,
  } = useSWR<NotificationType[]>('/api/notification?filter=unread', fetcher);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative pb-1">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="ml-5 mt-1 hover:cursor-pointer"
      >
        <HiOutlineBell className="h-7 w-7 hover:cursor-pointer" />
        {unReadNotifications?.length! > 0 && (
          <div className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-white bg-red-500 text-xs font-bold text-white">
            {unReadNotifications?.length}
          </div>
        )}
      </div>
      {isOpen && (
        <NotificationList
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          unReadNotifications={unReadNotifications?.length}
          reFetchUnReadNotifications={mutate}
        />
      )}
    </div>
  );
};

export default Notification;
