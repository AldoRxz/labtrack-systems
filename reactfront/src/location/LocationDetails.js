import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axios/axiosConfig";
import { useNavigate } from "react-router-dom";
import DragAndDropLayout from "../dragAndDrop/dNd";
import LTE from "../dragAndDrop/LTE";
import LWI from "../dragAndDrop/LWI";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { deepOrange } from "@mui/material/colors";


import {
  Box,
  SwipeableDrawer,
  Button,
} from "@mui/material";

const LocationDetails = () => {
  const { id } = useParams();
  const [username, setUsername] = useState(""); 

  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false); 
  
  const [newAsset, setNewAsset] = useState({
    descripcion: "",
    marca: "",
    modelo: "",
    numero_de_serie: "",
    numero_de_activo: "",
    resguardante: "",
    status: true,
  });

  const [selectedAsset, setSelectedAsset] = useState(null); 
  const [drawerOpen, setDrawerOpen] = useState(false); 
  
  const [observationsDrawerOpen, setObservationsDrawerOpen] = useState(false);
  const [observations, setObservations] = useState([]);
  const [showAddObservation, setShowAddObservation] = useState(false);
  const [selectedObservationId, setSelectedObservationId] = useState(null);
  const [newObservation, setNewObservation] = useState({
    observation: "",
    observed_by: "",
  });

  
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState(null); 
  const [newMaintenance, setNewMaintenance] = useState({
    description: "",
    cost: "",
    performed_by: "",
  });

  const [maintenancesDrawerOpen, setMaintenancesDrawerOpen] = useState(false);
  const [maintenances, setMaintenances] = useState([]);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);


  const [filters, setFilters] = useState({
    status: "", 
    type: "", 
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredAssets =
  location && location.assets && location.transferredAssets
  ? [...(location.assets || []), ...(location.transferredAssets || [])].filter((asset) => {
        const matchesStatus =
          filters.status === "" || asset.status.toString() === filters.status;
        const matchesType = filters.type === "" || asset.icon === filters.type;
        return matchesStatus && matchesType;
      })
    : [];



  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username") || "Usuario";

    if (!token) {
      alert("Debes iniciar sesión para acceder a esta página.");
      navigate("/"); 
      return;
    }
    setUsername(savedUsername);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchLocationDetails = async () => {
      try {
        const response = await axios.get(`/locations/${id}`);
        setLocation(response.data);
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    };

    fetchLocationDetails();
  }, [id, navigate]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const [excelData, setExcelData] = useState(null); 

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
     
      const headers = jsonData[0]; 
      const rows = jsonData.slice(1); 

      const formattedData = rows.map((row) => {
        return {
          descripcion: row[headers.indexOf("Descripcion")] || "",
          marca: row[headers.indexOf("MARCA")] || "",
          modelo: row[headers.indexOf("MODELO")] || "",
          numero_de_serie: row[headers.indexOf("NUMERO DE SERIE")] || "",
          numero_de_activo: row[headers.indexOf("NUMERO DE ACTIVO")] || "",
          cog: row[headers.indexOf("COG")] || "",
          resguardante: row[headers.indexOf("RESGUARDANTE")] || "",
          icon: row[headers.indexOf("ICON")] || "",
          location_id: id, 
        };
      });
  
      setExcelData(formattedData);
      alert("Archivo procesado con éxito.");
    };
    reader.readAsArrayBuffer(file);
  };


  const handleSubmitExcelData = async () => {
    if (!excelData) {
      alert("No hay datos para enviar. Por favor, carga un archivo Excel.");
      return;
    }

    try {
      const promises = excelData.map((asset) =>
        axios.post("/assets", asset)
      );

      await Promise.all(promises);
      alert("Datos subidos con éxito.");
      setExcelData(null);
    } catch (error) {
      console.error("Error al enviar datos:", error);
      alert("Hubo un problema al procesar los datos.");
    }
  };


  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(`/locations/details/${id}`);
      const data = response.data;
  
      // Procesa los datos para Excel
      const locationInfo = [
        {
          "Location ID": data.id,
          "Location Name": data.name,
          "Description": data.description,
          "Classroom": data.classroom,
          "Floor": data.piso,
        },
      ];

      const assets = data.assets.map(asset => ({
        "Asset ID": asset.id,
        "Description": asset.descripcion,
        "Brand": asset.marca,
        "Model": asset.modelo,
        "Serial Number": asset.numero_de_serie,
        "Active Number": asset.numero_de_activo,
        "COG": asset.cog,
        "Custodian": asset.resguardante,
        "Status": asset.status ? "Active" : "Inactive",
        "Icon": asset.icon,
        "Observations": asset.observations.map(obs => `${obs.observation} (by ${obs.observed_by} at ${obs.observed_at})`).join("; "),
        "Maintenances": asset.maintenances.map(maint => `${maint.description} on ${maint.maintenance_date} (Cost: ${maint.cost})`).join("; "),
      }));

      // Crea un libro y hojas de Excel
      const excelWorkbook = XLSX.utils.book_new();
      const locationSheet = XLSX.utils.json_to_sheet(locationInfo);
      const assetsSheet = XLSX.utils.json_to_sheet(assets);

      XLSX.utils.book_append_sheet(excelWorkbook, locationSheet, "Location Info");
      XLSX.utils.book_append_sheet(excelWorkbook, assetsSheet, "Assets");

      // Genera el archivo Excel
      const excelBuffer = XLSX.write(excelWorkbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

      // Descarga el archivo
      saveAs(blob, `location_details_${data.id}.xlsx`);
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };


  const handleAddAsset = async () => {
    try {
      // Asegúrate de incluir el campo "location_id"
      const assetData = {
        ...newAsset,
        location_id: id, 
      };
  
      console.log("Datos enviados al backend:", assetData);
  
      // Realiza la solicitud POST al backend
      const response = await axios.post("/assets", assetData);
  
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
        `/assets/${selectedAsset.id}`, 
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
      await axios.delete(`/assets/${assetId}`); 
  
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
      const response = await axios.get(`/assets/${asset.id}`);
      setObservations(response.data.observations || []); 
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
      setSelectedObservationId(null); 
      setShowAddObservation(false); 
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
    setSelectedObservationId(observation.id); 
    setShowAddObservation(true); 
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
      setSelectedAsset(asset); 
      const response = await axios.get(`/assets/${asset.id}`);
      setMaintenances(response.data.maintenances || []); 
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
      created_by: username,
    };

    try {
      const response = await axios.post('/maintenance-records', payload);
      setMaintenances((prevMaintenances) => [...prevMaintenances, response.data]); 

      // Cambia el estado del asset a inactivo
      await axios.put(`/assets/${selectedAsset.id}`, { ...selectedAsset, status: false });
      setLocation((prevLocation) => ({
        ...prevLocation,
        assets: prevLocation.assets.map((asset) =>
          asset.id === selectedAsset.id ? { ...asset, status: false } : asset
        ),
      }));

      setNewMaintenance({ description: "", cost: "", performed_by: "" }); 
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
    setSelectedMaintenanceId(maintenance.id); 
    setShowAddMaintenance(true); 
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


  const [traceabilityDrawerOpen, setTraceabilityDrawerOpen] = useState(false); // Estado para el drawer de trazabilidad
  const [isTraceabilityLoading, setIsTraceabilityLoading] = useState(false); // Estado de carga
  const [traceabilityAsset, setTraceabilityAsset] = useState(null); // Estado para el equipo seleccionado
  const [traceabilityLocation, setTraceabilityLocation] = useState(null); // Estado para guardar la locación



  const handleOpenTraceability = async (asset) => {
    setIsTraceabilityLoading(true);
    try {
      const response = await axios.get(`/locations/${asset.location_id}`); // Llamada a la API
      const locationDetails = response.data;
  
      // Encuentra el equipo dentro de la locación
      const foundAsset = locationDetails.assets.find((a) => a.id === asset.id);
  
      setTraceabilityLocation(locationDetails); // Guarda los detalles de la locación
      setTraceabilityAsset(foundAsset); // Guarda los detalles del equipo
    } catch (error) {
      console.error("Error al obtener los datos de trazabilidad:", error);
      alert("Ocurrió un error al cargar los datos del equipo o locación.");
    } finally {
      setIsTraceabilityLoading(false);
      setTraceabilityDrawerOpen(true); // Abre el Drawer después de cargar
    }
  };


  const [locations, setLocations] = useState([]); // Estado para las locaciones disponibles

  const handleMoveLocation = async () => {
    try {
      const response = await axios.get("/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Error al obtener las locaciones:", error);
      alert("Ocurrió un error al obtener las locaciones.");
    }
  };


  const handleSelectLocation = async (locationId) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.put(`/assets/${traceabilityAsset.id}`, {
      location_transfer: locationId,
      });
      alert(`Locación actualizada exitosamente. ID de la nueva locación: ${locationId}`);
      setTraceabilityAsset({ ...traceabilityAsset, location_transfer: locationId }); // Actualiza el estado local
      
      // Actualiza la lista de activos en la tabla
      setLocation((prevLocation) => ({
        ...prevLocation,
        assets: prevLocation.assets.map((asset) =>
          asset.id === traceabilityAsset.id
            ? { ...asset, location_transfer: locationId }
            : asset
        ),
      }));
      setLocations([]); // Limpia las locaciones
    } catch (error) {
      console.error("Error al actualizar la locación:", error);
      alert("Ocurrió un error al actualizar la locación.");
    }
  };


  const handleReturnLocation = async () => {
    try {
      await axios.put(`/assets/${traceabilityAsset.id}`, {
        location_transfer: null,
      });
      alert("El activo ha regresado a su locación original.");
      
      setTraceabilityAsset({
        ...traceabilityAsset,
        location_transfer: null,
      }); 

      setLocation((prevLocation) => ({
        ...prevLocation,
        assets: prevLocation.assets.map((asset) =>
          asset.id === traceabilityAsset.id
            ? { ...asset, location_transfer: null }
            : asset
        ),
      }));
    } catch (error) {
      console.error("Error al regresar a la locación original:", error);
      alert("Ocurrió un error al intentar regresar a la locación original.");
    }
  };
  



  if (!location) {
    return <p className="text-center mt-4">Cargando detalles de la locación...</p>;
  }

  return (
    <div className="container mt-4">
      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "20px",
        }}
      >

