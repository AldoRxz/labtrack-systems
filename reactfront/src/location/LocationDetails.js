import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../axios/axiosConfig";
import 'bootstrap/dist/css/bootstrap.min.css';

function LocationDetails() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [newAsset, setNewAsset] = useState({
    descripcion: '',
    marca: '',
    status: '1'
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/api/locations/${id}`)
      .then(response => {
        setLocation(response.data);
      })
      .catch(error => {
        console.error('Error al obtener la locación:', error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset({ ...newAsset, [name]: value });
  };

  const handleAddAsset = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:3000/api/assets`, {
      ...newAsset,
      location_id: id
    })
    .then(response => {
      alert('Equipo agregado con éxito');
      setLocation(prevLocation => ({
        ...prevLocation,
        Assets: [...prevLocation.Assets, response.data]
      }));
      setNewAsset({ descripcion: '', marca: '', status: '1' });
      document.getElementById('closeModalButton').click();
    })
    .catch(error => {
      console.error('Error al agregar el equipo:', error);
      alert('Error al agregar el equipo');
    });
  };

  if (!location) return <div>Cargando...</div>;

  return (
    <div className="container mt-4">
      <h1 className="text-center">{location.name}</h1>
      <p className="text-center">{location.description}</p>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mt-4">Equipos</h2>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addAssetModal">
          Agregar Nuevo Equipo
        </button>
      </div>

      {location.Assets && location.Assets.length > 0 ? (
        <ul className="list-group">
          {location.Assets.map(asset => (
            <li key={asset.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{asset.descripcion}</strong> - {asset.marca}
                <p className="mb-1">
                  <strong>Estado:</strong>{' '}
                  <span
                    className={`badge ${Number(asset.Status?.status) === 1 ? 'bg-primary' : 'bg-danger'}`}
                  >
                    {Number(asset.Status?.status) === 1 ? 'Activo' : 'Desactivado'}
                  </span>
                </p>
              </div>
              <div className="btn-group">
                <button className="btn btn-info btn-sm" onClick={() => handleViewHistory(asset.id)}>Ver Historial</button>
                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(asset.id)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(asset.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No hay equipos en esta locación.</p>
      )}

      {/* Modal de Bootstrap */}
      <div className="modal fade" id="addAssetModal" tabIndex="-1" aria-labelledby="addAssetModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addAssetModalLabel">Agregar Nuevo Equipo</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddAsset}>
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    value={newAsset.descripcion}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="marca" className="form-label">Marca</label>
                  <input
                    type="text"
                    className="form-control"
                    id="marca"
                    name="marca"
                    value={newAsset.marca}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Estado</label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={newAsset.status}
                    onChange={handleInputChange}
                  >
                    <option value="1">Activo</option>
                    <option value="0">Desactivado</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Agregar Equipo</button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeModalButton">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Funciones para manejar las acciones
  function handleViewHistory(assetId) {
    console.log(`Ver historial de actualizaciones para el equipo ${assetId}`);
  }

  function handleEdit(assetId) {
    console.log(`Editar equipo ${assetId}`);
  }

  function handleDelete(assetId) {
    console.log(`Eliminar equipo ${assetId}`);
    axios.delete(`http://localhost:3000/api/assets/${assetId}`)
      .then(() => {
        alert('Equipo eliminado');
        setLocation(prevLocation => ({
          ...prevLocation,
          Assets: prevLocation.Assets.filter(asset => asset.id !== assetId)
        }));
      })
      .catch(error => {
        console.error('Error al eliminar el equipo:', error);
        alert('Error al eliminar el equipo');
      });
  }
}

export default LocationDetails;
