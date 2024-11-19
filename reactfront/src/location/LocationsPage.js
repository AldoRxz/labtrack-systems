import React, { useEffect, useState } from "react";
import axios from "../axios/axiosConfig";

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: "",
    description: "",
    floor: "",
  });
  const [editLocation, setEditLocation] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get("/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleAddLocation = async () => {
    try {
      const response = await axios.post("/locations", {
        name: newLocation.name,
        description: newLocation.description,
        piso: newLocation.piso,
      });
      // Actualizar el estado de las locaciones con la nueva locación
      setLocations((prevLocations) => [...prevLocations, response.data]);
      setNewLocation({ name: "", description: "", piso: null }); // Resetea el formulario
      setShowAddModal(false); // Cierra la modal
    } catch (error) {
      console.error("Error al agregar la locación:", error);
    }
  };

  const handleEditLocation = async () => {
    try {
      // Enviar los cambios al servidor
      const response = await axios.put(`/locations/${editLocation.id}`, {
        name: editLocation.name,
        description: editLocation.description,
        piso: editLocation.piso,
      });
  
      // Actualizar la locación en el estado de locaciones
      setLocations((prevLocations) =>
        prevLocations.map((loc) =>
          loc.id === editLocation.id ? response.data : loc
        )
      );
  
      // Cerrar la modal y limpiar el estado de edición
      setShowEditModal(false);
      setEditLocation(null);
    } catch (error) {
      console.error("Error al actualizar la locación:", error);
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await axios.delete(`/locations/${id}`);
      setLocations(locations.filter((location) => location.id !== id));
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const handleEdit = (location) => {
    setEditLocation(location);
    setShowEditModal(true);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Locaciones</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Agregar Locación
      </button>
      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Piso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id} style={{ cursor: "pointer" }}>
              <td>
                <a
                  href={`/location/${location.id}`}
                  style={{ color: "#61dafb", textDecoration: "none" }}
                >
                  {location.name}
                </a>
              </td>
              <td>{location.description}</td>
              <td>{location.piso}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(location)}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteLocation(location.id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para agregar locación */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                backgroundColor: "#2b2f38", 
                color: "white", 
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "#61dafb" }}>
                  Agregar Locación
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  style={{ color: "white" }}
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3 text-start"> 
                  <label className="form-label" style={{ color: "#61dafb" }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newLocation.name}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    value={newLocation.description}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>
                    Piso
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={newLocation.piso || ""}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        piso: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cerrar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAddLocation}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar locación */}
      {showEditModal && (
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div
            className="modal-content"
            style={{
              backgroundColor: "#2b2f38", // Fondo consistente con la página
              color: "white", // Color del texto
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title" style={{ color: "#61dafb" }}>
                Editar Locación
              </h5>
              <button
                type="button"
                className="btn-close"
                style={{ color: "white" }}
                onClick={() => setShowEditModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3 text-start">
                <label className="form-label" style={{ color: "#61dafb" }}>
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={editLocation.name}
                  onChange={(e) =>
                    setEditLocation({ ...editLocation, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 text-start">
                <label className="form-label" style={{ color: "#61dafb" }}>
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  value={editLocation.description}
                  onChange={(e) =>
                    setEditLocation({
                      ...editLocation,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="mb-3 text-start">
                <label className="form-label" style={{ color: "#61dafb" }}>
                  Piso
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={editLocation.piso || ""}
                  onChange={(e) =>
                    setEditLocation({
                      ...editLocation,
                      piso: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cerrar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleEditLocation}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    </div>
  );
};

export default LocationsPage;
