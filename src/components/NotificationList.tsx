import axios from 'axios';
import { useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';

import { Notification as NotificationType } from '../types';
import SkeletionLoader from './SkeletonLoader';
import NotificationItem from './NotificationItem';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface Props {
  isOpen: boolean;
  unReadNotifications: number | undefined;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reFetchUnReadNotifications: () => void;
}

const NotificationList = ({
  setIsOpen,
  unReadNotifications,
  isOpen,
  reFetchUnReadNotifications,
}: Props) => {
  const { data: notifications, error } = useSWR<NotificationType[]>(
    '/api/notification',
    fetcher
  );

  useEffect(() => {
    //set is_read to true to all notificaionts.
    //It should have is_read and is_checked or something.
    if (unReadNotifications && unReadNotifications > 0) {
      const updateNotificationsStatus = async () => {
        await axios.patch('/api/notification');
      };

      updateNotificationsStatus()
        .then(() => {
          reFetchUnReadNotifications();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isOpen]);

  const isLoading = !notifications && !error;

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-30"
      ></div>
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: -40 }}
        className="rounded-box absolute right-0 top-20 z-40 w-auto min-w-[300px] border-2 border-primary bg-base-100 shadow max-h-[550px] overflow-y-auto"
      >
        {error ? (
          <div className="text-red-500">failed to load... please try again</div>
        ) : isLoading ? (
          <SkeletionLoader />
        ) : (
          <ul className="flex flex-col relative overflow-y-hidden">
            {notifications?.map((notification) => {
              return <NotificationItem key={notification.id} notification={notification}  />;
            })}
          </ul>
        )}
      </motion.div>
    </>
  );
};

export default NotificationList;
