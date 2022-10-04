import axios from 'axios';

export const createNotification = async (
  senderId: string,
  receiverId: string,
  message: string
) => {
  await axios.post('/api/notification', { senderId, receiverId, message });
};