<Link to="/locations" className="btn btn-primary mt-4">
        Volver a Locaciones
      </Link>

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
          {location.name}
        </h1>
      </div>
      <p className="text-center">{location.description}</p>

      {/* Botón para exportar a Excel */}
      <div>
      <button
        className="btn btn-success mb-3"
          onClick={handleExportToExcel}
        >
          Exportar la información de la Ubicacióna a exel
      </button>
      </div>

      <div>
          <label className="btn btn-secondary me-2">
            Cargar Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </label>
          <button
            className="btn btn-success"
            onClick={handleSubmitExcelData}
            disabled={!excelData}
          >
            Subir Equipos desde Excel
          </button>
        </div>

      {/* Mostrar la imagen del classroom */}
      <div className="text-center my-4">
        {location.classroom === "LWI" ? (
          <>
          <Box sx={{ textAlign: "center", backgroundColor:"white", height:"100%" }}>
           <LWI data={location.assets} />
          </Box>
          </>
        ) : location.classroom === "LTE" ? (
          <>
            <Box sx={{ textAlign: "center", backgroundColor:"white", height:"100vh" }}>
           <LTE data={location.assets} />
            </Box>

          </>
        ) : location.classroom === "LIA" ? (
          <>
               <Box sx={{ textAlign: "center", backgroundColor:"white", height:"100vh" }}>
           <DragAndDropLayout data={location.assets} />
          </Box>
          </>
        ) : location.classroom === "LI" ? (
          <>
            <img
              src="/classrooms/LIS.png"
              alt="Classroom LIS"
              className="img-fluid"
              style={{
                maxWidth: "100wh",
                height: "100vh",
                border: "2px solid #4285f4",
                borderRadius: "10px",
              }}
            />
            <p className="mt-3" style={{ color: "#4285f4" }}>
              Aula: LIS
            </p>
          </>
        ) : location.classroom === "LRD" ? (
          <>
            <img
              src="/classrooms/LRD.png"
              alt="Classroom LRD"
              className="img-fluid"
              style={{
                maxWidth: "100wh",
                height: "100vh",
                border: "2px solid #ea4335",
                borderRadius: "10px",
              }}
            />
            <p className="mt-3" style={{ color: "#ea4335" }}>
              Aula: LRD
            </p>
          </>
        ) : (
          <p className="mt-3" style={{ color: "red" }}>
            Aula no reconocida
          </p>
        )}
      </div>

          {/* <p className="mt-3" style={{ color: "#61dafb" }}>
            Aula: {location.classroom}
          </p> */}


      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>Equipos</h2>
        <div className="d-flex flex-column align-items-end">
          <button
            className="btn btn-success mb-3" // Agrega margen inferior para separar el botón de los filtros
            onClick={() => setShowAddModal(true)}
          >
            Agregar Nuevo Equipo
          </button>
          <div className="d-flex gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ status: "", type: "" })}
            >
              Limpiar Filtros
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </button>
          </div>
        </div>
      </div>
        {showFilters && (
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label" style={{ color: "#61dafb" }}>
                Estado
              </label>
              <select
                className="form-control"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">Todos</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" style={{ color: "#61dafb" }}>
                Tipo
              </label>
              <select
                className="form-control"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">Todos</option>
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
                <option value="fa-video">Proyector</option>
                <option value="fa-chair">Silla</option>
                <option value="fa-box-archive">Archivero</option>
                <option value="fa-square">Mesa</option>
              </select>
            </div>

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
          <div>
            <i className="fa-solid fa-video fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Proyector</p>
          </div>
          <div>
            <i className="fa-solid fa-chair fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Silla</p>
          </div>
          <div>
            <i className="fa-solid fa-box-archive fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Archivero</p>
          </div>
          <div>
            <i className="fa-solid fa-square fa-2x" style={{ color: "#61dafb" }}></i>
            <p className="mt-2">Mesa</p>
          </div>
        </div>
      </div>
        
      </div>
      )}
      

      {filteredAssets.length > 0 ? (
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Resguardante</th>
              <th>Estado</th>
              <th>Acciones</th>
              <th>Detalles</th>
              <th>Observaciones</th>
              <th>Mantenimientos</th>
              <th>Trazabilidad</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>
                  <i
                    className={`fa-solid ${asset.icon} fa-2x`}
                    style={{ color: "#61dafb" }}
                  ></i>
                </td>
                <td>{asset.descripcion}</td>
                <td>{asset.marca}</td>
                <td>{asset.modelo}</td>
                <td>{asset.resguardante}</td>
                <td
                  style={{
                    color: asset.location_transfer ? "gray" : asset.status ? "blue" : "red",
                    fontWeight: asset.location_transfer ? "bold" : "normal",
                  }}
                >
                  {asset.location_transfer
                    ? "Transferido"
                    : asset.status
                    ? "Activo"
                    : "Inactivo"}
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
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleOpenDetails(asset)}
                  >
                    <i className="fa-solid fa-info"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenObservations(asset)}
                  >
                    <i className="fa-regular fa-eye"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenMaintenances(asset)}
                  >
                    <i className="fa-solid fa-screwdriver-wrench"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenTraceability(asset)}
                  >
                    <i class="fa-regular fa-clipboard"></i>  
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron equipos.</p>
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
                    <option value="fa-video">Proyector</option>
                    <option value="fa-chair">Silla</option>
                    <option value="fa-box-archive">Archivero</option>
                    <option value="fa-square">Mesa</option>
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
                    <option value="fa-video">Proyector</option>
                    <option value="fa-chair">Silla</option>
                    <option value="fa-box-archive">Archivero</option>
                    <option value="fa-square">Mesa</option>
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
            height: "100vh",
            bgcolor: "#2b2f38", 
            color: "#ffffff",
            overflowY: "auto", 
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
              height: "100vh", 
              bgcolor: "#2b2f38", 
              color: "#ffffff", 
              overflowY: "auto", 
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
                bgcolor: selectedAsset?.status ? "#61dafb" : "#ccc", 
                color: selectedAsset?.status ? "#000" : "#666", 
                fontWeight: "bold",
                cursor: selectedAsset?.status ? "pointer" : "not-allowed", 
                ":hover": selectedAsset?.status ? { bgcolor: "#50b5e8" } : {}, 
              }}
              disabled={!selectedAsset?.status} 
              onClick={() => setShowAddMaintenance(true)}
            >
              Agregar Nuevo Mantenimiento
            </Button>

            {!selectedAsset?.status && (
              <Button
                variant="contained"
                sx={{
                  mb: 2,
                  bgcolor: "#4caf50", 
                  color: "#fff",
                  fontWeight: "bold",
                  ":hover": { bgcolor: "#43a047" },
                }}
                onClick={async () => {
                  try {
                    const updatedAsset = { ...selectedAsset, status: true };

                    const response = await axios.put(
                      `/assets/${selectedAsset.id}`, 
                      updatedAsset 
                    );

                    setLocation((prevLocation) => ({
                      ...prevLocation,
                      assets: prevLocation.assets.map((asset) =>
                        asset.id === selectedAsset.id ? response.data : asset
                      ),
                    }));

                    // alert("El estado del equipo ha sido actualizado a 'Activo'.");
                    handleCloseMaintenances();
                  } catch (error) {
                    console.error("Error al marcar el mantenimiento como completado:", error);
                    alert("Ocurrió un error al intentar completar el mantenimiento.");
                  }
                }}
              >
                Marcar ultimo manteniminto como Completado
              </Button>
            )}

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
              maintenances
              .slice() 
              .reverse()
              .map((mnt) => (
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
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Fecha:</strong>{" "}
                    {new Date(mnt.maintenance_date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Creado por:</strong> {mnt.created_by}
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


        {/* SwipeableDrawer para la trazabilidad */}
        <SwipeableDrawer
          anchor="right"
          open={traceabilityDrawerOpen}
          onClose={() => setTraceabilityDrawerOpen(false)}
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
            {isTraceabilityLoading ? (
              <Typography variant="h5" sx={{ mb: 5, color: "#61dafb" }}>
                Cargando datos...
              </Typography>
            ) : (
              <>
                {/* Información de la Locación */}
                {traceabilityLocation && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#61dafb",
                        textAlign: "center",
                        fontWeight: "bold",
                        mb: 4,
                      }}
                    >
                      Información de la Locación Original
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Nombre:</strong> {traceabilityLocation.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Descripción:</strong> {traceabilityLocation.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Aula:</strong> {traceabilityLocation.classroom}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Piso:</strong> {traceabilityLocation.piso}
                    </Typography>
                  </Box>
                )}

                {/* Información del Equipo */}
                {traceabilityAsset && (
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      border: "1px solid #61dafb",
                      borderRadius: "8px",
                      bgcolor: "#1e1e2f",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#61dafb",
                        textAlign: "center",
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    >
                      Información del Equipo
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>ID:</strong> {traceabilityAsset.id}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Descripción:</strong> {traceabilityAsset.descripcion}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Marca:</strong> {traceabilityAsset.marca}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Modelo:</strong> {traceabilityAsset.modelo}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Número de Serie:</strong> {traceabilityAsset.numero_de_serie}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Número de Activo:</strong> {traceabilityAsset.numero_de_activo}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Resguardante:</strong> {traceabilityAsset.resguardante}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Estado:</strong>{" "}
                      <span
                        style={{
                          color: traceabilityAsset.status ? "blue" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {traceabilityAsset.status ? "Activo" : "Inactivo"}
                      </span>
                    </Typography>
                  </Box>
                )}

                {/* Botón para Mover de Locación */}
                {traceabilityAsset && (
                  <Box>
                    {traceabilityAsset.location_transfer === null ? (
                      <Button
                        variant="contained"
                        sx={{
                          mb: 3,
                          bgcolor: "#fbc02d",
                          color: "#1e1e2f",
                          fontWeight: "bold",
                          ":hover": { bgcolor: "#f9a825" },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                        onClick={handleMoveLocation}
                      >
                        <i className="fa-solid fa-arrow-right"></i>
                        Mover de Locación
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          mb: 3,
                          bgcolor: "#2196f3",
                          color: "#ffffff",
                          fontWeight: "bold",
                          ":hover": { bgcolor: "#1976d2" },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                        onClick={() => {
                          handleReturnLocation(); 
                        }}
                      >
                        <i className="fa-solid fa-arrow-left"></i>
                        Regresar a Locación Original
                      </Button>
                    )}

                    {/* Mostrar Opciones de Locaciones */}
                    {traceabilityAsset.location_transfer === null && locations.length > 0 && (
                      <Box
                        sx={{
                          p: 2,
                          border: "1px solid #61dafb",
                          borderRadius: "8px",
                          bgcolor: "#1e1e2f",
                          mt: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#61dafb",
                            textAlign: "center",
                            fontWeight: "bold",
                            mb: 2,
                          }}
                        >
                          Seleccionar Nueva Locación
                        </Typography>
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                          {locations
                            .filter((location) => location.id !== traceabilityAsset.location_id) // Filtrar locaciones
                            .map((location) => (
                              <li
                                key={location.id}
                                style={{
                                  cursor: "pointer",
                                  marginBottom: "10px",
                                  padding: "10px",
                                  backgroundColor: "#29293d",
                                  border: "1px solid #61dafb",
                                  borderRadius: "5px",
                                }}
                                onClick={() => handleSelectLocation(location.id)}
                              >
                                <Typography variant="body2">
                                  <strong>{location.name}</strong> (Aula: {location.classroom}, Piso:{" "}
                                  {location.piso})
                                </Typography>
                              </li>
                            ))}
                        </ul>
                      </Box>
                    )}


                  </Box>
                )}

              </>
            )}
            <Button
              variant="contained"
              sx={{
                mt: "auto",
                bgcolor: "#61dafb",
                color: "#000",
                fontWeight: "bold",
                ":hover": { bgcolor: "#50b5e8" },
              }}
              onClick={() => setTraceabilityDrawerOpen(false)}
            >
              Cerrar
            </Button>
          </Box>
        </SwipeableDrawer>

    </div>
  );
};


export default LocationDetails;