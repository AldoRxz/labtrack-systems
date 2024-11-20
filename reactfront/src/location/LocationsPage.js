import React, { useState, useEffect } from "react";
import axios from "../axios/axiosConfig";
import { useNavigate } from "react-router-dom";

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const [newLocation, setNewLocation] = useState({
    name: "",
    description: "",
    piso: "",
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
    if (!newLocation.name || !newLocation.piso) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
    try {
      const response = await axios.post("/locations", newLocation);
      setLocations([...locations, response.data]);
      setNewLocation({ name: "", description: "", piso: "" });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleEditLocation = async () => {
    if (!editLocation.name || !editLocation.piso) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
    try {
      const response = await axios.put(`/locations/${editLocation.id}`, editLocation);
      setLocations(
        locations.map((loc) =>
          loc.id === editLocation.id ? response.data : loc
        )
      );
      setEditLocation({});
      setShowEditModal(false);
    } catch (error) {
      console.error("Error editing location:", error);
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta locación?")) {
      return;
    }
    try {
      await axios.delete(`/locations/${id}`);
      setLocations(locations.filter((loc) => loc.id !== id));
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  // Agrupar locaciones por piso
  const groupedLocations = locations.reduce((acc, location) => {
    const piso = location.piso;
    if (!acc[piso]) {
      acc[piso] = [];
    }
    acc[piso].push(location);
    return acc;
  }, {});

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Locaciones</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Agregar Locación
      </button>

      {Object.keys(groupedLocations)
        .sort((a, b) => a - b) // Ordenar por número de piso
        .map((piso) => (
          <div key={piso} className="mb-5">
            <h2 className="text-center">Piso {piso}</h2>
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
                {groupedLocations[piso].map((location) => (
                  <tr key={location.id}>
                    <td
                      style={{ cursor: "pointer", color: "#61dafb" }}
                      onClick={() => navigate(`/locations/${location.id}`)}
                    >
                      {location.name}
                    </td>
                    <td>{location.description}</td>
                    <td>{location.piso}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setEditLocation(location);
                          setShowEditModal(true);
                        }}
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
          </div>
        ))}

      {/* Modal para agregar locación */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Locación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newLocation.name}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
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
                <div className="mb-3">
                  <label className="form-label">Piso</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newLocation.piso}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        piso: e.target.value,
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
                <button className="btn btn-primary" onClick={handleAddLocation}>
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
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Locación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editLocation.name || ""}
                    onChange={(e) =>
                      setEditLocation({ ...editLocation, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    value={editLocation.description || ""}
                    onChange={(e) =>
                      setEditLocation({
                        ...editLocation,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Piso</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editLocation.piso || ""}
                    onChange={(e) =>
                      setEditLocation({
                        ...editLocation,
                        piso: e.target.value,
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


