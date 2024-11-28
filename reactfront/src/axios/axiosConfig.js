import axios from 'axios';

const api = axios.create({
  baseURL: 'https://labtrack-systems-api.onrender.com/api', // Configura la URL base aquí
});

export default api;
