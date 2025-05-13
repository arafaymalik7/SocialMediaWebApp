import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000' });

export const getUserNotifications = (userId) => API.get(`/notification/${userId}`);
export const markAsRead = (id) => API.put(`/notification/read/${id}`);
export const markAllAsRead = (userId) => API.put(`/notification/readAll/${userId}`);
export const deleteNotification = (id) => API.delete(`/notification/${id}`);