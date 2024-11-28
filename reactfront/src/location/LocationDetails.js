import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axios/axiosConfig";

import {
  Box,
  SwipeableDrawer,
  Typography,
  Button,
} from "@mui/material";

const LocationDetails = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); // Modal para agregar equipo
  const [showEditModal, setShowEditModal] = useState(false); // Modal para editar equipo
  
  const [newAsset, setNewAsset] = useState({
    descripcion: "",
    marca: "",
    modelo: "",
    numero_de_serie: "",
    numero_de_activo: "",
    resguardante: "",
    status: true,
  });

  const [selectedAsset, setSelectedAsset] = useState(null); // Equipo seleccionado para editar
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para el SwipeableDrawer
  
  const [observationsDrawerOpen, setObservationsDrawerOpen] = useState(false); // Estado para el SwipeableDrawer de observaciones
  const [observations, setObservations] = useState([]);
  const [showAddObservation, setShowAddObservation] = useState(false);
  const [selectedObservationId, setSelectedObservationId] = useState(null);
  const [newObservation, setNewObservation] = useState({
    observation: "",
    observed_by: "",
  });

  
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState(null); // ID del mantenimiento seleccionado
  const [newMaintenance, setNewMaintenance] = useState({
    description: "",
    cost: "",
    performed_by: "",
  });

  const [maintenancesDrawerOpen, setMaintenancesDrawerOpen] = useState(false);
  const [maintenances, setMaintenances] = useState([]);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);


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

  const handleOpenDetails = (asset) => {
    setSelectedAsset(asset);
    setDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setDrawerOpen(false);
    setSelectedAsset(null);
  };

  const handleOpenObservations = async (asset) => {
    try {
      setSelectedAsset(asset);
      const response = await axios.get(`http://localhost:3000/api/assets/${asset.id}`);
      setObservations(response.data.observations || []); // Asumimos que la API devuelve un campo 'observations'
      setObservationsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching observations:", error);
    }
  };

  const handleCloseObservations = () => {
    setObservationsDrawerOpen(false);
    setObservations([]);
  };
  
  const handleSaveObservation = async () => {
    if (!selectedAsset) {
      alert("Por favor selecciona un equipo antes de guardar una observación.");
      return;
    }
  
    const payload = {
      asset_id: selectedAsset.id,
      observation: newObservation.observation,
      observed_by: newObservation.observed_by,
    };
  
    try {
      // Realiza la solicitud POST al backend
      const response = await axios.post('/observation-history', payload);
  
      // Agregar la nueva observación a la lista existente
      setObservations((prevObservations) => [...prevObservations, response.data]);
  
      // Restablecer el formulario y cerrar el modal
      setNewObservation({ observation: "", observed_by: "" });
      setShowAddObservation(false);
  
      alert('Observación guardada exitosamente.');
    } catch (error) {
      console.error("Error al guardar la observación:", error);
      alert('Error al guardar la observación.');
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleUpdateObservation = async () => {
    if (!selectedObservationId) {
      alert("No se ha seleccionado ninguna observación para actualizar.");
      return;
    }
  
    const payload = {
      observation: newObservation.observation,
      observed_by: newObservation.observed_by,
    };
  
    try {
      await axios.put(`/observation-history/${selectedObservationId}`, payload);
      alert('Observación actualizada exitosamente.');
  
      // Actualiza las observaciones locales
      setObservations((prev) =>
        prev.map((obs) =>
          obs.id === selectedObservationId ? { ...obs, ...payload } : obs
        )
      );
  
      // Limpia el formulario
      setNewObservation({ observation: '', observed_by: '' });
      setSelectedObservationId(null); // Limpia el ID seleccionado
      setShowAddObservation(false); // Cierra el formulario
    } catch (error) {
      console.error("Error al actualizar la observación:", error);
      alert('Error al actualizar la observación.');
    }
  };

  const handleEditObservation = (observation) => {
    setNewObservation({
      observation: observation.observation,
      observed_by: observation.observed_by,
    });
    setSelectedObservationId(observation.id); // Guarda el ID de la observación a editar
    setShowAddObservation(true); // Abre el formulario
  };
  

  const handleDeleteObservation = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta observación?")) {
      try {
        await axios.delete(`/observation-history/${id}`);
        setObservations((prev) => prev.filter((obs) => obs.id !== id));
        alert("Observación eliminada exitosamente.");
      } catch (error) {
        console.error("Error al eliminar la observación:", error);
        alert("Error al eliminar la observación.");
      }
    }
  };
  

  

  // Abrir y cerrar detalles de mantenimientos
  const handleOpenMaintenances = async (asset) => {
    try {
      setSelectedAsset(asset); // Establece el equipo seleccionado
      const response = await axios.get(`http://localhost:3000/api/assets/${asset.id}`);
      setMaintenances(response.data.maintenances || []); // Obtén mantenimientos del equipo
      setMaintenancesDrawerOpen(true);
    } catch (error) {
      console.error("Error al obtener los mantenimientos:", error);
    }
  };

  const handleCloseMaintenances = () => {
    setMaintenancesDrawerOpen(false);
    setMaintenances([]);
  };

  // Guardar un nuevo mantenimiento
  const handleSaveMaintenance = async () => {
    if (!selectedAsset) {
      alert("Por favor selecciona un equipo antes de guardar un mantenimiento.");
      return;
    }

    const payload = {
      asset_id: selectedAsset.id,
      description: newMaintenance.description,
      cost: newMaintenance.cost,
      performed_by: newMaintenance.performed_by,
    };

    try {
      const response = await axios.post('/maintenance-records', payload);
      setMaintenances((prevMaintenances) => [...prevMaintenances, response.data]); // Agregar nuevo mantenimiento
      setNewMaintenance({ description: "", cost: "", performed_by: "" }); // Restablecer formulario
      setShowAddMaintenance(false); // Cerrar modal
      alert('Mantenimiento guardado exitosamente.');
    } catch (error) {
      console.error("Error al guardar el mantenimiento:", error);
      alert('Error al guardar el mantenimiento.');
    }
  };

  // Actualizar un mantenimiento existente
  const handleUpdateMaintenance = async () => {
    if (!selectedMaintenanceId) {
      alert("No se ha seleccionado ningún mantenimiento para actualizar.");
      return;
    }

    const payload = {
      description: newMaintenance.description,
      cost: newMaintenance.cost,
      performed_by: newMaintenance.performed_by,
    };

    try {
      await axios.put(`/maintenance-records/${selectedMaintenanceId}`, payload);
      alert('Mantenimiento actualizado exitosamente.');

      // Actualiza los mantenimientos locales
      setMaintenances((prev) =>
        prev.map((mnt) =>
          mnt.id === selectedMaintenanceId ? { ...mnt, ...payload } : mnt
        )
      );

      // Limpia el formulario
      setNewMaintenance({ description: "", cost: "", performed_by: "" });
      setSelectedMaintenanceId(null);
      setShowAddMaintenance(false);
    } catch (error) {
      console.error("Error al actualizar el mantenimiento:", error);
      alert('Error al actualizar el mantenimiento.');
    }
  };

  // Editar mantenimiento
  const handleEditMaintenance = (maintenance) => {
    setNewMaintenance({
      description: maintenance.description,
      cost: maintenance.cost,
      performed_by: maintenance.performed_by,
    });
    setSelectedMaintenanceId(maintenance.id); // Establece el ID del mantenimiento a editar
    setShowAddMaintenance(true); // Abre el formulario de mantenimiento
  };

  // Eliminar un mantenimiento
  const handleDeleteMaintenance = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este mantenimiento?")) {
      try {
        await axios.delete(`/maintenance-records/${id}`);
        setMaintenances((prev) => prev.filter((mnt) => mnt.id !== id));
        alert("Mantenimiento eliminado exitosamente.");
      } catch (error) {
        console.error("Error al eliminar el mantenimiento:", error);
        alert("Error al eliminar el mantenimiento.");
      }
    }
  };


  

  if (!location) {
    return <p className="text-center mt-4">Cargando detalles de la locación...</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">{location.name}</h1>
      <p className="text-center">{location.description}</p>

      {/* Mostrar la imagen del classroom */}
      {location.classroom && (
        <div className="text-center my-4">
          <img
            src={`/classrooms/${location.classroom}.png`} // Ruta de la imagen basada en el campo classroom
            alt={`Classroom ${location.classroom}`}
            className="img-fluid"
            style={{
              maxWidth: "500px",
              height: "auto",
              border: "2px solid #61dafb",
              borderRadius: "10px",
            }}
          />
          
           

          <p className="mt-3" style={{ color: "#61dafb" }}>
            Aula: {location.classroom}
          </p>
        </div>
      )}

      <div className="container mt-4">
        <h2 className="mb-4" style={{ color: "#61dafb" }}>Significado de los Iconos</h2>
        <div className="d-flex flex-wrap justify-content-start text-center" style={{ gap: "2rem" }}>
          <div>
            <i className="fa-solid fa-display fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Monitor</p>
          </div>
          <div>
            <i className="fa-solid fa-computer fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Computadora All-in</p>
          </div>
          <div>
            <i className="fa-solid fa-phone fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Teléfono</p>
          </div>
          <div>
            <i className="fa-solid fa-mattress-pillow fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Cortina</p>
          </div>
          <div>
            <i className="fa-solid fa-bolt fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Regulador de Voltaje</p>
          </div>
          <div>
            <i className="fa-solid fa-laptop fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Laptop</p>
          </div>
          <div>
            <i className="fa-solid fa-print fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Impresora</p>
          </div>
          <div>
            <i className="fa-solid fa-chalkboard-user fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Pizarrón Proyector</p>
          </div>
          <div>
            <i className="fa-solid fa-tv fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Televisión</p>
          </div>
          <div>
            <i className="fa-solid fa-fingerprint fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Reloj Checador</p>
          </div>
          <div>
            <i className="fa-solid fa-volume-high fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Bocina</p>
          </div>
          <div>
            <i className="fa-solid fa-house-signal fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Modem Wifi</p>
          </div>
        </div>
      </div>


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
            <th>Tipo</th> {/* Actualización para mostrar el ícono */}
            <th>Descripción</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Resguardante</th>
            <th>Estado</th>
            <th>Acciones</th>
            <th>Detalles</th> {/* Nuevo campo */}
            <th>Observaciones</th> {/* Nuevo campo */}
            <th>Mantenimientos</th> {/* Nuevo campo */}
          </tr>
        </thead>
        <tbody>
          {location.assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.id}</td>
              <td>
                <i className={`fa-solid ${asset.icon} fa-2x`} style={{ color: "#61dafb" }}></i>
              </td> {/* Se muestra el ícono aquí */}
              <td>{asset.descripcion}</td>
              <td>{asset.marca}</td>
              <td>{asset.modelo}</td>
              <td>{asset.resguardante}</td>
              <td style={{ color: asset.status ? "blue" : "red" }}>
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
                {/* Nuevo botón "Ver Más Detalles" */}
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleOpenDetails(asset)}                  >
                    <i class="fa-solid fa-info"></i>
                  </button>
                </td>
                {/* Nuevo botón "Observaciones" */}
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenObservations(asset)} 
                  >
                    <i class="fa-regular fa-eye"></i>
                  </button>
                </td>
                {/* Nuevo botón "Mantenimientos" */}
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenMaintenances(asset)}
                    >
                    <i class="fa-solid fa-screwdriver-wrench"></i>
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
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.descripcion}
                    onChange={(e) => setNewAsset({ ...newAsset, descripcion: e.target.value })}
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>Marca</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.marca}
                    onChange={(e) => setNewAsset({ ...newAsset, marca: e.target.value })}
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>Modelo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.modelo}
                    onChange={(e) => setNewAsset({ ...newAsset, modelo: e.target.value })}
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>Número de Serie</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.numero_de_serie}
                    onChange={(e) => setNewAsset({ ...newAsset, numero_de_serie: e.target.value })}
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>Número de Activo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.numero_de_activo}
                    onChange={(e) => setNewAsset({ ...newAsset, numero_de_activo: e.target.value })}
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>COG</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.cog}
                    onChange={(e) => setNewAsset({ ...newAsset, cog: e.target.value })}
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>Resguardante</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAsset.resguardante}
                    onChange={(e) => setNewAsset({ ...newAsset, resguardante: e.target.value })}
                  />
                </div>
                <div className="mb-3 text-start">
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
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>Tipo (Ícono)</label>
                  <select
                    className="form-control"
                    value={newAsset.icon}
                    onChange={(e) => setNewAsset({ ...newAsset, icon: e.target.value })}
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="fa-display">Monitor</option>
                    <option value="fa-computer">Computadora All-in</option>
                    <option value="fa-phone">Teléfono</option>
                    <option value="fa-mattress-pillow">Cortina</option>
                    <option value="fa-bolt">Regulador de Voltaje</option>
                    <option value="fa-laptop">Laptop</option>
                    <option value="fa-print">Impresora</option>
                    <option value="fa-chalkboard-user">Pizarrón Proyector</option>
                    <option value="fa-tv">Televisión</option>
                    <option value="fa-fingerprint">Reloj Checador</option>
                    <option value="fa-volume-high">Bocina</option>
                    <option value="fa-house-signal">Modem Wifi</option>
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
                <div className="mb-3 text-start">
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
                <div className="mb-3 text-start">
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
                <div className="mb-3 text-start">
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
                <div className="mb-3 text-start">
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
                <div className="mb-3 text-start">
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
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>COG</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedAsset.cog}
                    onChange={(e) =>
                      setSelectedAsset({ ...selectedAsset, cog: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3 text-start">
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
                <div className="mb-3 text-start">
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
                <div className="mb-3 text-start">
                  <label className="form-label" style={{ color: "#61dafb" }}>Tipo (Ícono)</label>
                  <select
                    className="form-control"
                    value={selectedAsset.icon}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, icon: e.target.value })}
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="fa-display">Monitor</option>
                    <option value="fa-computer">Computadora All-in</option>
                    <option value="fa-phone">Teléfono</option>
                    <option value="fa-mattress-pillow">Cortina</option>
                    <option value="fa-bolt">Regulador de Voltaje</option>
                    <option value="fa-laptop">Laptop</option>
                    <option value="fa-print">Impresora</option>
                    <option value="fa-chalkboard-user">Pizarrón Proyector</option>
                    <option value="fa-tv">Televisión</option>
                    <option value="fa-fingerprint">Reloj Checador</option>
                    <option value="fa-volume-high">Bocina</option>
                    <option value="fa-house-signal">Modem Wifi</option>
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


      {/* SwipeableDrawer para los detalles */}
      <SwipeableDrawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDetails}
        onOpen={() => {}}
      >
        <Box
          sx={{
            width: 400,
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh", // Asegura que cubra toda la ventana
            bgcolor: "#2b2f38", // Fondo oscuro
            color: "#ffffff", // Texto claro
            overflowY: "auto", // Permite scroll si el contenido es demasiado alto
          }}
        >
          {selectedAsset ? (
            <div style={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  color: "#61dafb",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Detalles del Equipo
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>ID:</strong> {selectedAsset.id}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Descripción:</strong> {selectedAsset.descripcion}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Marca:</strong> {selectedAsset.marca}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Modelo:</strong> {selectedAsset.modelo}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Número de Serie:</strong> {selectedAsset.numero_de_serie}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Número de Activo:</strong> {selectedAsset.numero_de_activo}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>COG:</strong> {selectedAsset.cog}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Resguardante:</strong> {selectedAsset.resguardante}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Estado:</strong>{" "}
                <span
                  style={{
                    color: selectedAsset.status ? "blue" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {selectedAsset.status ? "Activo" : "Inactivo"}
                </span>
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Icono:</strong>{" "}
                <i className={`fa-solid ${selectedAsset.icon}`} style={{ color: "#61dafb" }}></i>
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Ubicación ID:</strong> {selectedAsset.location_id}
              </Typography>
            </div>
          ) : (
            <Typography variant="body1">No hay información disponible.</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseDetails}
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#61dafb",
              color: "#1e1e2f",
              fontWeight: "bold",
              ":hover": {
                backgroundColor: "#50b5e8",
              },
            }}
          >
            CERRAR
          </Button>
        </Box>
      </SwipeableDrawer>


       {/* SwipeableDrawer para las observaciones */}
       <SwipeableDrawer
          anchor="right"
          open={observationsDrawerOpen}
          onClose={handleCloseObservations}
        >
          <Box
            sx={{
              width: 400,
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100vh", // Asegura que cubra toda la ventana
              bgcolor: "#2b2f38", // Fondo oscuro
              color: "#ffffff", // Texto claro
              overflowY: "auto", // Permite scroll si el contenido es demasiado alto
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ mb: 3, color: "#61dafb" }}>
                Observaciones del Equipo
              </Typography>

              <Button
                variant="contained"
                sx={{
                  mb: 3,
                  bgcolor: "#61dafb",
                  color: "#000",
                  fontWeight: "bold",
                }}
                onClick={() => setShowAddObservation(true)}
              >
                Agregar Nueva Observación
              </Button>

              {showAddObservation && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    border: "1px solid #61dafb",
                    borderRadius: "8px",
                    bgcolor: "#29293d",
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 2, color: "#61dafb" }}>
                    Nueva Observación
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "#ffffff" }}>
                      Observación:
                    </Typography>
                    <textarea
                      rows="4"
                      style={{
                        width: "100%",
                        background: "#1e1e2f",
                        color: "#ffffff",
                        border: "1px solid #61dafb",
                        borderRadius: "5px",
                        padding: "10px",
                      }}
                      onChange={(e) =>
                        setNewObservation({ ...newObservation, observation: e.target.value })
                      }
                      value={newObservation.observation || ""}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "#ffffff" }}>
                      Observado por:
                    </Typography>
                    <input
                      type="text"
                      style={{
                        width: "100%",
                        background: "#1e1e2f",
                        color: "#ffffff",
                        border: "1px solid #61dafb",
                        borderRadius: "5px",
                        padding: "10px",
                      }}
                      onChange={(e) =>
                        setNewObservation({ ...newObservation, observed_by: e.target.value })
                      }
                      value={newObservation.observed_by || ""}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#61dafb",
                      color: "#000",
                      fontWeight: "bold",
                      ":hover": {
                        bgcolor: "#50b5e8",
                      },
                    }}
                    onClick={handleSaveObservation}
                  >
                    Guardar Observación
                  </Button>
                </Box>
              )}

              {observations.length > 0 ? (
                observations.map((obs) => (
                  <Box
                    key={obs.id}
                    sx={{
                      mb: 4,
                      p: 3,
                      border: "1px solid #61dafb",
                      borderRadius: "8px",
                      bgcolor: "#29293d",
                    }}
                  >
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Observación:</strong> {obs.observation}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Fecha:</strong> {new Date(obs.observed_at).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Observado por:</strong> {obs.observed_by}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px", mt: 2 }}>
                      <Button
                        variant="contained"
                        
                        sx={{
                          bgcolor: "#fbc02d",
                          color: "#000",
                          ":hover": { bgcolor: "#f9a825" },
                        }}
                        onClick={() => handleEditObservation(obs)}
                      >
                          <i className="fa-solid fa-pen-to-square"></i>
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#d32f2f",
                          color: "#fff",
                          ":hover": { bgcolor: "#c62828" },
                        }}
                        onClick={() => handleDeleteObservation(obs.id)}
                      >
                          <i className="fa-solid fa-trash"></i>
                      </Button>
                    </Box>
                  </Box>

                ))
              ) : (
                <Typography>No hay observaciones disponibles</Typography>
              )}

            </Box>

            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#61dafb",
                color: "#000",
                fontWeight: "bold",
              }}
              onClick={handleCloseObservations}
            >
              Cerrar
            </Button>
          </Box>
        </SwipeableDrawer>

        


        {/* SwipeableDrawer para los mantenimientos */}
        <SwipeableDrawer
          anchor="right"
          open={maintenancesDrawerOpen}
          onClose={handleCloseMaintenances}
        >
          <Box
            sx={{
              width: 400,
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              bgcolor: "#2b2f38",
              color: "#ffffff",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 3, color: "#61dafb", textAlign: "center", fontWeight: "bold" }}
            >
              Mantenimientos del Equipo
            </Typography>

            <Button
              variant="contained"
              sx={{
                mb: 2,
                bgcolor: "#61dafb",
                color: "#000",
                fontWeight: "bold",
                ":hover": { bgcolor: "#50b5e8" },
              }}
              onClick={() => setShowAddMaintenance(true)}
            >
              Agregar Nuevo Mantenimiento
            </Button>

            {/* Formulario para agregar o editar mantenimiento */}
            {showAddMaintenance && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  border: "1px solid #61dafb",
                  borderRadius: "8px",
                  bgcolor: "#29293d",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: "#61dafb", textAlign: "center" }}
                >
                  {selectedMaintenanceId ? "Editar Mantenimiento" : "Nuevo Mantenimiento"}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#ffffff" }}>
                    Descripción:
                  </Typography>
                  <textarea
                    rows="3"
                    style={{
                      width: "100%",
                      background: "#1e1e2f",
                      color: "#ffffff",
                      border: "1px solid #61dafb",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                    value={newMaintenance.description || ""}
                    onChange={(e) =>
                      setNewMaintenance({ ...newMaintenance, description: e.target.value })
                    }
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#ffffff" }}>
                    Costo:
                  </Typography>
                  <input
                    type="number"
                    style={{
                      width: "100%",
                      background: "#1e1e2f",
                      color: "#ffffff",
                      border: "1px solid #61dafb",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                    value={newMaintenance.cost || ""}
                    onChange={(e) =>
                      setNewMaintenance({ ...newMaintenance, cost: e.target.value })
                    }
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#ffffff" }}>
                    Realizado por:
                  </Typography>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      background: "#1e1e2f",
                      color: "#ffffff",
                      border: "1px solid #61dafb",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                    value={newMaintenance.performed_by || ""}
                    onChange={(e) =>
                      setNewMaintenance({
                        ...newMaintenance,
                        performed_by: e.target.value,
                      })
                    }
                  />
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    bgcolor: "#61dafb",
                    color: "#000",
                    fontWeight: "bold",
                    ":hover": { bgcolor: "#50b5e8" },
                  }}
                  onClick={
                    selectedMaintenanceId
                      ? handleUpdateMaintenance
                      : handleSaveMaintenance
                  }
                >
                  {selectedMaintenanceId ? "Actualizar Mantenimiento" : "Guardar Mantenimiento"}
                </Button>
              </Box>
            )}

            {/* Lista de mantenimientos */}
            {maintenances.length > 0 ? (
              maintenances.map((mnt) => (
                <Box
                  key={mnt.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid #61dafb",
                    borderRadius: "8px",
                    bgcolor: "#29293d",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Descripción:</strong> {mnt.description}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Costo:</strong> ${mnt.cost}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Realizado por:</strong> {mnt.performed_by}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "1rem",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "#ffc107",
                        color: "#000",
                        ":hover": { bgcolor: "#e0a800" },
                      }}
                      onClick={() => handleEditMaintenance(mnt)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "#dc3545",
                        color: "#fff",
                        ":hover": { bgcolor: "#c82333" },
                      }}
                      onClick={() => handleDeleteMaintenance(mnt.id)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>No hay mantenimientos disponibles</Typography>
            )}

            {/* Botón para cerrar la modal */}
            <Button
              variant="contained"
              sx={{
                mt: "auto",
                bgcolor: "#61dafb",
                color: "#000",
                fontWeight: "bold",
                ":hover": { bgcolor: "#50b5e8" },
              }}
              onClick={handleCloseMaintenances}
            >
              Cerrar
            </Button>
          </Box>
        </SwipeableDrawer>









    </div>
  );
};


export default LocationDetails;
