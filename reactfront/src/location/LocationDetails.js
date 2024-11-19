import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axios/axiosConfig";

const LocationDetails = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); // Modal para agregar equipo
  const [showEditModal, setShowEditModal] = useState(false); // Modal para editar equipo
  const [selectedAsset, setSelectedAsset] = useState(null); // Equipo seleccionado para editar
  const [newAsset, setNewAsset] = useState({
    descripcion: "",
    marca: "",
    modelo: "",
    numero_de_serie: "",
    numero_de_activo: "",
    resguardante: "",
    status: true,
  });

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await axios.get(`/locations/${id}`);
        setLocation(response.data);
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    };

    fetchLocationDetails();
  }, [id]);

  const handleAddAsset = async () => {
    try {
      // Asegúrate de incluir el campo "location_id"
      const assetData = {
        ...newAsset,
        location_id: id, // Asociar el equipo con la locación actual
      };
  
      console.log("Datos enviados al backend:", assetData);
  
      // Realiza la solicitud POST al backend
      const response = await axios.post("http://localhost:3000/api/assets", assetData);
  
      console.log("Respuesta del backend:", response.data);
  
      // Actualiza el estado local con el nuevo equipo
      setLocation({
        ...location,
        assets: [...location.assets, response.data],
      });
  
      // Cierra la modal y reinicia el formulario
      setShowAddModal(false);
      resetNewAsset();
    } catch (error) {
      console.error("Error al agregar el equipo:", error);
      alert("Error al agregar el equipo. Por favor, verifica los datos.");
    }
  };
  

  const handleEditAsset = async () => {
    try {
      // Realiza la solicitud PUT al backend para actualizar el equipo
      const response = await axios.put(
        `/assets/${selectedAsset.id}`, // Cambia la ruta para reflejar la API correcta
        selectedAsset
      );
  
      // Actualiza el estado del componente con el equipo modificado
      setLocation({
        ...location,
        assets: location.assets.map((asset) =>
          asset.id === selectedAsset.id ? response.data : asset
        ),
      });
  
      // Cierra la modal y reinicia el equipo seleccionado
      setShowEditModal(false);
      setSelectedAsset(null);
    } catch (error) {
      console.error("Error al editar el equipo:", error);
      alert("Ocurrió un error al editar el equipo. Por favor, inténtalo de nuevo.");
    }
  };
  

  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este equipo?")) {
      return;
    }
    try {
      // Realiza la solicitud DELETE al backend para eliminar el equipo
      await axios.delete(`/assets/${assetId}`); // Cambia la ruta para reflejar la API correcta
  
      // Actualiza el estado del componente eliminando el equipo de la lista
      setLocation({
        ...location,
        assets: location.assets.filter((asset) => asset.id !== assetId),
      });
    } catch (error) {
      console.error("Error al eliminar el equipo:", error);
      alert("Ocurrió un error al eliminar el equipo. Por favor, inténtalo de nuevo.");
    }
  };
  

  const resetNewAsset = () => {
    setNewAsset({
      descripcion: "",
      marca: "",
      modelo: "",
      numero_de_serie: "",
      numero_de_activo: "",
      resguardante: "",
      status: true,
    });
  };

  if (!location) {
    return <p className="text-center mt-4">Cargando detalles de la locación...</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">{location.name}</h1>
      <p className="text-center">{location.description}</p>

      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>Equipos</h2>
        <button
          className="btn btn-success"
          onClick={() => setShowAddModal(true)}
        >
          Agregar Nuevo Equipo
        </button>
      </div>

      {location.assets && location.assets.length > 0 ? (
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Resguardante</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {location.assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>{asset.descripcion}</td>
                <td>{asset.marca}</td>
                <td>{asset.modelo}</td>
                <td>{asset.resguardante}</td>
                <td
                  className={`fw-bold ${
                    asset.status ? "text-primary" : "text-danger"
                  }`}
                >
                  {asset.status ? "Activo" : "Inactivo"}
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setShowEditModal(true);
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteAsset(asset.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay equipos en esta locación.</p>
      )}

      <Link to="/locations" className="btn btn-primary mt-4">
        Volver a Locaciones
      </Link>

      {/* Modal para agregar nuevo equipo */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "#61dafb" }}>Agregar Nuevo Equipo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddModal(false);
                    resetNewAsset();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {/* Campos del formulario */}
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.descripcion}
                    onChange={(e) => setNewAsset({ ...newAsset, descripcion: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Marca</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.marca}
                    onChange={(e) => setNewAsset({ ...newAsset, marca: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Modelo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.modelo}
                    onChange={(e) => setNewAsset({ ...newAsset, modelo: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Número de Serie</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.numero_de_serie}
                    onChange={(e) => setNewAsset({ ...newAsset, numero_de_serie: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Número de Activo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.numero_de_activo}
                    onChange={(e) => setNewAsset({ ...newAsset, numero_de_activo: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>COG</label> {/* Nuevo campo */}
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.cog}
                    onChange={(e) => setNewAsset({ ...newAsset, cog: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Resguardante</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.resguardante}
                    onChange={(e) => setNewAsset({ ...newAsset, resguardante: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Estado</label>
                  <select
                    className="form-control"
                    value={newAsset.status}
                    onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value === "true" })}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    resetNewAsset();
                  }}
                >
                  Cerrar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAddAsset}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Modal para editar equipo */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "#61dafb" }}>Editar Equipo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedAsset.descripcion}
                    onChange={(e) =>
                      setSelectedAsset({ ...selectedAsset, descripcion: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Marca</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedAsset.marca}
                    onChange={(e) =>
                      setSelectedAsset({ ...selectedAsset, marca: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Modelo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedAsset.modelo}
                    onChange={(e) =>
                      setSelectedAsset({ ...selectedAsset, modelo: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Número de Serie</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedAsset.numero_de_serie}
                    onChange={(e) =>
                      setSelectedAsset({ ...selectedAsset, numero_de_serie: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Número de Activo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedAsset.numero_de_activo}
                    onChange={(e) =>
                      setSelectedAsset({ ...selectedAsset, numero_de_activo: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>COG</label> {/* Nuevo campo */}
                  <input
                    type="text"
                    className="form-control"
                    value={selectedAsset.cog}
                    onChange={(e) =>
                      setSelectedAsset({ ...selectedAsset, cog: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Resguardante</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedAsset.resguardante}
                    onChange={(e) =>
                      setSelectedAsset({ ...selectedAsset, resguardante: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#61dafb" }}>Estado</label>
                  <select
                    className="form-control"
                    value={selectedAsset.status}
                    onChange={(e) =>
                      setSelectedAsset({ ...selectedAsset, status: e.target.value === "true" })
                    }
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
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
                  onClick={handleEditAsset}
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

export default LocationDetails;
