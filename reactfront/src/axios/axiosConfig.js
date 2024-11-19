import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Configura la URL base aquí
});

export default api;
