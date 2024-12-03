import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      // const response = await axios.post('http://localhost:3000/api/users/login', credentials);
      const response = await axios.post('https://labtrack-systems-api.onrender.com/api/users/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Guarda el token
        localStorage.setItem('username', credentials.username); // Guarda el nombre de usuario
        navigate('/locations'); // Redirige a /locations
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src="/inicio/tecmm.png" alt="TecMM Logo" style={styles.logo} />
        <h1 style={styles.title}>Iniciar Sesión</h1>
        <p style={styles.subtitle}>Accede para gestionar tus equipos y locaciones</p>
        <div style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={credentials.username}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={credentials.password}
            onChange={handleChange}
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button onClick={handleLogin} style={styles.button}>
            Iniciar Sesión
          </button>
        </div>
        <p style={styles.rights}>
          © {new Date().getFullYear()} Tecnológico Superior de Jalisco. Todos los derechos
          reservados.
        </p>
      </div>
      <footer style={styles.footer}>
        <div style={styles.logoContainer}>
          <img src="/inicio/educacion.png" alt="Educación" style={styles.footerLogo} />
          <img src="/inicio/jalisco.png" alt="Jalisco" style={styles.footerLogo} />
          <img src="/inicio/innovacion.png" alt="Innovación" style={styles.footerLogo} />
          <img src="/inicio/tecnologico.png" alt="Tecnológico Nacional de México" style={styles.footerLogo} />
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between', // Distribuye el contenido verticalmente
  alignItems: 'center', // Centra el contenido horizontalmente
  minHeight: '100vh', // Ocupa toda la altura de la ventana
  backgroundImage: 'url(/inicio/portada_2-transformed_2.jpeg)',
  backgroundPosition: 'center', // Centra la imagen en el contenedor
  backgroundPositionY: '0px', // Centra la imagen en el contenedor
  backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
  backgroundSize: 'cover', // Asegura que la imagen cubra todo el fond
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    margin: 'auto', // Centra la tarjeta vertical y horizontalmente
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#2b2f38',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
    textAlign: 'center',
    color: '#ffffff',
  },
  logo: {
    width: '120px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '14px',
    marginBottom: '20px',
    color: '#ccc',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #444',
    fontSize: '16px',
    backgroundColor: '#1e1e2f',
    color: '#fff',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  rights: {
    fontSize: '12px',
    marginTop: '15px',
    color: '#aaa',
  },
  footer: {
    width: '100%',
    backgroundColor: '#1e1e2f',
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'center', // Centra las imágenes horizontalmente
    alignItems: 'center',
    flexWrap: 'wrap', // Permite que las imágenes se ajusten si hay falta de espacio
  },
  footerLogo: {
    height: '60px',
    filter: 'brightness(0.9)',
    margin: '0 15px', // Espaciado horizontal entre las imágenes
  },
};


export default LoginPage;
