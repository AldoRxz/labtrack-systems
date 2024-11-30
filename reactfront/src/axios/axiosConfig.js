// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api', // Configura la URL base aquí
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem('token')}`, // Token desde el localStorage
//   },
// });

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://labtrack-systems-api.onrender.com/api', // Configura la URL base aquí
});

export default api;