import axios from 'axios';
import { useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';

import { Notification as NotificationType } from '../types';
import SkeletionLoader from './SkeletonLoader';
import NotificationItem from './NotificationItem';
import NotificationOption from './NotificationOption';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface Props {
  isNotificationOpen: boolean;
  unReadNotifications: number | undefined;
  setIsNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reFetchUnReadNotifications: () => void;
}

const NotificationList = ({
  unReadNotifications,
  isNotificationOpen,
  setIsNotificationOpen,
  reFetchUnReadNotifications,
}: Props) => {
  const {
    data: notifications,
    error,
    mutate,
  } = useSWR<NotificationType[]>('/api/notification', fetcher);

  useEffect(() => {
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
  }, [isNotificationOpen, unReadNotifications, reFetchUnReadNotifications]);

  const isLoading = !notifications && !error;

  console.log(notifications);

  return (
    <>
      <div onClick={() => setIsNotificationOpen(false)} className="fixed inset-0 z-30"></div>
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: -40 }}
        className="ma rounded-box absolute -right-16 top-20 z-40 max-h-[550px] w-[300px] overflow-y-auto  border-2 border-primary bg-base-100 shadow sm:right-0 sm:w-[350px]"
      >
        <div className="flex items-center justify-between py-3 px-5">
          <span className="text-lg font-semibold">Notifications</span>
          <NotificationOption
            setIsNotificationOpen={setIsNotificationOpen}
            refetchNotifications={mutate}
          />
        </div>
        {error ? (
          <div className="text-red-500">failed to load... please try again</div>
        ) : isLoading ? (
          <SkeletionLoader />
        ) : notifications?.length === 0 ? (
          <div className="flex justify-center p-2">so clean...</div>
        ) : (
          <ul className="relative flex flex-col overflow-y-hidden">
            {notifications?.map((notification) => {
              return (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  setIsNotificationOpen={setIsNotificationOpen}
                />
              );
            })}
          </ul>
        )}
      </motion.div>
    </>
  );
};

export default NotificationList;
