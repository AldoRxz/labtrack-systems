import React, { useState, useEffect } from "react";
import axios from "../axios/axiosConfig";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { deepOrange } from "@mui/material/colors";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Grid, Container } from "@mui/material";


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

  const [searchQuery, setSearchQuery] = useState(""); 
  const [assets, setAssets] = useState([]); 


  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username")|| "Usuario"; 

    if (!token) {
      alert("Debes iniciar sesión para acceder a esta página.");
      navigate("/"); 
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
    localStorage.removeItem("token"); 
    localStorage.removeItem("username"); 
    navigate("/"); 
  };


  const handleExportToExcel = async () => {
    try {
      const response = await axios.get("/locations/details");
      const locations = response.data;
  
      // Crear un libro de Excel
      const workbook = XLSX.utils.book_new();
  
      // **Hoja General de Locaciones**
      const allLocationsSheetData = locations.map((location) => ({
        "ID Locación": location.id,
        "Nombre": location.name,
        "Descripción": location.description,
        "Piso": location.piso,
        "Aula": location.classroom,
      }));
  
      const allLocationsSheet = XLSX.utils.json_to_sheet(allLocationsSheetData);
      XLSX.utils.book_append_sheet(workbook, allLocationsSheet, "Todas las Locaciones");
  
      // **Procesar cada locación**
      locations.forEach((location) => {
        // Crear hoja para la locación con los activos
        const assetsSheetData = location.assets.map((asset) => ({
          "ID Activo": asset.id,
          "Descripción": asset.descripcion,
          "Marca": asset.marca,
          "Modelo": asset.modelo,
          "Número de Serie": asset.numero_de_serie,
          "Número de Activo": asset.numero_de_activo,
          "COG": asset.cog,
          "Resguardante": asset.resguardante,
          "Estado": asset.status ? "Activo" : "Inactivo",
        }));
  
        const assetsSheet = XLSX.utils.json_to_sheet(assetsSheetData);
        XLSX.utils.book_append_sheet(workbook, assetsSheet, `Locación ${location.id} - Activos`);
  
        // **Procesar cada activo dentro de la locación**
        location.assets.forEach((asset) => {
          const sheetData = [];
  
          // Tabla de Observaciones
          sheetData.push(["Observaciones"]);
          sheetData.push([
            "ID Observación",
            "Observación",
            "Fecha de Observación",
            "Observado por",
          ]);
          asset.observations.forEach((observation) => {
            sheetData.push([
              observation.id,
              observation.observation,
              observation.observed_at,
              observation.observed_by,
            ]);
          });
  
          // Espacio entre tablas
          sheetData.push([]);
          sheetData.push([]);
  
          // Tabla de Mantenimientos
          sheetData.push(["Mantenimientos"]);
          sheetData.push([
            "ID Mantenimiento",
            "Fecha de Mantenimiento",
            "Descripción",
            "Costo",
            "Realizado por",
            "Creado por",
          ]);
          asset.maintenances.forEach((maintenance) => {
            sheetData.push([
              maintenance.id,
              maintenance.maintenance_date,
              maintenance.description,
              maintenance.cost,
              maintenance.performed_by,
              maintenance.created_by,
            ]);
          });
  
          // Crear hoja para el activo
          const assetSheet = XLSX.utils.aoa_to_sheet(sheetData);
          XLSX.utils.book_append_sheet(workbook, assetSheet, `Activo ${asset.id}`);
        });
      });
  
      // Generar archivo Excel
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "Sistemas_Detallado.xlsx");
      console.log("Archivo Excel generado correctamente.");
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Por favor, ingrese un término de búsqueda.");
      return;
    }

    try {
      const response = await axios.get(
        `/locations/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = response.data;

      const allAssets = data.flatMap((location) => location.assets || []);
      setAssets(allAssets); 
      setLocations(data); 
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    }
  };

  const handleGoToLocation = (locationId) => {
    navigate(`/locations/${locationId}`);
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
          justifyContent: "space-between", 
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
            position: "absolute", 
            left: "50%",
            transform: "translateX(-50%)", 
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Locaciones
        </h1>
      </div>

      <div className="container mt-4">
      <div className="d-flex justify-content-center mb-3">
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <InputBase
            style={{ marginLeft: 8, flex: 1 }}
            placeholder="Buscar equipo"
            inputProps={{ "aria-label": "Buscar equipo" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton
            type="button"
            style={{ padding: 10 }}
            aria-label="search"
            onClick={handleSearch}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>

      {/* Tabla de Assets */}
      {assets.length > 0 ? (
        <div>
          <h2 className="text-center">Assets Encontrados</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Número de Serie</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.id}</td>
                  <td>{asset.descripcion}</td>
                  <td>{asset.marca}</td>
                  <td>{asset.modelo}</td>
                  <td>{asset.numero_de_serie}</td>
                  <td>{asset.status ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleGoToLocation(asset.location_id)}
                    >
                      Ir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // eslint-disable-next-line
        <h5 className="text-center mt-4"></h5>
      )}
    </div>


      {/* Botón para exportar a Excel */}
      <div>
      <button
        className="btn btn-success mb-3"
          onClick={handleExportToExcel}
        >
          Exportar toda la información a Excel
      </button>
      </div>


      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Agregar Locación
      </button>
      <Grid
        container
        sx={{
          justifyContent:"center"
        }}      
      >
      {Object.keys(groupedLocations)
        .sort((a, b) => a - b) // Ordenar por número de piso
        .map((piso) => (
          <Grid 
          item
          xs={12}
          md={6}
          lg={6}
          >
            <h2 className="text-center">Piso {piso}</h2>
            {/* Mostrar imagen según el piso */}
            {piso === "1" && ( 
              <div className="text-center">
                <img
                  src="/planta_baja.png"
                  alt="Planta Baja"
                  className="img-fluid mb-4"
                  style={{ maxWidth: "90%", height: "auto" }} 
                />
              </div>
            )}
            {piso === "2" && ( 
              <div className="text-center">
                <img
                  src="/planta_alta.png"
                  alt="Planta Alta"
                  className="img-fluid mb-4"
                  style={{ maxWidth: "90%", height: "auto" }} 
                />
              </div>
            )}
          <Container>
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
            </Container>
          </Grid>
        ))}
      </Grid>

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