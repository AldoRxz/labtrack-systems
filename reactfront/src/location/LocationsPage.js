import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LocationsPage() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Hacer una solicitud GET para obtener las locaciones
    axios.get('http://localhost:3000/api/locations')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las locaciones:', error);
      });
  }, []);

  const handleDelete = (id) => {
    // Hacer una solicitud DELETE para eliminar una locación
    axios.delete(`http://localhost:3000/api/locations/${id}`)
      .then(() => {
        setLocations(locations.filter(location => location.id !== id));
      })
      .catch(error => {
        console.error('Error al eliminar la locación:', error);
      });
  };

  return (
    <div className="container mt-4">
      <h1>Locaciones</h1>
      <Link to="/add-location" className="btn btn-primary mb-3">Agregar Locación</Link>
      <ul className="list-group">
        {locations.map(location => (
          <li key={location.id} className="list-group-item d-flex justify-content-between align-items-center">
            <Link to={`/locations/${location.id}`}>{location.name}</Link>
            <div>
              <Link to={`/edit-location/${location.id}`} className="btn btn-sm btn-warning mr-2">
                <i className="fa fa-edit"></i>
              </Link>
              <button onClick={() => handleDelete(location.id)} className="btn btn-sm btn-danger">
                <i className="fa fa-trash"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationsPage;
