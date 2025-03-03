import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://localhost:7055', //api'
   // baseURL: 'http://paula1-001-site1.qtempurl.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar el token en cada solicitud
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;