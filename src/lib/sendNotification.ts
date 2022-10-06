import axios from 'axios';
import { Type } from '@prisma/client';

export const sendNotification = async (
  senderId: string,
  receiverId: string,
  type: Type,
  link: string,
  targetId?: string
) => {
  await axios.post('/api/notification', {
    senderId,
    receiverId,
    type,
    link,
    targetId,
  });
};
