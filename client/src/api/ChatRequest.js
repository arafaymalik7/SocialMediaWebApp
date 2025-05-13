import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

export const createChat = (data) => API.post('/chat/', data);
export const userChats = (id) => API.get(`/chat/${id}`);
export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);