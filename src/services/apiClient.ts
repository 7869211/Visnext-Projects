import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://services.meetchase.ai',
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized! Redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
