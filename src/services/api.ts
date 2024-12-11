import axios from 'axios';
import config from '@/config/config';

const api = axios.create({
  baseURL: config.API_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.data);
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      console.error('Error de solicitud:', error.request);
    } else {
      // Algo sucedió en la configuración de la solicitud que provocó un error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
