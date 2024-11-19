import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';

import LocationsPage from './location/LocationsPage'; 
import LocationDetails from './location/LocationDetails';
import HomePage from './home/HomePage'; // Página de inicio


function App() {

  return (
    <div className="App">
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/locations/:id" element={<LocationDetails />} />
      </Routes>

    </div>
  );
}

export default App;
