import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function LocationDetails() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Hacer una solicitud GET para obtener la locación por ID
    axios.get(`http://localhost:3000/api/locations/${id}`)
      .then(response => {
        setLocation(response.data);
      })
      .catch(error => {
        console.error('Error al obtener la locación:', error);
      });
  }, [id]);

  if (!location) return <div>Cargando...</div>;

  return (
    <div className="container mt-4">
      <h1>{location.name}</h1>
      <p>{location.description}</p>
      <h2>Equipos</h2>
      {location.Assets && location.Assets.length > 0 ? (
        <ul className="list-group">
          {location.Assets.map(asset => (
            <li key={asset.id} className="list-group-item">
              {asset.descripcion} - {asset.marca}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay equipos en esta locación.</p>
      )}
    </div>
  );
}

export default LocationDetails;
