import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axios/axiosConfig";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const LocationDetails = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); // Modal para agregar equipo
  const [showEditModal, setShowEditModal] = useState(false); // Modal para editar equipo
  
  const [selectedAsset, setSelectedAsset] = useState(null); // Equipo seleccionado para editar
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para el SwipeableDrawer


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

  const handleOpenDetails = (asset) => {
    setSelectedAsset(asset);
    setDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setDrawerOpen(false);
    setSelectedAsset(null);
  };

  if (!location) {
    return <p className="text-center mt-4">Cargando detalles de la locación...</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">{location.name}</h1>
      <p className="text-center">{location.description}</p>

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
                    onClick={() => alert("Abrir modal para observaciones")}
                  >
                    <i class="fa-regular fa-eye"></i>
                  </button>
                </td>
                {/* Nuevo botón "Mantenimientos" */}
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => alert("Abrir modal para mantenimientos")}
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
            height: "100%",
            bgcolor: "#2b2f38", // Fondo oscuro
            color: "#ffffff", // Texto claro
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



    </div>
  );
};


export default LocationDetails;
