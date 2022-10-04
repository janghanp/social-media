import axios from 'axios';
import { HiOutlineBell } from 'react-icons/hi';
import useSWR from 'swr';

import { useCurrentUserState } from '../store';
import { Notification as NotificationType } from '../types';
import NotificationList from './NotificationList';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Notification = () => {
  const { data: notifications, error } = useSWR<NotificationType[]>(
    '/api/notification',
    fetcher
  );

  const currentUser = useCurrentUserState((state) => state.currentUser);

  const blurDropdown = () => {
    document.getElementById('dropdown-menu')?.blur();
  };

  const notificationsCount = currentUser?._count?.notifications;

  const isLoading = !notifications && !error;

  return (
    <div id="dropdown" className="dropdown-end dropdown pb-1">
      <div tabIndex={0} className="ml-5 mt-1 hover:cursor-pointer">
        <HiOutlineBell className="h-7 w-7 hover:cursor-pointer" />
        {notificationsCount! > 0 && (
          <div className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-white bg-red-500 text-xs font-bold text-white">
            {notificationsCount}
          </div>
        )}
      </div>
      {error ? (
        <div className="text-red-500">failed to load...</div>
      ) : isLoading ? (
        <div>loading...</div>
      ) : (
        <ul
          tabIndex={0}
          id="dropdown-menu"
          className="dropdown-content rounded-box absolute flex w-[350px] flex-col border-2 border-primary bg-base-100 p-2 shadow"
        >
          <NotificationList notifications={notifications!} />
        </ul>
      )}
    </div>
  );
};

export default Notification;
