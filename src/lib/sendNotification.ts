import axios from 'axios';
import { Type } from '@prisma/client';

export const sendNotification = async (
  senderId: string,
  receiverId: string,
  message: string,
  type: Type
) => {
  await axios.post('/api/notification', {
    senderId,
    receiverId,
    message,
    type,
  });
};
