import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';

import LocationsPage from './location/LocationsPage'; 
import LocationDetails from './location/LocationDetails';
import HomePage from './home/HomePage'; // Página de inicio

import NotFoundPage from './components/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute'; // Importa ProtectedRoute



function App() {

  return (
    <div className="App">
      
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<HomePage />} />

        {/* Rutas protegidas */}
        <Route
          path="/locations"
          element={
            <ProtectedRoute>
              <LocationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/locations/:id"
          element={
            <ProtectedRoute>
              <LocationDetails />
            </ProtectedRoute>
          }
        />

        {/* Ruta para página no encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

    </div>
  );
}

export default App;
