import axios from 'axios';

const baseURL = 'https://chatoyer.onrender.com/api/user'; // Replace with your API base URL
const ImagebaseURL = 'https://chatoyer.onrender.com';

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const Api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getAuthToken = () => {
    const token = window.localStorage.getItem('UserToken');
    return token ? `Bearer ${token}` : '';
};

axiosInstance.interceptors.request.use(
    config => {
        config.headers.Authorization = getAuthToken();
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
export { Api, ImagebaseURL };
