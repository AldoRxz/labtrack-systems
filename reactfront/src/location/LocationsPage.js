import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: '', description: '', piso: '' });
  const [editLocation, setEditLocation] = useState({ id: '', name: '', description: '', piso: '' });

  // Cargar las locaciones al montar el componente
  useEffect(() => {
    axios.get('http://localhost:3000/api/locations')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las locaciones:', error);
      });
  }, []);

  // Maneja los cambios en los campos del formulario de nueva locación
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation({ ...newLocation, [name]: value });
  };

  // Maneja los cambios en los campos del formulario de edición
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditLocation({ ...editLocation, [name]: value });
  };

  // Función para agregar una nueva locación
  const handleAddLocation = () => {
    axios.post('http://localhost:3000/api/locations', newLocation)
      .then(response => {
        setLocations([...locations, response.data]);
        alert('Locación agregada con éxito');
        setNewLocation({ name: '', description: '', piso: '' });
        document.getElementById('closeAddModalButton').click();
      })
      .catch(error => {
        console.error('Error al agregar la locación:', error);
        alert('Error al agregar la locación');
      });
  };

  // Función para abrir la modal de edición con la información de la locación seleccionada
  const openEditModal = (location) => {
    setEditLocation(location);
  };

  // Función para actualizar una locación
  const handleUpdateLocation = () => {
    axios.put(`http://localhost:3000/api/locations/${editLocation.id}`, editLocation)
      .then(() => {
        setLocations(locations.map(location => 
          location.id === editLocation.id ? editLocation : location
        ));
        alert('Locación actualizada con éxito');
        document.getElementById('closeEditModalButton').click();
      })
      .catch(error => {
        console.error('Error al actualizar la locación:', error);
        alert('Error al actualizar la locación');
      });
  };

  // Función para eliminar una locación
  const handleDeleteLocation = (id) => {
    axios.delete(`http://localhost:3000/api/locations/${id}`)
      .then(() => {
        setLocations(locations.filter(location => location.id !== id));
        alert('Locación eliminada con éxito');
      })
      .catch(error => {
        console.error('Error al eliminar la locación:', error);
        alert('Error al eliminar la locación');
      });
  };

  return (
    <div className="main-content">
      <h1>Locaciones</h1>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addLocationModal"
      >
        Agregar Locación
      </button>

      {/* Lista de locaciones */}
      <ul className="list-group mt-4">
        {locations.map(location => (
          <li
            key={location.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <a href={`/locations/${location.id}`} className="text-decoration-none">
              {location.name}
            </a>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                data-bs-toggle="modal"
                data-bs-target="#editLocationModal"
                onClick={() => openEditModal(location)}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteLocation(location.id)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal para agregar locación */}
      <div
        className="modal fade"
        id="addLocationModal"
        tabIndex="-1"
        aria-labelledby="addLocationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" style={{ color: 'black' }}>
            <div className="modal-header">
              <h5 className="modal-title" id="addLocationModalLabel">Agregar Nueva Locación</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeAddModalButton"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3 text-start">
                  <label htmlFor="location-name" className="col-form-label" style={{ color: 'black' }}>Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location-name"
                    name="name"
                    value={newLocation.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3 text-start">
                  <label htmlFor="location-description" className="col-form-label" style={{ color: 'black' }}>Descripción:</label>
                  <textarea
                    className="form-control"
                    id="location-description"
                    name="description"
                    value={newLocation.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3 text-start">
                  <label htmlFor="location-piso" className="col-form-label" style={{ color: 'black' }}>Piso:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="location-piso"
                    name="piso"
                    value={newLocation.piso}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddLocation}
              >
                Agregar Locación
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar locación */}
      <div
        className="modal fade"
        id="editLocationModal"
        tabIndex="-1"
        aria-labelledby="editLocationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" style={{ color: 'black' }}>
            <div className="modal-header">
              <h5 className="modal-title" id="editLocationModalLabel">Editar Locación</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeEditModalButton"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3 text-start">
                  <label htmlFor="edit-location-name" className="col-form-label" style={{ color: 'black' }}>Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="edit-location-name"
                    name="name"
                    value={editLocation.name}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="mb-3 text-start">
                  <label htmlFor="edit-location-description" className="col-form-label" style={{ color: 'black' }}>Descripción:</label>
                  <textarea
                    className="form-control"
                    id="edit-location-description"
                    name="description"
                    value={editLocation.description}
                    onChange={handleEditInputChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3 text-start">
                  <label htmlFor="edit-location-piso" className="col-form-label" style={{ color: 'black' }}>Piso:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="edit-location-piso"
                    name="piso"
                    value={editLocation.piso}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateLocation}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationsPage;
