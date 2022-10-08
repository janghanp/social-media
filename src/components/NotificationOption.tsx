import { useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Props {
  setIsNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchNotifications: () => void;
}

const NotificationOption = ({ setIsNotificationOpen, refetchNotifications }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const clickHanlder = async () => {
    await axios.patch('/api/clickNotification');
    refetchNotifications();

    setIsNotificationOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setIsOpen((prevState) => !prevState)}
        className="relative rounded-full p-1 transition duration-300 hover:cursor-pointer hover:bg-gray-200"
      >
        <HiDotsHorizontal />
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 1, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0 }}
          onClick={clickHanlder}
          className="transtion absolute top-10 right-5 z-50 min-w-max rounded-md border-2 border-primary bg-white p-3 duration-300 hover:cursor-pointer hover:bg-gray-100"
        >
          Mark all as read
        </motion.div>
      )}
    </>
  );
};

export default NotificationOption;
