import client from './client';

export const getNotifications = (params) => client.get('/notifications', { params });

export const getNotificationsPreview = () => client.get('/notifications/preview');

export const createNotification = (data) => client.post('/notifications', data);

export const markRead = (id) => client.post('/notifications/' + id + '/read');

export const markAllRead = () => client.post('/notifications/mark-all-read');

export const deleteNotification = (id) => client.delete('/notifications/' + id);
