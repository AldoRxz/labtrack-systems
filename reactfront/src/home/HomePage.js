import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg'; // Ajusta la ruta según tu estructura

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/locations'); // Redirige a la página de locaciones
  };

  return (
    <div className="main-content">
      <header className="main-header">
        <img src={logo} className="main-logo" alt="logo" />
        <h1>Bienvenido a la Aplicación React</h1>
        <p>
          Explora las locaciones y gestiona tus equipos de forma fácil y eficiente.
        </p>
        <button className="btn btn-primary" onClick={handleNavigate}>
          <i className="fa fa-star"></i> Ir a Locaciones
        </button>
      </header>
    </div>
  );
};

export default HomePage;
