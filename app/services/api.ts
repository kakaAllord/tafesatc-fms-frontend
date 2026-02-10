import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2313',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (credentials: any) => {
    return api.post('/auth/family/login', credentials);
};

export const getMyFamily = async () => {
    // We don't have a direct "get my family" route, but we have /family/:id
    // But we need to know our ID. 
    // The login response returns 'family' object. We should store it or ID in cookies/context.
    // Or we decode the token.
    // For now, let's assume the component handles ID from local storage or context.
    // Better: Helper to get family details using ID.
    // But wait, the user logs in as FAMILY.
    // Let's create a route /auth/me or similar? Or just extract from token.
    return Promise.resolve(null); // Placeholder
};

export const getMembers = async (familyId: string) => {
    return api.get(`/user/all?familyId=${familyId}`);
};

export const addChild = async (data: any) => {
    return api.post('/user', { ...data, isParent: false });
};

export const getCourses = async () => {
    return api.get('/course/all');
};

export const submitAttendance = async (attendances: any[], date: Date) => {
    return api.post('/attendance', { attendances, date });
};

export const getHistory = async (familyId: string) => {
    return api.get(`/attendance?familyId=${familyId}`);
};

export default api;
