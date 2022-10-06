import axios from 'axios';
import Image from 'next/image';
import useSWR from 'swr';
import { motion } from 'framer-motion';

import { Notification as NotificationType } from '../types';
import SkeletionLoader from './SkeletonLoader';
import { useEffect } from 'react';

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
        className="rounded-box absolute right-0 top-20 z-40 w-auto min-w-[300px] border-2 border-primary bg-base-100 py-2 px-1 shadow"
      >
        {error ? (
          <div className="text-red-500">failed to load... please try again</div>
        ) : isLoading ? (
          <SkeletionLoader />
        ) : (
          <ul className="flex flex-col">
            {notifications?.map((notification) => {
              return (
                <li
                  key={notification.id}
                  className="flex items-center justify-around rounded-md p-2 transition duration-300 hover:cursor-pointer hover:bg-gray-200"
                >
                  <div className="avatar overflow-hidden rounded-full">
                    <Image
                      src={notification.sender.image}
                      width={40}
                      height={40}
                      alt="Image"
                    />
                  </div>
                  <div>{notification.message}</div>
                </li>
              );
            })}
          </ul>
        )}
      </motion.div>
    </>
  );
};

export default NotificationList;
