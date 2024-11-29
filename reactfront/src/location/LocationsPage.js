import React, { useState, useEffect } from "react";
import axios from "../axios/axiosConfig";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { deepOrange } from "@mui/material/colors";


const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [username, setUsername] = useState(""); 
  const navigate = useNavigate();
  const [newLocation, setNewLocation] = useState({
    name: "",
    description: "",
    piso: "",
    classroom: "",
  });
  const [editLocation, setEditLocation] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username")|| "Usuario"; // Recupera el nombre de usuario

    if (!token) {
      alert("Debes iniciar sesión para acceder a esta página.");
      navigate("/"); // Redirects to login if token is missing
      return;
    }
    setUsername(savedUsername);

    const fetchLocations = async () => {
      try {
        const response = await axios.get("/locations");
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
  
    fetchLocations();
  }, [navigate]); 


  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token
    localStorage.removeItem("username"); // Elimina el nombre de usuario
    navigate("/"); // Redirige al login
  };

  const handleAddLocation = async () => {
    if (!newLocation.name || !newLocation.piso || !newLocation.classroom) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
    try {
      const response = await axios.post("/locations", newLocation);
      setLocations([...locations, response.data]);
      setNewLocation({ name: "", description: "", piso: "",  classroom: ""  });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleEditLocation = async () => {
    if (!editLocation.name || !editLocation.piso || !editLocation.classroom) {
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

  const classroomOptions = ["LDS", "LIA", "LIS", "LRD", "LTE", "LTI", "LWI"];

  return (
    <div className="container mt-4">
      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Distribuye el espacio entre los elementos
          alignItems: "center",
        }}
      >

        {/* Usuario */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          <Avatar
            sx={{
              bgcolor: deepOrange[500],
              width: 56,
              height: 56,
              marginBottom: "5px",
            }}
          >
            {username[0]?.toUpperCase()}
          </Avatar>
          <Typography
            variant="subtitle1"
            style={{ fontWeight: "bold", marginBottom: "5px" }}
          >
            {username}
          </Typography>
          <button
            className="btn btn-danger btn-sm"
            style={{ padding: "5px 15px", fontSize: "14px" }}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
        
        {/* Título */}
        <h1
          style={{
            position: "absolute", // Usa posición absoluta para centrarlo
            left: "50%",
            transform: "translateX(-50%)", // Mueve el título a la posición centrada
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Locaciones
        </h1>
      </div>

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

            {/* Mostrar imagen según el piso */}
            {piso === "1" && ( // Comparación estricta con cadena
              <div className="text-center">
                <img
                  src="/planta_baja.png"
                  alt="Planta Baja"
                  className="img-fluid mb-4"
                  style={{ maxWidth: "600px", height: "auto" }} // Cambia el tamaño de la imagen
                />
              </div>
            )}
            {piso === "2" && ( // Comparación estricta con cadena
              <div className="text-center">
                <img
                  src="/planta_alta.png"
                  alt="Planta Alta"
                  className="img-fluid mb-4"
                  style={{ maxWidth: "600px", height: "auto" }} // Cambia el tamaño de la imagen
                />
              </div>
            )}

            {/* Tabla de locaciones del piso */}
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Piso</th>
                  <th>Aula</th>
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
                    <td>{location.classroom}</td>
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
                <div className="mb-3">
                  <label className="form-label">Aula</label>
                  <select
                    className="form-control"
                    value={newLocation.classroom}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        classroom: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccione una aula</option>
                    {classroomOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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
                <div className="mb-3">
                  <label className="form-label">Aula</label>
                  <select
                    className="form-control"
                    value={editLocation.classroom || ""}
                    onChange={(e) =>
                      setEditLocation({
                        ...editLocation,
                        classroom: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccione una aula</option>
                    {classroomOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
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