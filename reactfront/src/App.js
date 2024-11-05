import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'; // Asegúrate de importar useLocation
import LocationsPage from './location/LocationsPage'; 
import LocationDetails from './location/LocationDetails';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = () => {
    navigate('/locations'); // Redirige a /locations
  };

  return (
    <div className="App">
      
      <Routes>
        <Route path="/" />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/locations/:id" element={<LocationDetails />} />
      </Routes>

      {/* Contenido de la página principal */}
      {location.pathname === '/' ? (
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
      ) : null} {/* El contenido se oculta si la ruta no es "/" */}
    </div>
  );
}

export default App;
