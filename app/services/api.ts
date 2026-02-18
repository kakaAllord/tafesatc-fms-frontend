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
    return Promise.resolve(null); // Placeholder
};

export const getUsers = async (familyId: string) => {
    return api.get(`/user/all?familyId=${familyId}`);
};

export const addParent = async (data: any) => {
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

export const getAttendanceByDate = async (familyId: string, date: string) => {
    return api.get(`/attendance?familyId=${familyId}&date=${date}`);
};

// wrapper that satisfies the frontend requirement for a boolean existence check
export const checkAttendanceExists = async (familyId: string, date: string) => {
    const res = await getAttendanceByDate(familyId, date);
    return {
        success: res.data.success,
        exists: Array.isArray(res.data.body) && res.data.body.length > 0,
    };
};

export const getMetrics = async (params: {
    familyId?: string;
    startDate?: string;
    endDate?: string;
    date?: string;
}) => {
    const query = new URLSearchParams();
    if (params.familyId) query.append('familyId', params.familyId);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.date) query.append('date', params.date);
    return api.get(`/attendance/metrics?${query.toString()}`);
};

export const getRandomVerse = async () => {
    return api.get('/verse/random');
};

export const getAttendanceRange = async (familyId: string) => {
    return api.get('/attendance/range', { params: { familyId } });
};

export default api;
